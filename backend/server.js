const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());

const db = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "root123",
  database: "devopsdb"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "Backend Running"
  });
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});