<?php
require_once "response.php";
require_once "db.php";

$user_id = $_GET["user_id"] ?? null;

if ($user_id === null) {
    $data = getJsonInput();
    $user_id = $data["user_id"] ?? "";
}

$user_id = trim((string)$user_id);

if ($user_id === "") {
    sendResponse(false, "กรุณาระบุ user_id", null, 400);
}

try {
    $stmt = $conn->prepare("
        SELECT 
            id,
            full_name,
            email,
            phone,
            address,
            profile_image,
            gender,
            birth_date,
            national_id,
            house_number,
            farmer_number,
            created_at,
            updated_at
        FROM users
        WHERE id = :id
        LIMIT 1
    ");
    $stmt->bindParam(":id", $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $user = $stmt->fetch();

    if (!$user) {
        sendResponse(false, "ไม่พบข้อมูลผู้ใช้", null, 404);
    }

    sendResponse(true, "ดึงข้อมูลโปรไฟล์สำเร็จ", $user, 200);
} catch (PDOException $e) {
    sendResponse(false, "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์", $e->getMessage(), 500);
}
?>