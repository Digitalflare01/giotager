<?php
// backend/api/save_data.php
require_once '../config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || !isset($data->original_filename) || !isset($data->export_format)) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit();
}

$user_id = $data->user_id;
$original_filename = $data->original_filename;
$export_format = $data->export_format;
// Optional location fields
$new_latitude = isset($data->new_latitude) ? $data->new_latitude : null;
$new_longitude = isset($data->new_longitude) ? $data->new_longitude : null;

try {
    $stmt = $pdo->prepare("INSERT INTO uploads (user_id, original_filename, new_latitude, new_longitude, export_format) VALUES (?, ?, ?, ?, ?)");
    if ($stmt->execute([$user_id, $original_filename, $new_latitude, $new_longitude, $export_format])) {
        echo json_encode(["status" => "success", "message" => "Upload data saved"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to save upload data"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>