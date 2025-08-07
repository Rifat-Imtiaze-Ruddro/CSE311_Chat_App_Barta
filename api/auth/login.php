<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT * FROM user WHERE username = :username");
    $stmt->execute([':username' => $data['username']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($data['password'], $user['password'])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Invalid username or password"
        ]);
        exit();
    }

    // Remove sensitive data before returning
    unset($user['password']);

    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "user" => $user
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>