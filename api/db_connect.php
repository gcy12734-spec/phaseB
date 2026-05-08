<?php
// api/db_connect.php
$host = 'localhost';
$db_name = 'online_car_sale';
$username = 'root'; // 替换为您的 MySQL 用户名
$password = '';     // 替换为您的 MySQL 密码

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $e->getMessage()]);
    exit();
}
?>