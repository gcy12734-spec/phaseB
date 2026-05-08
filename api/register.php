<?php
// api/register.php
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullName = $_POST['fullName'] ?? '';
    $address = $_POST['address'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? '';
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // 基础后端验证
    if (empty($username) || empty($password) || empty($email)) {
        echo json_encode(["status" => "error", "message" => "Required fields are missing."]);
        exit();
    }

    // 密码加密
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $conn->prepare("INSERT INTO sellers (full_name, address, phone, email, username, password) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$fullName, $address, $phone, $email, $username, $hashed_password]);
        echo json_encode(["status" => "success", "message" => "Registration successful!"]);
    } catch (PDOException $e) {
        // 处理用户名或邮箱重复的情况
        if ($e->getCode() == 23000) {
            echo json_encode(["status" => "error", "message" => "Username or Email already exists."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
        }
    }
}
?>