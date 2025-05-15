/** @format */

import db from "../index.js";
import express from "express";

const router = express.Router();

router.get("/metrics", (req, res) => {
  db.query(
    `SELECT 
    (SELECT COUNT(*) FROM Courses) AS courseCount,
    (SELECT COUNT(*) FROM Faculty) AS facultyCount,
    (SELECT COUNT(*) FROM Waiting_for_approval) AS waitingCount,
    (SELECT COUNT(*) FROM Files) AS fileCount,
    (SELECT COUNT(*) * 1.0 / (SELECT COUNT(*) FROM Courses) FROM Files) AS filePerCourse
   `,
    (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    },
  );
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
  const { courseName, courseDescription, status } = req.body;

  // Validate inputs
  if (!courseName || !courseDescription || !status) {
    return res.status(400).json({ error: "Course name, description, and status required" });
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
          const facultyId = result[0].FID;
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

router.get("/faculty", (req, res) => {
  db.query(
    `SELECT 
        f.FID,
        f.Faculty_Name,
        f.Faculty_Qualification,
        f.Faculty_department,
        f.Faculty_Institution,
        COUNT(DISTINCT c.CID) AS Number_of_Courses_Taught,
        COUNT(DISTINCT r.CID) AS Number_of_Courses_Reviewed
    FROM 
        Faculty f
    LEFT JOIN 
        Courses c ON f.FID = c.FID
    LEFT JOIN 
        Reviews r ON f.FID = r.FID
    GROUP BY 
        f.FID, f.Faculty_Name, f.Faculty_Qualification, f.Faculty_department, f.Faculty_Institution`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    },
  );
});

router.get("/courses", (req, res) => {
  db.query(
    `SELECT 
      c.CID,
      c.Course_name,
      c.created_at, 
      f.Faculty_Name, 
      f.Faculty_Qualification, 
      f.Faculty_department, 
      f.Faculty_Institution, 
      rf.Faculty_Name as Reviewer  
    FROM 
      Courses c 
    JOIN 
      Faculty f ON c.FID=f.FID 
    LEFT JOIN 
      Course_Reviewer r on c.CID=r.CID 
    LEFT JOIN 
      Faculty rf on r.FID=rf.FID`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    },
  );
});

router.get("/course/:CID", (req, res) => {
  const { CID } = req.params;
  db.query(
    `SELECT 
      c.CID,
      c.Course_name,
      c.Course_description,
      f.Faculty_Name,
      rf.Faculty_Name AS Reviewer,
      COALESCE(fc.file_count, 0) AS File_Count
    FROM 
      Courses c
    JOIN 
      Faculty f ON c.FID = f.FID
    LEFT JOIN 
      Course_Reviewer r ON c.CID = r.CID
    LEFT JOIN 
      Faculty rf ON r.FID = rf.FID
    LEFT JOIN (
      SELECT 
        CID, 
        COUNT(*) AS file_count
      FROM 
        Files
      GROUP BY 
        CID
    ) fc ON c.CID = fc.CID
    WHERE 
      c.CID = ?`,
    [CID],
    (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    },
  );
});

router.get("/get-topics/:courseId", (req, res) => {
  const { courseId } = req.params;

  // Validate inputs
  if (!courseId) {
    return res.status(400).json({ error: "Course ID required" });
  }

  db.query("SELECT * FROM Files WHERE CID = ?", [courseId], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.get("/available-reviewers", (req, res) => {
  db.query(
    `SELECT 
      f.FID,
      f.Faculty_Name,
      f.Faculty_Qualification,
      f.Faculty_department,
      f.Faculty_Institution,
      COUNT(r.CID) AS Number_of_Courses_Reviewing
    FROM 
      Faculty f
    LEFT JOIN 
      Course_Reviewer r ON f.FID = r.FID
    GROUP BY 
      f.FID, f.Faculty_Name, f.Faculty_Qualification, f.Faculty_department, f.Faculty_Institution
    HAVING 
      COUNT(r.CID) < 3`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    },
  );
});

export default router;
