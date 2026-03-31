<?php
require_once "response.php";
require_once "db.php";

$data = getJsonInput();

$user_id = trim((string)($data["user_id"] ?? ""));
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

if ($user_id === "" || $location === "" || $area_size === "") {
    sendResponse(false, "กรุณาระบุ user_id, ที่ตั้ง และขนาดพื้นที่", null, 400);
}

try {
    $checkUser = $conn->prepare("SELECT id FROM users WHERE id = :id LIMIT 1");
    $checkUser->bindParam(":id", $user_id, PDO::PARAM_INT);
    $checkUser->execute();

    if (!$checkUser->fetch()) {
        sendResponse(false, "ไม่พบผู้ใช้", null, 404);
    }

    $stmt = $conn->prepare("
        INSERT INTO gardens (
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
            coffee_variety
        )
        VALUES (
            :user_id,
            :garden_name,
            :location,
            :area_size,
            :plant_type,
            :number_of_gardens,
            :soil_condition,
            :has_water_source,
            :has_water_system,
            :water_system_type,
            :coffee_variety
        )
    ");

    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
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

    $stmt->execute();

    sendResponse(true, "เพิ่มข้อมูลสวนสำเร็จ", [
        "garden_id" => $conn->lastInsertId(),
        "garden_name" => $garden_name,
        "location" => $location,
        "area_size" => $area_size,
        "plant_type" => $plant_type,
        "number_of_gardens" => $number_of_gardens,
        "soil_condition" => $soil_condition,
        "has_water_source" => $has_water_source,
        "has_water_system" => $has_water_system,
        "water_system_type" => $water_system_type,
        "coffee_variety" => $coffee_variety
    ], 201);
} catch (PDOException $e) {
    sendResponse(false, "เกิดข้อผิดพลาดในการเพิ่มสวน", $e->getMessage(), 500);
}
?>