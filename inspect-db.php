<?php
require_once __DIR__ . '/config/config.php';

try {
    $pdo = getDBConnection();
    
    echo "--- site_settings ---\n";
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['setting_key'] . ": " . $row['setting_value'] . "\n";
    }
    
    echo "\n--- about_content ---\n";
    // Check if table exists first
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'about_content'");
    if ($tableCheck->rowCount() > 0) {
        $stmt = $pdo->query("SELECT section_key, section_value FROM about_content");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo $row['section_key'] . ": " . substr($row['section_value'], 0, 100) . "...\n";
        }
    } else {
        echo "about_content table does not exist.\n";
    }
    
    echo "\n--- services ---\n";
    $stmt = $pdo->query("SELECT title, slug FROM services");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['title'] . " (" . $row['slug'] . ")\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
