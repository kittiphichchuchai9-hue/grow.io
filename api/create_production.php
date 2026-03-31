<?php
require_once "response.php";
require_once "db.php";

$data = getJsonInput();

$user_id = trim((string)($data["user_id"] ?? ""));
$garden_id = $data["garden_id"] ?? null;

$product_name = trim($data["product_name"] ?? "");
$quantity = trim((string)($data["quantity"] ?? ""));
$unit = trim($data["unit"] ?? "");
$harvest_date = trim($data["harvest_date"] ?? "");
$note = trim($data["note"] ?? "");

$harvest_year = trim($data["harvest_year"] ?? "");
$harvest_variety = trim($data["harvest_variety"] ?? "");
$harvest_amount = trim((string)($data["harvest_amount"] ?? ""));
$fresh_sales = trim((string)($data["fresh_sales"] ?? ""));
$processed_amount = trim((string)($data["processed_amount"] ?? ""));
$product_type = trim($data["product_type"] ?? "");
$product_quantity = trim($data["product_quantity"] ?? "");
$bean_source = trim($data["bean_source"] ?? "");
$gi_status = trim($data["gi_status"] ?? "");
$sale_location = trim($data["sale_location"] ?? "");
$product_price = trim($data["product_price"] ?? "");
$farmer_income = trim((string)($data["farmer_income"] ?? ""));

if ($harvest_date === "") {
    $harvest_date = null;
}

if ($garden_id === "") {
    $garden_id = null;
}

if ($quantity === "") {
    $quantity = "0";
}

if ($unit === "") {
    $unit = "กิโลกรัม";
}

if ($user_id === "" || $harvest_year === "" || $product_name === "") {
    sendResponse(false, "กรุณาระบุ user_id, ปีที่เก็บเกี่ยว และชื่อผลิตภัณฑ์", null, 400);
}

try {
    $checkUser = $conn->prepare("SELECT id FROM users WHERE id = :id LIMIT 1");
    $checkUser->bindParam(":id", $user_id, PDO::PARAM_INT);
    $checkUser->execute();

    if (!$checkUser->fetch()) {
        sendResponse(false, "ไม่พบผู้ใช้", null, 404);
    }

    if ($garden_id !== null) {
        $checkGarden = $conn->prepare("SELECT id FROM gardens WHERE id = :id LIMIT 1");
        $checkGarden->bindParam(":id", $garden_id, PDO::PARAM_INT);
        $checkGarden->execute();

        if (!$checkGarden->fetch()) {
            sendResponse(false, "ไม่พบข้อมูลสวน", null, 404);
        }
    }

    $stmt = $conn->prepare("
        INSERT INTO productions (
            user_id,
            garden_id,
            product_name,
            quantity,
            unit,
            harvest_date,
            note,
            harvest_year,
            harvest_variety,
            harvest_amount,
            fresh_sales,
            processed_amount,
            product_type,
            product_quantity,
            bean_source,
            gi_status,
            sale_location,
            product_price,
            farmer_income
        )
        VALUES (
            :user_id,
            :garden_id,
            :product_name,
            :quantity,
            :unit,
            :harvest_date,
            :note,
            :harvest_year,
            :harvest_variety,
            :harvest_amount,
            :fresh_sales,
            :processed_amount,
            :product_type,
            :product_quantity,
            :bean_source,
            :gi_status,
            :sale_location,
            :product_price,
            :farmer_income
        )
    ");

    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    $stmt->bindParam(":garden_id", $garden_id, $garden_id === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
    $stmt->bindParam(":product_name", $product_name);
    $stmt->bindParam(":quantity", $quantity);
    $stmt->bindParam(":unit", $unit);
    $stmt->bindParam(":harvest_date", $harvest_date, $harvest_date === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
    $stmt->bindParam(":note", $note);
    $stmt->bindParam(":harvest_year", $harvest_year);
    $stmt->bindParam(":harvest_variety", $harvest_variety);
    $stmt->bindParam(":harvest_amount", $harvest_amount);
    $stmt->bindParam(":fresh_sales", $fresh_sales);
    $stmt->bindParam(":processed_amount", $processed_amount);
    $stmt->bindParam(":product_type", $product_type);
    $stmt->bindParam(":product_quantity", $product_quantity);
    $stmt->bindParam(":bean_source", $bean_source);
    $stmt->bindParam(":gi_status", $gi_status);
    $stmt->bindParam(":sale_location", $sale_location);
    $stmt->bindParam(":product_price", $product_price);
    $stmt->bindParam(":farmer_income", $farmer_income);

    $stmt->execute();

    sendResponse(true, "บันทึกข้อมูลผลผลิตสำเร็จ", [
        "production_id" => $conn->lastInsertId(),
        "product_name" => $product_name,
        "harvest_year" => $harvest_year
    ], 201);
} catch (PDOException $e) {
    sendResponse(false, "เกิดข้อผิดพลาดในการบันทึกข้อมูลผลผลิต", $e->getMessage(), 500);
}
?>