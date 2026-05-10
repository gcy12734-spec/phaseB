CREATE DATABASE IF NOT EXISTS online_car_sale;
USE online_car_sale;

-- 卖家表 (Sellers)
CREATE TABLE sellers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- 将存储哈希加密后的密码
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 汽车表 (Cars)
CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL, -- 外键：关联卖家
    model VARCHAR(100) NOT NULL,
    manufacture_year INT NOT NULL,
    color VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_path VARCHAR(255) NOT NULL, -- 存储上传图片的路径
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE
);