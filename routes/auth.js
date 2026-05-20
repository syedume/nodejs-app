const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// Register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hash],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User registered" });
    }
  );
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
    if (err || result.length === 0)
      return res.status(401).json({ error: "Invalid user" });

    const user = result[0];

    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user.id }, "secretkey");

    res.json({ message: "Login success", token });
  });
});

module.exports = router;