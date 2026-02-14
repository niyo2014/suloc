<?php
/**
 * SULOC - Database Configuration
 * Database connection and configuration settings
 */

if (!function_exists('loadEnvironment')) {
    require_once __DIR__ . '/env.php';
}
loadEnvironment(dirname(__DIR__) . '/.env');

// Database configuration (can be overridden via environment variables)
// IMPORTANT: For production, set these in .env file - DO NOT hardcode credentials!
if (!defined('DB_HOST')) {
    define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
}

if (!defined('DB_NAME')) {
    // Default for local development only - override in .env for production
    define('DB_NAME', getenv('DB_NAME') ?: '');
}

if (!defined('DB_USER')) {
    // Default for local development only - override in .env for production
    define('DB_USER', getenv('DB_USER') ?: '');
}

if (!defined('DB_PASS')) {
    // Default for local development only - override in .env for production
    define('DB_PASS', getenv('DB_PASS') ?: '');
}

if (!defined('DB_CHARSET')) {
    define('DB_CHARSET', getenv('DB_CHARSET') ?: 'utf8mb4');
}

// Create database connection
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        die("Database connection failed. Please contact the administrator.");
    }
}

