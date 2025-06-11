import express from "express";
import db from "../index.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/:email", verifyToken, (req, res) => {
  const { email } = req.params;
  db.query("SELECT * FROM Faculty WHERE Faculty_Email =?", [email], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: "Faculty not found" });
    }
    res.json(result[0]);
  });
});

router.get("/courses/:facultyId", verifyToken, (req, res) => {
  const { facultyId } = req.params;

  // Validate inputs
  if (!facultyId) {
    return res.status(400).json({ error: "Faculty ID required" });
  }

  db.query("SELECT * FROM Courses WHERE FID = ?", [facultyId], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/submit-for-approval", (req, res) => {
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

router.post("/new-topic", (req, res) => {
  const { courseId, file_name, file_type, file_link } = req.body;
  console.log("Request received:", req.body);

  // Validate inputs
  if (!courseId || !file_name || !file_type || !file_link) {
    return res.status(400).json({ error: "Course ID, file type, and file link required" });
  }

  db.query(
    `INSERT INTO 
    Files 
    (File_Id, CID, File_name, File_type, File_link, Uploaded_at) 
    VALUES (?, ?, ?, ?, CURDATE())`,
    [courseId, file_name, file_type, file_link],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "New topic added successfully!" });
    },
  );
});

router.get("/get-topics/:courseId", (req, res) => {
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



export default router;