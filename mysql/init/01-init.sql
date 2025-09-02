-- データベースの作成
CREATE DATABASE IF NOT EXISTS webapp_db;
USE webapp_db;

-- ユーザーテーブルの作成
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- サンプルデータの挿入
INSERT INTO users (username, email, password_hash) VALUES
('admin', 'admin@example.com', 'dummy_hash'),
('user1', 'user1@example.com', 'dummy_hash');

-- テーブルの確認
SHOW TABLES;
SELECT * FROM users;
