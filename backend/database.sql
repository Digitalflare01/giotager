-- Database Schema for SwichLocation
-- To execute this file, run it in your MySQL client, e.g., phpMyAdmin, or from the command line:
-- mysql -u your_username -p your_database_name < database.sql

CREATE DATABASE IF NOT EXISTS swichlocation;
USE swichlocation;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) DEFAULT NULL, -- Nullable to allow future Google OAuth login without password
    contact_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    new_latitude DECIMAL(10, 8),
    new_longitude DECIMAL(11, 8),
    export_format VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
