<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user1 = $data['user1'] ?? null;
    $user2 = $data['user2'] ?? null;

    if ($user1 && $user2) {
        try {
            // Find chat_id from private_chat
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

                // Get messages with attachments
                $msgStmt = $conn->prepare("
                    SELECT m.*, 
                           u.f_name, u.l_name, u.profile_pic,
                           a.attachment_id, a.file_name, a.file_path, a.file_size, a.mime_type, a.original_name
                    FROM message m
                    JOIN user u ON m.sender_id = u.username
                    LEFT JOIN attachment a ON m.message_id = a.message_id
                    WHERE m.chat_id = :chat_id
                    ORDER BY m.timestamp ASC
                ");
                $msgStmt->execute([":chat_id" => $chat_id]);
                
                $messages = [];
                while ($row = $msgStmt->fetch(PDO::FETCH_ASSOC)) {
                    $messageId = $row['message_id'];
                    
                    if (!isset($messages[$messageId])) {
                        $messages[$messageId] = [
                            'id' => $row['message_id'],
                            'content' => $row['content'],
                            'sender_id' => $row['sender_id'],
                            'chat_id' => $row['chat_id'],
                            'timestamp' => $row['timestamp'],
                            'f_name' => $row['f_name'],
                            'l_name' => $row['l_name'],
                            'profile_pic' => $row['profile_pic'],
                            'attachments' => []
                        ];
                    }
                    
                    if ($row['attachment_id']) {
                        $messages[$messageId]['attachments'][] = [
                            'id' => $row['attachment_id'],
                            'file_path' => $row['file_path'],
                            'file_size' => $row['file_size'],
                            'mime_type' => $row['mime_type'],
                            'original_name' => $row['original_name']
                        ];
                    }
                }

                echo json_encode([
                    "success" => true,
                    "messages" => array_values($messages)
                ]);
            } else {
                echo json_encode([
                    "success" => true,
                    "messages" => []
                ]);
            }

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $e->getMessage()
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Missing user1 or user2"
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);
}
?>