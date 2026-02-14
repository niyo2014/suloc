<?php
require_once __DIR__ . '/config/config.php';

try {
    $pdo = getDBConnection();

    $tables = ['services', 'projects', 'team_members', 'site_content', 'site_settings'];
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT 1 FROM $table LIMIT 1");
            echo "Table '$table' exists.\n";
        } catch (PDOException $e) {
            echo "Error checking table '$table': " . $e->getMessage() . "\n";
        }
    }
    
    // Test the exact index.php queries
    echo "\nTesting queries from index.php:\n";
    
    $queries = [
        "SELECT * FROM services WHERE is_active = 1 ORDER BY order_index ASC",
        "SELECT * FROM projects WHERE is_active = 1 ORDER BY order_index ASC LIMIT 6",
        "SELECT * FROM team_members WHERE is_active = 1 ORDER BY order_index ASC",
        "SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('phone', 'email', 'address', 'representative', 'phone2', 'email2', 'nif', 'authorization_date')",
        "SELECT content_key, content_value FROM site_content"
    ];
    
    foreach ($queries as $sql) {
        try {
            $pdo->query($sql);
            echo "Query OK: $sql\n";
        } catch (PDOException $e) {
            echo "Query FAILED: $sql\nError: " . $e->getMessage() . "\n";
        }
    }

} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
