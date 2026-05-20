CREATE DATABASE IF NOT EXISTS devopsdb;

USE devopsdb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100)
);

INSERT INTO users(name) VALUES
('Umer'),
('DevOps Engineer'),
('Docker User');