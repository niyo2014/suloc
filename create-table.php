<?php
require_once __DIR__ . '/config/config.php';

try {
    $pdo = getDBConnection();
    
    // Create site_content table
    $sql = "CREATE TABLE IF NOT EXISTS site_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content_key VARCHAR(255) NOT NULL UNIQUE,
        content_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    
    $pdo->exec($sql);
    echo "Table 'site_content' created successfully or already exists.";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
