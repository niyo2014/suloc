<?php
require_once __DIR__ . '/config/config.php';

try {
    $pdo = getDBConnection();
    
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id, username, password_hash, is_active FROM admin_users WHERE username = 'admin'");
    $stmt->execute();
    $user = $stmt->fetch();
    
    if ($user) {
        echo "User 'admin' found.\n";
        echo "Is Active: " . $user['is_active'] . "\n";
        
        // Test password 'admin123'
        if (password_verify('admin123', $user['password_hash'])) {
            echo "Password 'admin123' is CORRECT for this hash.\n";
        } else {
            echo "Password 'admin123' is INCORRECT for this hash.\n";
            
            // Update password to 'admin123'
            $newHash = password_hash('admin123', PASSWORD_DEFAULT);
            $update = $pdo->prepare("UPDATE admin_users SET password_hash = ? WHERE username = 'admin'");
            $update->execute([$newHash]);
            echo "Password for 'admin' has been RESET to 'admin123'.\n";
        }
    } else {
        echo "User 'admin' NOT found. Creating user...\n";
        $newHash = password_hash('admin123', PASSWORD_DEFAULT);
        $insert = $pdo->prepare("INSERT INTO admin_users (username, password_hash, full_name, email, role, is_active) VALUES ('admin', ?, 'Administrator', 'admin@suloc.com', 'super_admin', 1)");
        $insert->execute([$newHash]);
        echo "User 'admin' created with password 'admin123'.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
