<?php
require_once __DIR__ . '/config/config.php';

try {
    $pdo = getDBConnection();
    
    echo "--- site_content ---\n";
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'site_content'");
    if ($tableCheck->rowCount() > 0) {
        $stmt = $pdo->query("SELECT content_key, content_value FROM site_content");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo $row['content_key'] . ": " . $row['content_value'] . "\n";
        }
    } else {
        echo "site_content table does not exist.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
