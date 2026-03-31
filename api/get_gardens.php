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
            user_id,
            garden_name,
            location,
            area_size,
            plant_type,
            number_of_gardens,
            soil_condition,
            has_water_source,
            has_water_system,
            water_system_type,
            coffee_variety,
            created_at,
            updated_at
        FROM gardens
        WHERE user_id = :user_id
        ORDER BY id DESC
    ");
    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $gardens = $stmt->fetchAll();

    sendResponse(true, "ดึงข้อมูลสวนสำเร็จ", $gardens, 200);
} catch (PDOException $e) {
    sendResponse(false, "เกิดข้อผิดพลาดในการดึงข้อมูลสวน", $e->getMessage(), 500);
}
?>