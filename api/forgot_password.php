<?php
require_once "response.php";
require_once "db.php";

$data = getJsonInput();

$email = trim($data["email"] ?? "");
$new_password = trim($data["new_password"] ?? "");

if ($email === "" || $new_password === "") {
    sendResponse(false, "กรุณากรอกอีเมลและรหัสผ่านใหม่", null, 400);
}

if (strlen($new_password) < 6) {
    sendResponse(false, "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร", null, 400);
}

try {
    $check = $conn->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $check->bindParam(":email", $email);
    $check->execute();

    $user = $check->fetch();

    if (!$user) {
        sendResponse(false, "ไม่พบบัญชีผู้ใช้นี้", null, 404);
    }

    $hashedPassword = password_hash($new_password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("
        UPDATE users
        SET password = :password
        WHERE email = :email
    ");
    $stmt->bindParam(":password", $hashedPassword);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    sendResponse(true, "เปลี่ยนรหัสผ่านสำเร็จ", null, 200);
} catch (PDOException $e) {
    sendResponse(false, "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน", $e->getMessage(), 500);
}
?>