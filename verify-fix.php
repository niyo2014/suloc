<?php
require_once __DIR__ . '/config/config.php';

$pdo = getDBConnection();
$contactInfo = [];

echo "Simulating index.php logic...\n";

// Load active services (Will fail)
try {
    $stmt = $pdo->query("SELECT * FROM services WHERE is_active = 1 ORDER BY order_index ASC");
    $services = $stmt->fetchAll();
    echo "Services loaded.\n";
} catch (Exception $e) { 
    echo "Services load error (EXPECTED): " . $e->getMessage() . "\n"; 
}

// Load contact info (Should succeed)
try {
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('phone', 'email', 'address', 'representative', 'phone2', 'email2', 'nif', 'authorization_date')");
    while ($row = $stmt->fetch()) {
        $contactInfo[$row['setting_key']] = $row['setting_value'];
    }
    echo "Contact info loaded. Count: " . count($contactInfo) . "\n";
    print_r($contactInfo);
} catch (Exception $e) { echo "Contact info load error: " . $e->getMessage() . "\n"; }
