<?php
// api/get_cars.php
header('Content-Type: application/json');
require_once 'db_connect.php';

try {
    // 您可以在这里直接处理搜索参数 (GET) 在 SQL 层过滤，也可以传回所有数据给 JS 处理（像您当前前端做的那样）
    // 为了兼容您已有的前端 JS filter 逻辑，这里先提取所有车辆
    $stmt = $conn->prepare("SELECT id, model, manufacture_year as year, color, location, price, image_path as image FROM cars ORDER BY created_at DESC");
    $stmt->execute();
    $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 转换价格类型，确保前端格式化正确
    foreach ($cars as &$car) {
        $car['price'] = (float)$car['price'];
        $car['year'] = (int)$car['year'];
    }

    echo json_encode(["status" => "success", "data" => $cars]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>