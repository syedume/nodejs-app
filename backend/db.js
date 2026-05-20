const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "ecommerce"
});

db.connect((err) => {
  if (err) {
    console.log("DB connection failed", err);
  } else {
    console.log("MySQL Connected");
  }
});

module.exports = db;