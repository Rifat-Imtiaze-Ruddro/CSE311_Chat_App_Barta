<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once $_SERVER['DOCUMENT_ROOT'] . '/barta/config/db.php';

try {
    // Get the current user from query parameters
    $current_user = $_GET['current_user'] ?? null;
    
    if ($current_user) {
        // Fetch all users except the current user
        $stmt = $conn->prepare("
            SELECT username, f_name, l_name, email, profile_pic, mobile_no 
            FROM user 
            WHERE username != :current_user
            ORDER BY f_name, l_name
        ");
        $stmt->execute([':current_user' => $current_user]);
    } else {
        // Fetch all users if no current user specified
        $stmt = $conn->prepare("
            SELECT username, f_name, l_name, email, profile_pic, mobile_no 
            FROM user 
            ORDER BY f_name, l_name
        ");
        $stmt->execute();
    }
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Add default photo URL if profile_pic is empty
    foreach ($users as &$user) {
        if (empty($user['profile_pic'])) {
            $user['profile_pic'] = 'https://i.pravatar.cc/150?u=' . $user['username'];
        }
    }
    
    echo json_encode([
        "success" => true,
        "users" => $users
    ]);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>