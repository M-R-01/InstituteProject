/** @format */

import express from "express";
import crypto from "crypto";
import mysql from "mysql";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";

import facultyRoutes from "./routes/facultyRoutes.js";
import reviewerRoutes from "./routes/reviewerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import mailHelper from "./helper.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db;

function handleConnect() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: 3306,
  });

  db.connect((err) => {
    if (err) {
      console.log(err);
      setTimeout(handleConnect, 2000);
    } else {
      console.log("Connected to database");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  });

  db.on("error", (err) => {
    console.error("Database error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleConnect(); // reconnect
    } else {
      throw err;
    }
  });
}
handleConnect();

const salt = 16;
function hashPasswordWithSalt(password, salt) {
  return crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

app.post("/register", (req, res) => {
  const { name, qualification, email, department, institution, password } =
    req.body;
  // Validate inputs
  if (
    !name ||
    !qualification ||
    !email ||
    !department ||
    !institution ||
    !password
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const hashedPassword = hashPasswordWithSalt(password, salt);

  db.query(
    "SELECT * FROM Faculty WHERE Faculty_Email =?",
    [email],
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      } else {
        db.query(
          "INSERT INTO Faculty (Faculty_Name, Faculty_Qualification, Faculty_Email, Faculty_department, Faculty_Institution, Password) VALUES(?,?,?,?,?,?)",
          [name, qualification, email, department, institution, hashedPassword],
          (err, result) => {
            if (err) throw err;
            mailHelper(email, "Welcome!!", `<p>Welcome ${name}, to our application.</p> <p>Please login to your account to submit your courses for approval.</p>`)
            res.json({ message: "User registered successfully!" });
          }
        );
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const inputHashed = hashPasswordWithSalt(password, salt);

  db.query(
    `SELECT FID, Faculty_Email, Password FROM Faculty WHERE Faculty_Email = ?`,
    [email],
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      } else {
        const { Password: dbHashedPassword } = result[0];
        if (inputHashed === dbHashedPassword) {
          const token = jwt.sign(
            {
              FID: result[0].FID,
              Faculty_Email: result[0].Faculty_Email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "process.env.JWT_EXPIRATION",
            }
          );
          mailHelper(email, "Login Successfull", `<p>You have successfully logged in to your account.</p> 
          <p>If this was not you, please contact us through this email immediately.</p>`)
          return res.json({message: "Login Successfull", token});
        } else {
          return res.status(401).json({ error: "Invalid password" });
        }
      }
    }
  );
});

app.post("/forgot-password", (req, res) => {
  const { email, userType } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!userType || !['faculty', 'student', 'reviewer', 'admin'].includes(userType.toLowerCase())) {
    return res.status(400).json({ error: "Valid user type is required (faculty, student, reviewer, or admin)" });
  }

  let tableName, emailField;
  switch(userType.toLowerCase()) {
    case 'faculty':
      tableName = 'Faculty';
      emailField = 'Faculty_Email';
      break;
    case 'student':
      tableName = 'Student';
      emailField = 'Student_Email';
      break;
    case 'reviewer':
      tableName = 'Reviewer';
      emailField = 'Reviewer_Email';
      break;
    case 'admin':
      tableName = 'Admin';
      emailField = 'Admin_Email';
      break;
  }


  db.query(`SELECT * FROM ${tableName} WHERE ${emailField} = ?`, [email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.length === 0) {

      return res.json({ message: "If the email exists, a password reset link will be sent." });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); 

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    db.query(
      `UPDATE ${tableName} SET reset_token = ?, reset_token_expiry = ? WHERE ${emailField} = ?`,
      [hashedToken, tokenExpiry, email],
      (updateErr) => {
        if (updateErr) {
          console.error('Token update error:', updateErr);
          return res.status(500).json({ error: "Server error" });
        }

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}/${userType}`;

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset Request',
          html: `
            <p>You requested a password reset for your ${userType} account.</p>
            <p>Click <a href="${resetUrl}">here</a> to reset your password or copy and paste the following link in your browser:</p>
            <p>${resetUrl}</p>
            <p>This link is valid for 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `
        };

        transporter.sendMail(mailOptions, (emailErr) => {
          if (emailErr) {
            console.error('Email sending error:', emailErr);
            return res.status(500).json({ error: "Error sending email" });
          }

          res.json({ message: "Password reset link sent to email" });
        });
      }
    );
  });
});

// Reset Password Route
app.post("/reset-password/:token/:userType", (req, res) => {
  const { token, userType } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "New password is required" });
  }

  if (!userType || !['faculty', 'student', 'reviewer', 'admin'].includes(userType.toLowerCase())) {
    return res.status(400).json({ error: "Valid user type is required" });
  }

  let tableName, emailField, passwordField;
  switch(userType.toLowerCase()) {
    case 'faculty':
      tableName = 'Faculty';
      emailField = 'Faculty_Email';
      passwordField = 'Password';
      break;
    case 'student':
      tableName = 'Student';
      emailField = 'Student_Email';
      passwordField = 'Password';
      break;
    case 'reviewer':
      tableName = 'Reviewer';
      emailField = 'Reviewer_Email';
      passwordField = 'Password';
      break;
    case 'admin':
      tableName = 'Admin';
      emailField = 'Admin_Email';
      passwordField = 'Password';
      break;
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  db.query(
    `SELECT * FROM ${tableName} WHERE reset_token = ? AND reset_token_expiry > ?`,
    [hashedToken, new Date()],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: "Server error" });
      }

      if (result.length === 0) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      const hashedPassword = hashPasswordWithSalt(password, salt);

      db.query(
        `UPDATE ${tableName} SET ${passwordField} = ?, reset_token = NULL, reset_token_expiry = NULL WHERE ${emailField} = ?`,
        [hashedPassword, result[0][emailField]],
        (updateErr) => {
          if (updateErr) {
            console.error('Password update error:', updateErr);
            return res.status(500).json({ error: "Server error" });
          }

          res.json({ message: "Password reset successful" });
        }
      );
    }
  );
});

app.use("/faculty", facultyRoutes);
app.use("/reviewer", reviewerRoutes);
app.use("/admin", adminRoutes);

export default db;
