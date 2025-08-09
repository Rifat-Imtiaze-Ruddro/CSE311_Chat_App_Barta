<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user1 = $data['user1'] ?? null;
    $user2 = $data['user2'] ?? null;

    if ($user1 && $user2) {
        try {
            // Step 1: Fetch all users from the database
            $stmt = $conn->prepare("SELECT username FROM user");
            $stmt->execute();
            $allUsers = $stmt->fetchAll(PDO::FETCH_COLUMN);

            // Step 2: Validate both usernames
            if (!in_array($user1, $allUsers) || !in_array($user2, $allUsers)) {
                echo json_encode([
                    "success" => false,
                    "message" => "One or both users do not exist."
                ]);
                exit;
            }

            // Step 3: Find chat_id from private_chat
            $chatStmt = $conn->prepare("
                SELECT chat_id FROM private_chat
                WHERE (sender_id = :sender1 AND receiver_id = :receiver1)
                   OR (sender_id = :sender2 AND receiver_id = :receiver2)
            ");
            $chatStmt->execute([
                ":sender1" => $user1,
                ":receiver1" => $user2,
                ":sender2" => $user2,
                ":receiver2" => $user1
            ]);

            $chat = $chatStmt->fetch(PDO::FETCH_ASSOC);

            if ($chat) {
                $chat_id = $chat['chat_id'];

                // Step 4: Get messages by chat_id
                $msgStmt = $conn->prepare("SELECT * FROM message WHERE chat_id = :chat_id ORDER BY timestamp ASC");
                $msgStmt->execute([":chat_id" => $chat_id]);
                $messages = $msgStmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode([
                    "success" => true,
                    "chat_id" => $chat_id,
                    "messages" => $messages
                ]);
            } else {
                // No conversation found
                echo json_encode([
                    "success" => true,
                    "chat_id" => null,
                    "messages" => []
                ]);
            }

        } catch (PDOException $e) {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $e->getMessage()
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Missing user1 or user2."
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
}
