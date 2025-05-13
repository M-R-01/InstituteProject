/** @format */

import db from "../index.js";
import express from "express";

const router = express.Router();

router.get("/metrics", (req, res) => {
  db.query(`SELECT 
    (SELECT COUNT(*) FROM Courses) AS courseCount,
    (SELECT COUNT(*) FROM Faculty) AS facultyCount,
    (SELECT COUNT(*) FROM Waiting_for_approval) AS waitingCount,
    (SELECT COUNT(*) FROM Files) AS fileCount,
    (SELECT COUNT(*) * 1.0 / (SELECT COUNT(*) FROM Courses) FROM Files) AS filePerCourse
   `, (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

router.get("/get-waiting-courses", (req, res) => {
  db.query(
    "SELECT w.Course_name,w.Course_description,f.Faculty_Name,f.Faculty_Qualification,f.Faculty_department,f.Faculty_Institution FROM Waiting_for_approval w LEFT JOIN Faculty f ON w.FID=f.FID",
    (err, result) => {
      if (err) throw err;
      res.json(result);
    },
  );
});

router.post("/approve-waiting-courses", (req, res) => {
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

router.post("/assign-reviewers", (req, res) => {
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

router.get("/courses", (req, res) => {
  db.query(
    "SELECT c.Course_name, c.created_at, f.Faculty_Name, f.Faculty_Qualification, f.Faculty_department, f.Faculty_Institution, rf.Faculty_Name as Reviewer  FROM Courses c JOIN Faculty f ON c.FID=f.FID JOIN Course_Reviewer r on c.CID=r.CID join Faculty rf on r.FID=rf.FID",
    (err, result) => {
      if (err) throw err;
      res.json(result);
    },
  );
});

export default router;
