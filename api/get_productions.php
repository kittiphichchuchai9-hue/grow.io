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
            p.id,
            p.user_id,
            p.garden_id,
            p.product_name,
            p.quantity,
            p.unit,
            p.harvest_date,
            p.note,
            p.harvest_year,
            p.harvest_variety,
            p.harvest_amount,
            p.fresh_sales,
            p.processed_amount,
            p.product_type,
            p.product_quantity,
            p.bean_source,
            p.gi_status,
            p.sale_location,
            p.product_price,
            p.farmer_income,
            p.created_at,
            p.updated_at
        FROM productions p
        WHERE p.user_id = :user_id
        ORDER BY p.id DESC
    ");
    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $productions = $stmt->fetchAll();

    sendResponse(true, "ดึงข้อมูลผลผลิตสำเร็จ", $productions, 200);
} catch (PDOException $e) {
    sendResponse(false, "เกิดข้อผิดพลาดในการดึงข้อมูลผลผลิต", $e->getMessage(), 500);
}
?>