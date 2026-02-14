<?php
/**
 * Verification script for Visa Assistance Module
 */
require_once __DIR__ . '/../config/config.php';

echo "SULOC Visa Module Verification\n";
echo "============================\n";

$pdo = getDBConnection();

// 1. Check Tables
$tables = ['visa_assistance_requests', 'visa_assistance_docs', 'visa_assistance_logs', 'visa_assistance_settings'];
foreach ($tables as $table) {
    try {
        $pdo->query("SELECT 1 FROM $table LIMIT 1");
        echo "[OK] Table '$table' exists.\n";
    } catch (Exception $e) {
        echo "[ERROR] Table '$table' missing or inaccessible: " . $e->getMessage() . "\n";
    }
}

// 2. Check Settings
$settingsCount = $pdo->query("SELECT COUNT(*) FROM visa_assistance_settings")->fetchColumn();
if ($settingsCount >= 4) {
    echo "[OK] Notification templates initialized ($settingsCount).\n";
} else {
    echo "[ERROR] Notification templates missing ($settingsCount).\n";
}

// 3. Simulate Request Insertion
try {
    $pdo->beginTransaction();
    $stmt = $pdo->prepare("INSERT INTO visa_assistance_requests (full_name, email, phone, origin_country, destination_country, visa_type, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute(['Test User', 'test@example.com', '+25700000000', 'Burundi', 'France', 'tourist', 'received']);
    $requestId = $pdo->lastInsertId();
    
    $pdo->prepare("INSERT INTO visa_assistance_logs (request_id, action_type, action_description) VALUES (?, 'test', 'Test verification entry')")->execute([$requestId]);
    
    echo "[OK] Test request inserted (ID: $requestId).\n";
    
    // Cleanup - we won't actually commit if we want to keep DB clean, but for verification let's commit and then delete
    $pdo->commit();
    
    // 4. Verify Retrieval
    $req = $pdo->query("SELECT * FROM visa_assistance_requests WHERE id = $requestId")->fetch();
    if ($req && $req['full_name'] === 'Test User') {
        echo "[OK] Request data retrieved correctly.\n";
    } else {
        echo "[ERROR] Request data retrieval failed.\n";
    }
    
    // Delete test data
    $pdo->exec("DELETE FROM visa_assistance_requests WHERE id = $requestId");
    echo "[OK] Test data cleaned up.\n";

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo "[ERROR] DB Operation failed: " . $e->getMessage() . "\n";
}

echo "============================\n";
echo "Verification Complete.\n";
