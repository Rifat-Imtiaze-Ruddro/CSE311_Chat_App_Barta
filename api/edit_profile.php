<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once $_SERVER['DOCUMENT_ROOT'] . '/barta/config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit();
}

try {
    // Validate required fields
    if (empty($data['username']) || empty($data['f_name']) || empty($data['l_name']) || empty($data['dob'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Required fields are missing"]);
        exit();
    }

    // Prepare update query
    $stmt = $conn->prepare("
        UPDATE user 
        SET 
            f_name = :f_name,
            l_name = :l_name,
            mobile_no = :mobile_no,
            dob = :dob,
            profile_pic = :profile_pic
        WHERE username = :username
    ");

    $success = $stmt->execute([
        ':f_name' => $data['f_name'],
        ':l_name' => $data['l_name'],
        ':mobile_no' => $data['mobile_no'],
        ':dob' => $data['dob'],
        ':profile_pic' => $data['profile_pic'],
        ':username' => $data['username']
    ]);

    if ($success && $stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Profile updated successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No changes made or user not found"
        ]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>