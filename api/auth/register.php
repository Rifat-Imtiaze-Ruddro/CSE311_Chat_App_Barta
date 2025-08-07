
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

$username = $data['username'];
$email = $data['email'];
$password = $data['password'];
$f_name = $data['f_name'];
$l_name = $data['l_name'];
$mobile_no = $data['mobile_no'] ?? null;
$dob = $data['dob'];
$profile_pic = $data['profile_pic'] ?? null;

$sql = "SELECT * FROM user WHERE username = '$username' OR email = '$email'";
$result = $conn->query($sql);

if ($result->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "Username or email already exists"]);
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$insert = "INSERT INTO user (username, f_name, l_name, email, mobile_no, dob, profile_pic, password)
           VALUES ('$username', '$f_name', '$l_name', '$email', '$mobile_no', '$dob', '$profile_pic', '$hashedPassword')";

if ($conn->query($insert)) {
    echo json_encode(["success" => true, "message" => "Registration successful"]);
} else {
    echo json_encode(["success" => false, "message" => "Something went wrong while registering"]);
}
?>

