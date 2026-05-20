const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "E-Commerce Backend" });
});

// Get all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Add product
app.post("/products", (req, res) => {
  const { name, price } = req.body;

  db.query(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    [name, price],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Product added" });
    }
  );
});

app.listen(5000, "0.0.0.0", () => {})
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully");
});