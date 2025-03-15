/** @format */

import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import db from "./db.js";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
});

const salt = 16;
function hashPasswordWithSalt(password, salt) {
  return crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

app.post("/register", (req, res) => {
  const { name, qualification, email, department, institution, password } = req.body;

  // Validate inputs
  if (!name || !qualification || !email || !department || !institution || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const hashedPassword = hashPasswordWithSalt(password, salt);

  db.query("SELECT * FROM Faculty WHERE email =?", [email], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    } else {
      db.query(
        "INSERT INTO Faculty (name, qualification, email, department, institution, password, salt) VALUES(?,?,?,?,?,?,?)",
        [name, qualification, email, department, institution, hashedPassword, salt],
        (err, result) => {
          if (err) throw err;
          console.log("User registered successfully!");
          res.json({ message: "User registered successfully!" });
        },
      );
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const inputHashed = hashPasswordWithSalt(password, salt);

  db.query(`SELECT email, password FROM Faculty WHERE email = ?`, [email], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    } else {
      const { password: dbHashedPassword } = result[0];
      if (inputHashed === dbHashedPassword) {
        return res.json({ message: "Login successful!" });
      } else {
        return res.status(401).json({ error: "Invalid password" });
      }
    }
  });
});

app.post("/submit-for-approval", (req, res) => {
  const { courseName, courseDescription, facultyId } = req.body;

  // Validate inputs
  if (!courseName || !courseDescription || !facultyId) {
    return res.status(400).json({ error: "Course name, description, and faculty ID required" });
  }

  const sql =
    "INSERT INTO Waiting_for_approval (course_name, couse_description, faculty_id) VALUES (?,?,?)";

  db.query(sql, [courseName, courseDescription, facultyId], (err, result) => {
    if (err) throw err;
    res.json({ message: "Course submitted for approval successfully!" });
  });
});

//admin-APIs

app.get("/get-waiting-courses", (req, res) => {
  db.query(
    "SELECT w.course_name,w.couse_description,f.name,f.qualification,f.department,f.institution FROM Waiting_for_approval w LEFT JOIN Faculty f ON w.faculty_id=f.faculty_id",
    (err, result) => {
      if (err) throw err;
      res.json(result);
    },
  );
});

app.post("/waiting-courses", (req, res) => {
  const { courseName, courseDescription, facultyId, status } = req.body;

  // Validate inputs
  if (!courseName || !courseDescription || !facultyId || !status) {
    return res
      .status(400)
      .json({ error: "Course name, description, faculty ID, and status required" });
  }

  db.query(
    "SELECT * FROM Waiting_for_approval WHERE course_name = ?",
    [courseName],
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(400).json({ error: "Course not found in waiting list" });
      } else {
        if (status === "approved") {
          db.query(
            "INSERT INTO Courses (course_name, course_description, faculty_id, created_at) VALUES (?,?,?,CURDATE())",
            [courseName, courseDescription, facultyId],
            (err, result) => {
              if (err) throw err;
              db.query(
                "DELETE FROM Waiting_for_approval WHERE course_name =?",
                [courseName],
                (err, result) => {
                  if (err) throw err;
                  res.json({ message: "Course approved and removed from waiting list" });
                },
              );
            },
          );
        } else if (status === "rejected") {
          db.query(
            "DELETE FROM Waiting_for_approval WHERE course_name =?",
            [courseName],
            (err, result) => {
              if (err) throw err;
              res.json({ message: "Course rejected and removed from waiting list" });
            },
          );
        }
      }
    },
  );
});
