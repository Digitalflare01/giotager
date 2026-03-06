<?php
// backend/api/login.php
require_once '../config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email)) {
    echo json_encode(["status" => "error", "message" => "Missing email"]);
    exit();
}

$email = trim($data->email);

try {
    // Special handling for Google Login vs Email/Password login
    if (isset($data->is_google) && $data->is_google) {
        // Handle Google Auth
        // Google auth implies email is verified on Google's end
        $stmt = $pdo->prepare("SELECT id, email, contact_number FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            echo json_encode(["status" => "success", "user" => $user]);
        } else {
            // Need contact number to complete registration via google
            echo json_encode(["status" => "error", "message" => "User not found. Please register first."]);
        }
        exit();
    }

    // Regular Email/Password auth
    if (!isset($data->password)) {
        echo json_encode(["status" => "error", "message" => "Missing password"]);
        exit();
    }

    $password = trim($data->password);

    $stmt = $pdo->prepare("SELECT id, email, password, contact_number FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        unset($user['password']); // Don't send password hash back
        echo json_encode(["status" => "success", "user" => $user]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>