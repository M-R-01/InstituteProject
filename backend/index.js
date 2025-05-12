/** @format */

import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import handleConnect from "./db.js";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


handleConnect();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
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

  db.query("SELECT * FROM Faculty WHERE Faculty_Email =?", [email], (err, result) => {
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
          return res.json({ message: "Login successful!" });
        } else {
          return res.status(401).json({ error: "Invalid password" });
        }
      }
    },
  );
});

app.get("/faculty/:email", (req, res) => {
  const { email } = req.params;
  db.query("SELECT * FROM Faculty WHERE Faculty_Email =?", [email], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: "Faculty not found" });
    }
    res.json(result[0]);
  });
});

app.post("/submit-for-approval", (req, res) => {
  const { courseName, courseDescription, facultyId } = req.body;

  // Validate inputs
  if (!courseName || !courseDescription || !facultyId) {
    return res.status(400).json({ error: "Course name, description, and faculty ID required" });
  }

  const sql =
    "INSERT INTO Waiting_for_approval (Course_name, Course_description, FID) VALUES (?,?,?)";

  db.query(sql, [courseName, courseDescription, facultyId], (err, result) => {
    if (err) throw err;
    res.json({ message: "Course submitted for approval successfully!" });
  });
});

app.post("/new-topic", (req, res) => {
  const { courseId, file_name, file_type, file_link } = req.body;

  // Validate inputs
  if (!courseId || !file_name || !file_type || !file_link) {
    return res.status(400).json({ error: "Course ID, file type, and file link required" });
  }

  db.query(
    "INSERT INTO Files (CID, file_name, file_type, file_link, uploaded_at) VALUES (?, ?, ?, ?,CURDATE())",
    [courseId, file_name, file_type, file_link],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "New topic added successfully!" });
    },
  );
});

app.get("/get-topics/:courseId", (req, res) => {
  const { courseId } = req.params;

  // Validate inputs
  if (!courseId) {
    return res.status(400).json({ error: "Course ID required" });
  }

  db.query("SELECT * FROM Files WHERE CID = ?", courseId, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});



//admin-APIs
app.get("/get-waiting-courses", (req, res) => {
  db.query(
    "SELECT w.Course_name,w.Course_description,f.Faculty_Name,f.Faculty_Qualification,f.Faculty_department,f.Faculty_Institution FROM Waiting_for_approval w LEFT JOIN Faculty f ON w.FID=f.FID",
    (err, result) => {
      if (err) throw err;
      res.json(result);
    },
  );
});

app.post("/approve-waiting-courses", (req, res) => {
  const { courseName, courseDescription, facultyId, status } = req.body;

  // Validate inputs
  if (!courseName || !courseDescription || !facultyId || !status) {
    return res
      .status(400)
      .json({ error: "Course name, description, faculty ID, and status required" });
  }

  db.query(
    "SELECT * FROM Waiting_for_approval WHERE Course_name = ?",
    [courseName],
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(400).json({ error: "Course not found in waiting list" });
      } else {
        if (status === "approved") {
          db.query(
            "INSERT INTO Courses (Course_name, Course_description, FID, created_at) VALUES (?,?,?,CURDATE())",
            [courseName, courseDescription, facultyId],
            (err, result) => {
              if (err) throw err;
              db.query(
                "DELETE FROM Waiting_for_approval WHERE Course_name =?",
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
            "DELETE FROM Waiting_for_approval WHERE Course_name =?",
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



app.post("/assign-reviewers", (req, res) => {
  const { courseId, reviewer } = req.body;

  // Validate inputs
  if (!courseId || !reviewer) {
    return res.status(400).json({ error: "Course ID, reviewer required" });
  }

  db.query("SELECT CID FROM Courses WHERE CID =?", [courseId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(400).json({ error: "Course not found" });
    } else {
      db.query(
        "INSERT INTO Course_Reviewer (CID,FID) VALUES(?,?)",
        [courseId, reviewer],
        (err, result) => {
          if (err) throw err;
          res.json({ message: "Reviewer assigned successfully!" });
        },
      );
    }
  });
});

app.get("/courses", (req, res) => {
  db.query(
    "SELECT c.Course_name, c.created_at, f.Faculty_Name, f.Faculty_Qualification, f.Faculty_department, f.Faculty_Institution, rf.Faculty_Name as Reviewer  FROM Courses c JOIN Faculty f ON c.FID=f.FID JOIN Course_Reviewer r on c.CID=r.CID join Faculty rf on r.FID=rf.FID" ,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    },
  );
});
