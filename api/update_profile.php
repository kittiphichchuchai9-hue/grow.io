<?php
require_once "response.php";
require_once "db.php";

$data = getJsonInput();

$user_id = trim((string)($data["user_id"] ?? ""));
$full_name = trim($data["full_name"] ?? "");
$phone = trim($data["phone"] ?? "");
$address = trim($data["address"] ?? "");
$profile_image = trim($data["profile_image"] ?? "");
$gender = trim($data["gender"] ?? "");
$birth_date = trim($data["birth_date"] ?? "");
$national_id = trim($data["national_id"] ?? "");
$house_number = trim($data["house_number"] ?? "");
$farmer_number = trim($data["farmer_number"] ?? "");

if ($user_id === "" || $full_name === "") {
    sendResponse(false, "กรุณาระบุ user_id และ full_name", null, 400);
}

try {
    $check = $conn->prepare("SELECT id FROM users WHERE id = :id LIMIT 1");
    $check->bindParam(":id", $user_id, PDO::PARAM_INT);
    $check->execute();

    if (!$check->fetch()) {
        sendResponse(false, "ไม่พบผู้ใช้", null, 404);
    }

    if ($national_id !== "") {
        $checkNationalId = $conn->prepare("
            SELECT id FROM users
            WHERE national_id = :national_id AND id != :id
            LIMIT 1
        ");
        $checkNationalId->bindParam(":national_id", $national_id);
        $checkNationalId->bindParam(":id", $user_id, PDO::PARAM_INT);
        $checkNationalId->execute();

        if ($checkNationalId->fetch()) {
            sendResponse(false, "เลขบัตรประชาชนนี้ถูกใช้งานแล้ว", null, 409);
        }
    }

    $stmt = $conn->prepare("
        UPDATE users
        SET full_name = :full_name,
            phone = :phone,
            address = :address,
            profile_image = :profile_image,
            gender = :gender,
            birth_date = :birth_date,
            national_id = :national_id,
            house_number = :house_number,
            farmer_number = :farmer_number
        WHERE id = :id
    ");

    $stmt->bindParam(":full_name", $full_name);
    $stmt->bindParam(":phone", $phone);
    $stmt->bindParam(":address", $address);
    $stmt->bindParam(":profile_image", $profile_image);
    $stmt->bindParam(":gender", $gender);
    $stmt->bindParam(":birth_date", $birth_date);
    $stmt->bindParam(":national_id", $national_id);
    $stmt->bindParam(":house_number", $house_number);
    $stmt->bindParam(":farmer_number", $farmer_number);
    $stmt->bindParam(":id", $user_id, PDO::PARAM_INT);

    $stmt->execute();

    sendResponse(true, "อัปเดตโปรไฟล์สำเร็จ", null, 200);
} catch (PDOException $e) {
    sendResponse(false, "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์", $e->getMessage(), 500);
}
?>