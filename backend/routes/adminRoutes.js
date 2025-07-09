/** @format */

import db from "../index.js";
import express from "express";
import mailHelper from "../helper.js";
import verifyAdmin from "../middleware/adminAuth.js"

const router = express.Router();

router.get("/metrics", verifyAdmin, (req, res) => {
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

router.get("/get-waiting-courses", verifyAdmin, (req, res) => {
  db.query(
    "SELECT w.Course_name,w.Course_description,f.Faculty_Name,f.Faculty_Qualification,f.Faculty_department,f.Faculty_Institution FROM Waiting_for_approval w LEFT JOIN Faculty f ON w.FID=f.FID",
    (err, result) => {
      if (err) throw err;
      res.json(result);
    },
  );
});

router.post("/approve-waiting-courses", verifyAdmin, (req, res) => {
  const { courseName, courseDescription, status } = req.body;
  console.log(req.body);
  // Validate inputs
  if (!courseName || !courseDescription || !status) {
    return res
      .status(400)
      .json({ error: "Course name, description, and status required" });
  }

  db.query(
    "SELECT * FROM Waiting_for_approval WHERE Course_name = ?",
    [courseName],
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res
          .status(400)
          .json({ error: "Course not found in waiting list" });
      } else {
        db.query(
          "SELECT Faculty_Email FROM Faculty WHERE FID = ?",
          [result[0].FID],
          (err, result) => {
            if (err) throw err;
            const facultyEmail = result[0].Faculty_Email;

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
                      res.json({
                        message:
                          "Course approved and removed from waiting list",
                      });
                      mailHelper(
                        facultyEmail,
                        "Course Approval",
                        `<p>Your course ${courseName} has been approved.</p> <p>Please login to your account to add topics to your course.</p>`,
                      );
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
                  mailHelper(
                    facultyEmail,
                    "Course Rejection",
                    `<p>Your course ${courseName} has been rejected.</p>`,
                  );
                  res.json({
                    message: "Course rejected and removed from waiting list",
                  });
                },
              );
            }
          },
        );
      }
    },
  );
});

router.get("/faculty", verifyAdmin, (req, res) => {
  db.query(
    `SELECT 
        f.FID,
        f.Faculty_Name,
        f.Faculty_Qualification,
        f.Faculty_department,
        f.Faculty_Email,
        f.Faculty_Institution,
        COUNT(DISTINCT c.CID) AS Number_of_Courses_Taught,
        COUNT(DISTINCT r.CID) AS Number_of_Courses_Reviewed
    FROM 
        Faculty f
    LEFT JOIN 
        Courses c ON f.FID = c.FID
    LEFT JOIN 
        Course_Reviewer r ON f.FID = r.FID
    GROUP BY 
        f.FID, f.Faculty_Name, f.Faculty_Qualification, f.Faculty_department,f.Faculty_Email, f.Faculty_Institution`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    },
  );
});

