<?php
require_once "response.php";
require_once "db.php";

$data = getJsonInput();

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if ($email === "" || $password === "") {
    sendResponse(false, "กรุณากรอกอีเมลและรหัสผ่าน", null, 400);
}

try {
    $stmt = $conn->prepare("
        SELECT id, full_name, email, password, phone, address, profile_image
        FROM users
        WHERE email = :email
        LIMIT 1
    ");
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $user = $stmt->fetch();

    if (!$user) {
        sendResponse(false, "ไม่พบบัญชีผู้ใช้นี้", null, 404);
    }

    if (!password_verify($password, $user["password"])) {
        sendResponse(false, "รหัสผ่านไม่ถูกต้อง", null, 401);
    }

    unset($user["password"]);

    sendResponse(true, "เข้าสู่ระบบสำเร็จ", $user, 200);
} catch (PDOException $e) {
    sendResponse(false, "เกิดข้อผิดพลาดในการเข้าสู่ระบบ", $e->getMessage(), 500);
}
?>