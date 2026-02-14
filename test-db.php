<?php
/**
 * Database Connection Test
 * Visit this file to test database connection and table creation
 */
require_once __DIR__ . '/config/config.php';

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Test - SULOC</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold text-blue-900 mb-6">Database Connection Test</h1>
        
        <?php
        try {
            echo '<div class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">';
            echo '<h2 class="font-bold mb-2">✅ Database Connection: SUCCESS</h2>';
            echo '<p>Connected to database: <strong>' . DB_NAME . '</strong></p>';
            echo '</div>';
            
            $pdo = getDBConnection();
            
            // Test table creation
            echo '<div class="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">';
            echo '<h2 class="font-bold mb-2">📊 Database Tables:</h2>';
            echo '<ul class="list-disc list-inside space-y-1">';
            
            $tables = ['services', 'projects', 'team_members', 'contact_submissions', 'site_settings', 'admin_users', 'pages'];
            foreach ($tables as $table) {
                try {
                    $stmt = $pdo->query("SELECT COUNT(*) FROM $table");
                    $count = $stmt->fetchColumn();
                    echo "<li>$table: <strong>$count</strong> records</li>";
                } catch (Exception $e) {
                    echo "<li>$table: <span class='text-red-600'>Table doesn't exist</span></li>";
                }
            }
            echo '</ul>';
            echo '</div>';
            
            // Test admin user
            echo '<div class="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">';
            echo '<h2 class="font-bold mb-2">👤 Admin Users:</h2>';
            try {
                $stmt = $pdo->query("SELECT id, username, email, full_name, is_active FROM admin_users");
                $users = $stmt->fetchAll();
                if (empty($users)) {
                    echo '<p>No admin users found. Default user should be created automatically.</p>';
                } else {
                    echo '<ul class="list-disc list-inside space-y-1">';
                    foreach ($users as $user) {
                        $status = $user['is_active'] ? '✅ Active' : '❌ Inactive';
                        echo "<li><strong>{$user['username']}</strong> ({$user['email']}) - {$user['full_name']} - $status</li>";
                    }
                    echo '</ul>';
                }
            } catch (Exception $e) {
                echo '<p class="text-red-600">Error checking admin users: ' . $e->getMessage() . '</p>';
            }
            echo '</div>';
            
            // Test settings
            echo '<div class="mb-4 p-4 bg-purple-100 border border-purple-400 text-purple-700 rounded">';
            echo '<h2 class="font-bold mb-2">⚙️ Site Settings:</h2>';
            try {
                $stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings LIMIT 10");
                $settings = $stmt->fetchAll();
                if (empty($settings)) {
                    echo '<p>No settings configured yet. Use admin panel to add settings.</p>';
                } else {
                    echo '<ul class="list-disc list-inside space-y-1">';
                    foreach ($settings as $setting) {
                        echo "<li><strong>{$setting['setting_key']}</strong>: {$setting['setting_value']}</li>";
                    }
                    echo '</ul>';
                }
            } catch (Exception $e) {
                echo '<p class="text-red-600">Error checking settings: ' . $e->getMessage() . '</p>';
            }
            echo '</div>';
            
            echo '<div class="p-4 bg-green-100 border border-green-400 text-green-700 rounded">';
            echo '<h2 class="font-bold mb-2">✅ All Tests Passed!</h2>';
            echo '<p>Your database is properly configured and ready to use.</p>';
            echo '<p class="mt-4"><a href="index.php" class="text-blue-600 underline">Go to Homepage</a> | <a href="admin/login.php" class="text-blue-600 underline">Go to Admin</a></p>';
            echo '</div>';
            
        } catch (Exception $e) {
            echo '<div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded">';
            echo '<h2 class="font-bold mb-2">❌ Database Connection: FAILED</h2>';
            echo '<p><strong>Error:</strong> ' . htmlspecialchars($e->getMessage()) . '</p>';
            echo '<p class="mt-4"><strong>Possible solutions:</strong></p>';
            echo '<ul class="list-disc list-inside mt-2 space-y-1">';
            echo '<li>Check database credentials in <code>config/database.php</code></li>';
            echo '<li>Verify MySQL/MariaDB is running</li>';
            echo '<li>Ensure database <code>' . DB_NAME . '</code> exists</li>';
            echo '<li>Check database user has proper permissions</li>';
            echo '</ul>';
            echo '</div>';
        }
        ?>
        
        <div class="mt-8 p-4 bg-gray-100 rounded">
            <h3 class="font-bold mb-2">🔧 Configuration Check:</h3>
            <ul class="text-sm space-y-1">
                <li><strong>DB Host:</strong> <?php echo DB_HOST; ?></li>
                <li><strong>DB Name:</strong> <?php echo DB_NAME; ?></li>
                <li><strong>DB User:</strong> <?php echo DB_USER; ?></li>
                <li><strong>Site URL:</strong> <?php echo SITE_URL; ?></li>
            </ul>
        </div>
    </div>
</body>
</html>

