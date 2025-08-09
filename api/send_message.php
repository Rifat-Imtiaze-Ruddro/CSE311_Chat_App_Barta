<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';


$data = json_decode(file_get_contents('php://input'), true);


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

$content = $data['content'] ?? null;
$sender_id = $data['sender_id'] ?? null;
$receiver_id = $data['receiver_id'] ?? null;
$timestamp = $data['timestamp'] ?? date('Y-m-d H:i:s');


if (!$content || !$sender_id || !$receiver_id) {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit;
}



try {
    // 1. Check if private chat exists between sender and receiver
    $stmt = $conn->prepare("
    SELECT chat_id FROM private_chat 
    WHERE (sender_id = :sender1 AND receiver_id = :receiver1)
        OR (sender_id = :sender2 AND receiver_id = :receiver2)
    ");

    $stmt->execute([
    ":sender1" => $sender_id,
    ":receiver1" => $receiver_id,
    ":sender2" => $receiver_id,
    ":receiver2" => $sender_id
    ]);

    
    $existingChat = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingChat) {
        $chat_id = $existingChat['chat_id'];
    } else {
        // 2. Create a new chat
        $conn->exec("INSERT INTO chat () VALUES ()");
        $chat_id = $conn->lastInsertId();

        if (!$chat_id) {
            echo json_encode([
                "success" => false,
                "message" => "Failed to create chat."
            ]);
            exit;
        }

        // 3. Insert into private_chat table
        $stmt = $conn->prepare("
            INSERT INTO private_chat (chat_id, sender_id, receiver_id)
            VALUES (:chat_id, :sender, :receiver)
        ");
        $stmt->execute([
            ":chat_id" => $chat_id,
            ":sender" => $sender_id,
            ":receiver" => $receiver_id
        ]);
    }

    // 4. Insert the message
    $stmt = $conn->prepare("
        INSERT INTO message (content, sender_id, chat_id, timestamp)
        VALUES (:content, :sender_id, :chat_id, :timestamp)
    ");
    $stmt->execute([
        ":content" => $content,
        ":sender_id" => $sender_id,
        ":chat_id" => $chat_id,
        ":timestamp" => $timestamp
    ]);

    echo json_encode(["success" => true, "message" => "Message sent successfully."]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
