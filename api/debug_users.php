<?php
require_once "db.php";

try {
    $stmt = $conn->query("SELECT id, full_name, email, created_at FROM users ORDER BY id DESC");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>