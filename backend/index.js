import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Welcome to the Course Platform Backend!");
  });
  

app.use(express.json()); 


const usersDB = {};


function hashPasswordWithSalt(password, salt) {
  return crypto.createHash("sha256").update(password + salt).digest("hex");
}


app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = hashPasswordWithSalt(password, salt);

  usersDB[username] = { salt, hashedPassword };
  console.log("User registered:", usersDB);

  res.json({ message: "User registered successfully!" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!usersDB[username]) {
    return res.status(400).json({ error: "User not found" });
  }

  const { salt, hashedPassword } = usersDB[username];
  const inputHashed = hashPasswordWithSalt(password, salt);

  if (inputHashed === hashedPassword) {
    return res.json({ message: "Login successful!" });
  } else {
    return res.status(401).json({ error: "Invalid password" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
