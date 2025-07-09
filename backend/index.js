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
  db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: 3306,
  });

  // Test a connection from the pool
  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      setTimeout(handleConnect, 2000); // retry after delay
    } else {
      console.log("Connected to database");
      connection.release(); // release back to pool

      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
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
            mailHelper(
              email,
              "Welcome!!",
              `<p>Welcome ${name}, to our application.</p> <p>Please login to your account to submit your courses for approval.</p>`,
            );
            res.json({ message: "User registered successfully!" });
          },
        );
      }
    },
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
            },
          );
          mailHelper(
            email,
            "Login Successfull",
            `<p>You have successfully logged in to your account.</p> 
          <p>If this was not you, please contact us through this email immediately.</p>`,
          );
          return res.json({ message: "Login Successfull", token });
        } else {
          return res.status(401).json({ error: "Invalid password" });
        }
      }
    },
  );
});

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  db.query(
    `SELECT * FROM Faculty WHERE Faculty_Email = ?`,
    [email],
    (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Server error" });
      }

      if (result.length === 0) {
        return res.json({
          message: "If the email exists, a reset link will be sent.",
        });
      }

      // Create JWT with 10-minute expiry
      const token = jwt.sign({ email }, process.env.RESET_PASSWORD_SECRET, {
        expiresIn: "10m",
      });

      const resetUrl = `${process.env.FRONTEND_DOMAIN}/resetpassword/${token}`;

      mailHelper(
        email,
        "Password Reset",
        `<p>You have requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>This link will expire in 10 minutes.</p>`,
      );

      res.json({
        message: "If the email exists, a password reset link will be sent.",
      });
    },
  );
});

app.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    const email = decoded.email;

    // Now update password
    const hashedPassword = hashPasswordWithSalt(newPassword, salt);

    db.query(
      `UPDATE Faculty SET Password = ? WHERE Faculty_Email = ?`,
      [hashedPassword, email],
      (err) => {
        if (err) {
          console.error("Password update failed:", err);
          return res.status(500).json({ error: "Failed to reset password" });
        }

        res.json({ message: "Password has been reset successfully" });
      },
    );
  } catch (err) {
    console.error("Invalid or expired token:", err);
    return res.status(400).json({ error: "Invalid or expired reset token" });
  }
});

app.post("/admin-login", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  db.query(
    `SELECT * FROM Admins WHERE Admin_Email = ?`,
    [email],
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(401).json({ error: "Invalid email" });
      } else {
        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = hashPasswordWithSalt(token, salt);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        db.query(
          `INSERT INTO Magic_Link (Admin_Email, Hashed_Token, Expires_At) VALUES(?,?,?)`,
          [email, hashedToken, expiresAt],
          (err, result) => {
            if (err) throw err;
            mailHelper(
              email,
              "Admin Login",
              `<p>You have requested  link to login to your account.</p>
            <p><a href="${process.env.FRONTEND_DOMAIN}/admin/verify/${token}">Click here to login</a></p>`,
            );
          },
        );

        return res.json({ message: "Login Successfull" });
      }
    },
  );
});

app.post("/admin-verify/:token", (req, res) => {
  const { token } = req.params;
  const hashedToken = hashPasswordWithSalt(token, salt);
  db.query(
    `SELECT * FROM Magic_Link WHERE Hashed_Token = ?`,
    [hashedToken],
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(401).json({ error: "Invalid token" });
      } else {
        db.query(
          `DELETE FROM Magic_Link WHERE Hashed_Token = ?`,
          [hashedToken],
          (err, result) => {
            if (err) throw err;
          },
        );
        const adminToken = jwt.sign(
          {
            Admin_Email: result[0].Admin_Email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "3h",
          },
        );
        return res.json({ message: "Login Successfull", adminToken });
      }
    },
  );
});

app.use("/faculty", facultyRoutes);
app.use("/reviewer", reviewerRoutes);
app.use("/admin", adminRoutes);

export default db;
