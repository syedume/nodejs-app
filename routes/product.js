const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

router.post("/", (req, res) => {
  const { name, price } = req.body;

  db.query(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    [name, price],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Product added" });
    }
  );
});

module.exports = router;