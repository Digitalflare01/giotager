<?php
// backend/api/register.php
require_once '../config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password) || !isset($data->contact_number)) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit();
}

$email = trim($data->email);
$password = password_hash(trim($data->password), PASSWORD_DEFAULT);
$contact_number = trim($data->contact_number);

try {
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(["status" => "error", "message" => "Email already registered"]);
        exit();
    }

    // Insert new user
    $stmt = $pdo->prepare("INSERT INTO users (email, password, contact_number) VALUES (?, ?, ?)");
    if ($stmt->execute([$email, $password, $contact_number])) {
        echo json_encode(["status" => "success", "message" => "Registration successful"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Registration failed"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>