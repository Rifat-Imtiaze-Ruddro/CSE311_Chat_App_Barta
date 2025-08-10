<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once __DIR__ . '/../config/db.php';

try {
    // Handle file uploads
    $uploadedAttachments = [];
    if (!empty($_FILES['attachments'])) {
        $uploadDir = __DIR__ . '/../uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        foreach ($_FILES['attachments']['name'] as $key => $name) {
            $tempFile = $_FILES['attachments']['tmp_name'][$key];
            $fileSize = $_FILES['attachments']['size'][$key];
            $fileType = $_FILES['attachments']['type'][$key];
            $fileName = uniqid() . '_' . basename($name);
            $targetPath = $uploadDir . $fileName;

            if (move_uploaded_file($tempFile, $targetPath)) {
                $uploadedAttachments[] = [
                    'original_name' => $name,
                    'file_path' => $fileName,
                    'file_size' => $fileSize,
                    'mime_type' => $fileType
                ];
            }
        }
    }

    // Get other form data
    $content = $_POST['content'] ?? null;
    $sender_id = $_POST['sender_id'];
    $receiver_id = $_POST['receiver_id'];
    $timestamp = date('Y-m-d H:i:s');

    // Start transaction
    $conn->beginTransaction();

    // Check if private chat exists
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
        // Create new chat
        $conn->exec("INSERT INTO chat () VALUES ()");
        $chat_id = $conn->lastInsertId();

        // Insert into private_chat
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

    // Insert the message
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
    $message_id = $conn->lastInsertId();

    // Insert attachments if any
    if (!empty($uploadedAttachments)) {
        $attachmentStmt = $conn->prepare("
            INSERT INTO attachment (file_name, file_path, file_size, mime_type, original_name, message_id)
            VALUES (:file_name, :file_path, :file_size, :mime_type, :original_name, :message_id)
        ");

        foreach ($uploadedAttachments as $attachment) {
            $attachmentStmt->execute([
                ":file_name" => $attachment['file_path'],
                ":file_path" => $attachment['file_path'],
                ":file_size" => $attachment['file_size'],
                ":mime_type" => $attachment['mime_type'],
                ":original_name" => $attachment['original_name'],
                ":message_id" => $message_id
            ]);
        }
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Message sent successfully",
        "message_id" => $message_id
    ]);

} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>