<?php
// api/add_car.php
session_start();
header('Content-Type: application/json');
require_once 'db_connect.php';

// 验证会话：检查卖家是否登录
if (!isset($_SESSION['seller_id'])) {
    echo json_encode(["status" => "error", "message" => "Authentication required."]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $seller_id = $_SESSION['seller_id'];
    $model = $_POST['carModel'] ?? '';
    $year = $_POST['carYear'] ?? '';
    $color = $_POST['carColour'] ?? '';
    $location = $_POST['carLocation'] ?? '';
    $price = $_POST['carPrice'] ?? '';

    // 处理图片上传
    if (isset($_FILES['carImage']) && $_FILES['carImage']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/'; // 确保项目根目录有 uploads 文件夹并具有写权限
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        // 生成唯一文件名以防覆盖
        $fileExtension = pathinfo($_FILES['carImage']['name'], PATHINFO_EXTENSION);
        $newFileName = uniqid('car_') . '.' . $fileExtension;
        $uploadFilePath = $uploadDir . $newFileName;
        $dbFilePath = 'uploads/' . $newFileName; // 存入数据库的相对路径

        if (move_uploaded_file($_FILES['carImage']['tmp_name'], $uploadFilePath)) {
            // 写入数据库
            try {
                $stmt = $conn->prepare("INSERT INTO cars (seller_id, model, manufacture_year, color, location, price, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$seller_id, $model, $year, $color, $location, $price, $dbFilePath]);
                echo json_encode(["status" => "success", "message" => "Car added successfully!"]);
            } catch (PDOException $e) {
                echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to upload image."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Valid image file is required."]);
    }
}
?>