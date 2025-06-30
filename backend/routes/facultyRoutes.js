import express from "express";
import db from "../index.js";
import verifyToken from "../middleware/auth.js";
import mailHelper from "../helper.js"

const router = express.Router();

router.get("/:email", verifyToken, (req, res) => {
  const { email } = req.params;
  db.query(
    "SELECT * FROM Faculty WHERE Faculty_Email =?",
    [email],
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        return res.status(404).json({ error: "Faculty not found" });
      }
      return res.json(result[0]);
    },
  );
});

router.get("/courses/:FID", verifyToken, (req, res) => {
  const FID = req.user.FID;
  // Validate inputs
  if (!FID) {
    return res.status(400).json({ error: "Faculty ID required" });
  }

  db.query("SELECT * FROM Courses WHERE FID = ?", [FID], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.get("/course/:CID", verifyToken, (req, res) => {
  const { CID } = req.params;
  db.query(
    `SELECT 
      c.CID,
      c.Course_name,
      c.Course_description,
      c.status,
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

router.post("/complete-course/:CID", verifyToken, (req, res) => {
  const { CID } = req.params;
  const { status } = req.body.status;

  db.query(
    `UPDATE
      Courses
    SET
      status = 'Completed'
    WHERE
      CID`,
    [CID, ],
    (err, result) => {
      if (err) throw err;
      db.query(
        `SELECT
          f.Faculty_Email,
          c.Course_name
          FROM
          Faculty f
          JOIN
          Courses c ON f.FID = c.FID
          WHERE
          c.CID = ?`, [CID], (err, result) => {
            if (err) throw err;
            const facultyEmail = result[0].Faculty_Email;
            mailHelper(facultyEmail, "Course Completed", `<p>You have just completed your course ${result[0].Course_Name}.</p>
            <p>Congratulations</p>`)
          })
      res.json({ message: "Course completed successfully!" });
    },
  );
});

router.post("/submit-for-approval", verifyToken, (req, res) => {
  const { courseName, courseDescription } = req.body;
  const FID = req.user.FID;

  // Validate inputs
  if (!courseName || !courseDescription || !FID) {
    return res
      .status(400)
      .json({ error: "Course name, description, and faculty ID required" });
  }

  db.query("INSERT INTO Waiting_for_approval (Course_name, Course_description, FID) VALUES (?,?,?)", [courseName, courseDescription, FID], (err, result) => {
    if (err) throw err;
    db.query(
      `SELECT
        Faculty_Email
        FROM
        Faculty
        WHERE
        FID = ?`, [FID], (err, result) => {
          if (err) throw err;
          const facultyEmail = result[0].Faculty_Email;
          mailHelper(facultyEmail, "Course Submitted for Approval", `<p>You have just submitted your course ${courseName} for approval.</p>
          <p>You will be notified once it is approved.</p>`)
        })
    res.json({ message: "Course submitted for approval successfully!" });
  });
});

router.get("/waiting-courses/:FID", verifyToken, (req, res) => {
  const FID = req.user.FID;
  db.query(
    "SELECT * FROM Waiting_for_approval WHERE FID = ?",
    [FID],
    (err, result) => {
      if (err) throw err;
      res.json(result);
    },
  );
});

router.post("/new-topic/:CID", verifyToken, (req, res) => {
  const { fileName, fileType, fileLink } = req.body;
  const { CID } = req.params;
  
  // Validate inputs
  if (!CID || !fileName || !fileType || !fileLink) {
    return res
      .status(400)
      .json({ error: "Course ID, file type, and file link required" });
  }

  db.query(
    `INSERT INTO 
    Files 
    (CID, File_name, File_type, File_link, Uploaded_at) 
    VALUES (?, ?, ?, ?, CURDATE())`,
    [CID, fileName, fileType, fileLink],
    (err, result) => {
      if (err) throw err;
      db.query(
        `SELECT
          f.Faculty_Email,
          c.Course_name
          FROM
          Faculty f
          JOIN
          Courses c ON f.FID = c.FID
          WHERE
          c.CID = ?`, [CID], (err, result) => {
            if (err) throw err;
            const facultyEmail = result[0].Faculty_Email;
            mailHelper(facultyEmail, "New Topic Added", `<p>You have just added a new topic ${fileName} to your course ${result[0].Course_Name}.</p>
            <p>Please wait for the reviewers to review it.</p>`)
          })
      res.json({ message: "New topic added successfully!" });
    },
  );
});

router.get("/get-topics/:courseId", verifyToken, (req, res) => {
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

router.get("/get-topic/:File_Id", verifyToken, (req, res) => {
  const { File_Id } = req.params;
  db.query(
    `SELECT * FROM Files WHERE File_id = ?`,
    [File_Id],
    (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    },
  );
});

router.get("/get-feedback/:File_Id", verifyToken, (req, res) => {
  const { File_Id } = req.params;
  db.query(
    `SELECT
    quality,
    rating,
    feedback FROM Feedback WHERE File_id = ?`,
    [File_Id],
    (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    },
  );
});

export default router;
