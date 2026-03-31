<?php
require_once "response.php";
require_once "db.php";

$data = getJsonInput();

$garden_id = trim((string)($data["garden_id"] ?? ""));
$garden_name = trim($data["garden_name"] ?? "");
$location = trim($data["location"] ?? "");
$area_size = trim($data["area_size"] ?? "");
$plant_type = trim($data["plant_type"] ?? "");

$number_of_gardens = trim((string)($data["number_of_gardens"] ?? ""));
$soil_condition = trim($data["soil_condition"] ?? "");
$has_water_source = trim($data["has_water_source"] ?? "");
$has_water_system = trim($data["has_water_system"] ?? "");
$water_system_type = trim($data["water_system_type"] ?? "");
$coffee_variety = trim($data["coffee_variety"] ?? "");

if ($garden_id === "" || $location === "" || $area_size === "") {
    sendResponse(false, "กรุณาระบุ garden_id, ที่ตั้ง และขนาดพื้นที่", null, 400);
}

try {
    $check = $conn->prepare("SELECT id FROM gardens WHERE id = :id LIMIT 1");
    $check->bindParam(":id", $garden_id, PDO::PARAM_INT);
    $check->execute();

    if (!$check->fetch()) {
        sendResponse(false, "ไม่พบข้อมูลสวน", null, 404);
    }

    $stmt = $conn->prepare("
        UPDATE gardens
        SET garden_name = :garden_name,
            location = :location,
            area_size = :area_size,
            plant_type = :plant_type,
            number_of_gardens = :number_of_gardens,
            soil_condition = :soil_condition,
            has_water_source = :has_water_source,
            has_water_system = :has_water_system,
            water_system_type = :water_system_type,
            coffee_variety = :coffee_variety
        WHERE id = :id
    ");

    $stmt->bindParam(":garden_name", $garden_name);
    $stmt->bindParam(":location", $location);
    $stmt->bindParam(":area_size", $area_size);
    $stmt->bindParam(":plant_type", $plant_type);
    $stmt->bindParam(":number_of_gardens", $number_of_gardens);
    $stmt->bindParam(":soil_condition", $soil_condition);
    $stmt->bindParam(":has_water_source", $has_water_source);
    $stmt->bindParam(":has_water_system", $has_water_system);
    $stmt->bindParam(":water_system_type", $water_system_type);
    $stmt->bindParam(":coffee_variety", $coffee_variety);
    $stmt->bindParam(":id", $garden_id, PDO::PARAM_INT);

    $stmt->execute();

    sendResponse(true, "อัปเดตข้อมูลสวนสำเร็จ", [
        "garden_id" => (int)$garden_id
    ], 200);
} catch (PDOException $e) {
    sendResponse(false, "เกิดข้อผิดพลาดในการอัปเดตสวน", $e->getMessage(), 500);
}
?>