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
    // Check if username or email already exists
    $check = $conn->prepare("SELECT * FROM user WHERE username = :username OR email = :email");
    $check->execute([
        ':username' => $data['username'],
        ':email' => $data['email']
    ]);
    
    if ($check->rowCount() > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Username or email already exists"
        ]);
        exit();
    }

    // Hash password
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

    // Insert user
    $stmt = $conn->prepare("INSERT INTO user 
        (username, f_name, l_name, email, mobile_no, dob, profile_pic, password) 
        VALUES 
        (:username, :f_name, :l_name, :email, :mobile_no, :dob, :profile_pic, :password)");
    
    $stmt->execute([
        ':username' => $data['username'],
        ':f_name' => $data['f_name'],
        ':l_name' => $data['l_name'],
        ':email' => $data['email'],
        ':mobile_no' => $data['mobile_no'] ?? null,
        ':dob' => $data['dob'],
        ':profile_pic' => $data['profile_pic'] ?? null,
        ':password' => $hashedPassword
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Registration successful"
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>