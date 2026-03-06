<?php
$host = 'localhost';
$user = 'u197294049_location';
$pass = 'Parayulla@123';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = file_get_contents('database.sql');
    $pdo->exec($sql);
    echo "Database and tables created successfully!";
} catch (PDOException $e) {
    echo "Failed: " . $e->getMessage();
}
?>