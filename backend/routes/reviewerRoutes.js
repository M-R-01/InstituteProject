import express from "express";
import db from "../index.js";

const router = express.Router();

router.get("courses-to-review/:FID", (req, res) => {
  const { FID } = req.params;
  db.query(
    `SELECT 
        c.CID,c.Course_name
    FROM 
        Courses c 
    JOIN
        Course_Reviewer cr on cr.CID = c.CID
    WHERE
        cr.FID = ?;
    `, [FID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve courses" });
    }
    res.json(results);
  });
});

router.get("topics-to-review/:CID", (req, res) => {
    const { CID } = req.params;
    db.query(
        `SELECT
            f.File_id,f.File_name,f.File_link,f.File_type,f.Uploaded_at
        FROM
            Files f
        LEFT JOIN 
            Feedback fd ON f.File_id = fd.File_id
        WHERE
            f.CID=? 
        AND
            fd.File_id IS NULL;`, [CID], (err, results) => {
        if (err) {
        return res.status(500).json({ error: "Failed to retrieve topics" });
        }
        res.json(results);
    });
})

export default router;