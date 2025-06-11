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
    `SELECT Faculty_Email, Password FROM Faculty WHERE Faculty_Email = ?`,
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
              email: result[0].Faculty_Email,
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
          return res.json({message: "Login Successfull", token, user: { email: result[0].Faculty_Email }});
        } else {
          return res.status(401).json({ error: "Invalid password" });
        }
      }
    }
  );
});

app.use("/faculty", facultyRoutes);
app.use("/reviewer", reviewerRoutes);
app.use("/admin", adminRoutes);

export default db;