router.get("/courses", verifyAdmin, (req, res) => {
  db.query(
    `SELECT 
      c.CID,
      c.Course_name,
      c.created_at, 
      f.Faculty_Name, 
      f.Faculty_Qualification, 
      f.Faculty_department, 
      f.Faculty_Institution, 
      rf.Faculty_Name as Reviewer,
      r.status as Reviewer_Status
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

router.get("/course/:CID", verifyAdmin, (req, res) => {
  const { CID } = req.params;
  db.query(
    `SELECT 
      c.CID,
      c.Course_name,
      c.Course_description,
      f.Faculty_Name,
      rf.FID AS Reviewer_Id,
      rf.Faculty_Name AS Reviewer,
      r.status as Reviewer_Status,
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

router.get("/get-topics/:courseId", verifyAdmin, (req, res) => {
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

router.get("/available-reviewers", verifyAdmin, (req, res) => {
  db.query(
    `SELECT 
      f.FID,
      f.Faculty_Name,
      f.Faculty_Qualification,
      f.Faculty_department,
      f.Faculty_Institution,
      COUNT(c.CID) AS Number_of_Courses_Reviewing
    FROM 
      Faculty f
    LEFT JOIN 
      Course_Reviewer r ON f.FID = r.FID
    LEFT JOIN
      Courses c ON r.CID = c.CID AND c.status = 'Active'
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

router.post("/assign-reviewers", verifyAdmin, (req, res) => {
  const { courseId, reviewer } = req.body;

  // Validate inputs
  if (!courseId || !reviewer) {
    return res.status(400).json({ error: "Course ID, reviewer required" });
  }

  db.query(
    "SELECT CID, FID FROM Courses WHERE CID =?",
    [courseId],
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(400).json({ error: "Course not found" });
      } else {
        db.query(
          "INSERT INTO Course_Reviewer (CID,FID,status) VALUES(?,?,?)",
          [courseId, reviewer, "pending"],
          (err, result) => {
            if (err) throw err;
            db.query(
              `SELECT Faculty_Email FROM Faculty WHERE FID = ?`,
              [reviewer],
              (err, result) => {
                if (err) throw err;
                const reviewerEmail = result[0].Faculty_Email;
                mailHelper(
                  reviewerEmail,
                  "Review Request",
                  `<p>You have been assigned to review a new courses.</p> 
                <p>Please login to your account to accept or decline the request as soon as possible.</p>`,
                );
              },
            );
            res.json({ message: "Reviewer assigned successfully!" });
          },
        );
      }
    },
  );
});

router.delete("/delete-review-request", verifyAdmin, (req, res) => {
  const { courseId, reviewer } = req.body;

  // Validate inputs
  if (!courseId || !reviewer) {
    return res.status(400).json({ error: "Course ID, reviewer required" });
  }

  db.query(
    "DELETE FROM Course_Reviewer WHERE CID = ? AND FID = ?",
    [courseId, reviewer],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Review request deleted successfully!" });
    },
  );
});

router.get("/check-feedbacks", verifyAdmin, (req, res) => {
  db.query(
    `SELECT
    c.CID, 
    c.Course_Name, 
    cr.FID AS Reviewer, 
    fi.File_name, 
    f.Faculty_Email AS Reviewer_Email
    FROM
        Courses c 
    JOIN
        Course_Reviewer cr ON c.CID = cr.CID 
    JOIN 
        Files fi ON c.CID = fi.CID
    JOIN
        Faculty f ON cr.FID = f.FID
    LEFT JOIN 
        Feedback fd ON fi.File_id = fd.File_id AND cr.FID = fd.FID
    WHERE 
        fd.File_id IS NULL;`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    },
  );
});

router.post("/send-reminder", verifyAdmin, (req, res) => {
  const { courseName, fileName, reviewerEmail } = req.body;

  // Validate inputs
  if (!courseName || !fileName || !reviewerEmail) {
    return res
      .status(400)
      .json({ error: "Course name, file name, and reviewer email required" });
  }

  db.query(
    `SELECT 
      c.Course_name, 
      f.Faculty_Email 
    FROM 
      Courses c 
    JOIN 
      Course_Reviewer cr ON c.CID = cr.CID 
    JOIN 
      Faculty f ON cr.FID = f.FID 
    WHERE 
      c.CID = ? AND f.Faculty_Email = ?`,
    [courseId, reviewerEmail],
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(404).json({ error: "Course or reviewer not found" });
      }
      mailHelper(
        reviewerEmail,
        "Reminder to submit feedback",
        `<p>This is a reminder to submit feedback for the topic ${fileName} under course ${courseName}.</p>`,
      );
      res.json({ message: "Reminder sent successfully!" });
    },
  );
});

router.post("/send-all-reminders", verifyAdmin, (req, res) => {
  const feedbacks = req.body.feedbacks;
  if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
    return res.status(400).json({ error: "Feedbacks array is required" });
  }
  console.log("Sending reminders for feedbacks:", feedbacks);
  feedbacks.forEach((feedback) => {
    const { courseName, fileName, reviewerEmail } = feedback;
    mailHelper(
      reviewerEmail,
      "Reminder to submit feedback",
      `<p>This is a reminder to submit feedback for the topic ${fileName} under course ${courseName}.</p>`,
    );
  });
});

export default router;
