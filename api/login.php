<?php
// api/login.php
session_start();
header('Content-Type: application/json');
require_once 'db_connect.php';

// 接收来自 fetch 的 JSON 数据
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    $stmt = $conn->prepare("SELECT id, username, password FROM sellers WHERE username = ?");
    $stmt->execute([$username]);
    $seller = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($seller && password_verify($password, $seller['password'])) {
        // 登录成功，设置 Session
        $_SESSION['seller_id'] = $seller['id'];
        $_SESSION['username'] = $seller['username'];
        
        echo json_encode([
            "status" => "success", 
            "message" => "Login successful", 
            "user" => ["id" => $seller['id'], "username" => $seller['username']]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid username or password."]);
    }
}
?>