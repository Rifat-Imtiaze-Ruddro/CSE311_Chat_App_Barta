<?php


require '../config/db.php';

$stmt = $conn->prepare('SELECT * FROM user');

$stmt->execute();

$results = $stmt->fetchAll();

echo json_encode($results);

?>