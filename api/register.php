<?php
require_once "response.php";
require_once "db.php";

$data = getJsonInput();

$full_name = trim($data["full_name"] ?? "");
$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if ($full_name === "" || $email === "" || $password === "") {
    sendResponse(false, "กรุณากรอกชื่อ อีเมล และรหัสผ่านให้ครบ", [
        "received" => $data
    ], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, "รูปแบบอีเมลไม่ถูกต้อง", null, 400);
}

if (strlen($password) < 6) {
    sendResponse(false, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", null, 400);
}

try {
    $check = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $check->bindParam(":email", $email);
    $check->execute();

    if ($check->fetch()) {
        sendResponse(false, "อีเมลนี้ถูกใช้งานแล้ว", null, 409);
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("
        INSERT INTO users (full_name, email, password)
        VALUES (:full_name, :email, :password)
    ");
    $stmt->bindParam(":full_name", $full_name);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":password", $hashedPassword);
    $stmt->execute();

    sendResponse(true, "สมัครสมาชิกสำเร็จ", [
        "user_id" => $conn->lastInsertId(),
        "full_name" => $full_name,
        "email" => $email
    ], 201);
} catch (PDOException $e) {
    sendResponse(false, "PDO ERROR", [
        "error" => $e->getMessage()
    ], 500);
}
?>