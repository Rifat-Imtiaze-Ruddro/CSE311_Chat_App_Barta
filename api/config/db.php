<?php
// Strict CORS Policy (Replace * with your frontend URL in production)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 3600");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Database configuration
$servername = "localhost";
$username = "root"; 
$password = "";
$dbname = "barta";
$charset = "utf8mb4";

try {
    // PDO Connection with error mode and prepared statements
    $conn = new PDO(
        "mysql:host=$servername;dbname=$dbname;charset=$charset",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
    
    // Test connection immediately
    $conn->query("SELECT 1");
    
} catch(PDOException $e) {
    // Secure error reporting (don't expose full error in production)
    $errorMessage = "Database connection failed";
    error_log("DB Connection Error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $errorMessage,
        "error_code" => "DB_CONNECTION_FAILED"
    ]);
    exit();
}

// Connection successful (script continues if included in other files)
?>