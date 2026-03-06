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

-- Note: To manually create a user through the database (e.g. via phpMyAdmin),
-- you can use the following SQL query. Note that the password should ideally be hashed,
-- but if you are creating it manually and the system checks password_verify(), 
-- you'll need a pre-hashed string.
-- Example of inserting a user (with a dummy hashed password for 'password123'):
-- INSERT INTO users (email, password, contact_number) 
-- VALUES ('admin@example.com', '$2y$10$wT0XhYpXlJvW.M/.8PZp.eiq6m1d0LwRcwRjGfR/M18Q6GXZfXy1.', '+1234567890');
