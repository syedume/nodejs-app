const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Fake product data (for now)
const products = [
  { id: 1, name: "Laptop", price: 50000 },
  { id: 2, name: "Phone", price: 20000 },
  { id: 3, name: "Headphones", price: 2000 }
];

let cart = [];

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "Backend API" });
});

// Products API
app.get("/products", (req, res) => {
  res.json(products);
});

// Add to cart
app.post("/cart/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (product) {
    cart.push(product);
  }
  res.json({ message: "Added to cart", cart });
});

// View cart
app.get("/cart", (req, res) => {
  res.json(cart);
});

app.listen(7400, () => {
  console.log("Backend running on port 7400");
});