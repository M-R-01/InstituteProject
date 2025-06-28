import express from "express";
import db from "../index.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/courses-to-review", verifyToken, (req, res) => {
    const FID = req.user.FID;
    db.query(
        `SELECT 
            c.CID,
            c.Course_name,
            COUNT(f.File_id) AS total_files,
            SUM(CASE WHEN fb.File_id IS NULL THEN 1 ELSE 0 END) AS files_without_feedback
        FROM 
            Courses c
        JOIN 
            Course_Reviewer cr ON cr.CID = c.CID
        LEFT JOIN 
            Files f ON f.CID = c.CID
        LEFT JOIN 
            Feedback fb ON fb.File_id = f.File_iD
        WHERE 
            cr.FID = ?
        GROUP BY 
            c.CID, c.Course_name;
    `,
        [FID],
        (err, results) => {
            if (err) {
                console.log(err);
                return res
                    .status(500)
                    .json({ error: "Failed to retrieve courses" });
            }
            res.json(results);
        },
    );
});

router.get("/review-requests", verifyToken, (req, res) => {
    const FID = req.user.FID;
    db.query(
        `SELECT
            c.CID,
            c.Course_name,
            c.Course_description,
            f.Faculty_Name,
            f.Faculty_Institution
        FROM
            Course_Reviewer cr
        JOIN
            Courses c ON cr.CID = c.CID
        JOIN
            Faculty f ON c.FID = f.FID
        WHERE
            cr.FID = ? AND cr.status = 'pending';`,
        [FID],
        (err, results) => {
            if (err) {
                console.log(err);
                return res
                    .status(500)
                    .json({ error: "Failed to retrieve review requests" });
            }
            res.json(results);
        },
    );
});

router.post("/accept-review-request/:CID", verifyToken, (req, res) => {
    const { CID } = req.params;
    const FID = req.user.FID;
    const {status} = req.body;

    if (status === "accepted") {
        db.query(
            `UPDATE
                Course_Reviewer
            SET
                status = 'accepted'
            WHERE
                CID = ? AND FID = ?`,
            [CID, FID],
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res
                        .status(500)
                        .json({ error: "Failed to accept review request" });
                }
                res.json({ message: "Review request accepted" });
            },
        );
    } else if (status === "declined") {
        db.query(
            `DELETE FROM
                Course_Reviewer
            WHERE
                CID = ? AND FID = ?`, 
        [CID, FID],
        (err, results) => {
            if (err) {
                console.log(err);
                return res
                    .status(500)
                    .json({ error: "Failed to reject review request" });
            }
            res.json({ message: "Review request rejected" });
        })
    } else {
        return res.status(400).json({ error: "Invalid status" });
    }
});

router.get("/pending-feedbacks/:FID", verifyToken, (req, res) => {
    console.log("Request received for pending feedbacks");
    const FID = req.user.FID;
    db.query(
        `SELECT 
        fi.File_id,
        c.Course_Name, 
        fi.File_name, 
        fi.File_link
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
            fd.File_id IS NULL AND cr.FID = ?;`,
        [FID],
        (err, results) => {
            if (err) {
                console.log(err);
                return res
                    .status(500)
                    .json({ error: "Failed to retrieve pending feedbacks" });
            }
            res.json(results);
        },
    );
});

router.get("/topics-to-review/:CID", verifyToken, (req, res) => {
    const { CID } = req.params;

    db.query(
        `SELECT
            f.File_id,
            f.File_name,
            f.File_link,
            f.File_type,
            f.Uploaded_at,
            CASE 
                WHEN fd.File_id IS NOT NULL THEN 'Yes'
                ELSE 'No'
            END AS has_feedback
        FROM
            Files f
        LEFT JOIN 
            Feedback fd ON f.File_id = fd.File_id
        WHERE
            f.CID = ?
        GROUP BY
            f.File_id;
        `,
        [CID],
        (err, results) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: "Failed to retrieve topics" });
            }
            res.json(results);
        },
    );
});

router.post("/submit-feedback/:File_id", verifyToken, (req, res) => {
    const { File_id } = req.params;
    const { CID, feedback, quality, rating } = req.body;
    const FID = req.user.FID;

    db.query(
        `INSERT INTO 
            Feedback (File_id, FID, CID, feedback, quality, rating) 
        VALUES (?, ?, ?, ?)`,
        [File_id, FID, CID, feedback, quality, rating],
        (err, results) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: "Failed to submit feedback" });
            }
            res.json({ message: "Feedback submitted successfully" });
        },
    );
});

router.put("/edit-feedback/:File_id", verifyToken, (req, res) => {
    const { File_id } = req.params;
    const { CID, feedback, quality, rating } = req.body;
    const FID = req.user.FID;

    db.query(
        `UPDATE
            Feedback
        SET
            feedback = ?,quality = ?, rating = ? 
        WHERE
            File_id = ? AND FID = ? AND CID = ?`,
        [feedback, quality, rating, File_id, FID, CID],
        (err, results) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: "Failed to update feedback" });
            }
            res.json({ message: "Feedback updated successfully" });
        },
    );
});

export default router;
