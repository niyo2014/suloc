<?php
/**
 * SULOC - Main Configuration File
 * General site configuration and settings
 */

require_once __DIR__ . '/env.php';
loadEnvironment(dirname(__DIR__) . '/.env');

// Paths
define('ROOT_PATH', dirname(__DIR__));
define('INCLUDES_PATH', ROOT_PATH . '/includes');
define('ADMIN_PATH', ROOT_PATH . '/admin');
define('UPLOAD_PATH', ROOT_PATH . '/uploads');
define('UPLOAD_DIR', UPLOAD_PATH);

// Site configuration
define('SITE_NAME', 'SULOC');
define('SITE_TAGLINE', 'Logistique, Visa et Services Administratifs');

function detectBasePath(): string
{
    $docRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
    $projectRoot = ROOT_PATH;

    if ($docRoot === '') {
        return '';
    }

    $docRootReal = realpath($docRoot) ?: $docRoot;
    $projectRootReal = realpath($projectRoot) ?: $projectRoot;

    $docRootReal = rtrim(str_replace('\\', '/', $docRootReal), '/');
    $projectRootReal = rtrim(str_replace('\\', '/', $projectRootReal), '/');

    if ($docRootReal !== '' && strpos($projectRootReal, $docRootReal) === 0) {
        $relative = substr($projectRootReal, strlen($docRootReal));
        return $relative ? '/' . ltrim($relative, '/') : '';
    }

    return '';
}

function detectSiteUrl(): string
{
    $scheme = 'http';
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        $scheme = 'https';
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_PROTO'])) {
        $scheme = $_SERVER['HTTP_X_FORWARDED_PROTO'];
    }

    $host = $_SERVER['HTTP_HOST'] ?? '';
    $basePath = detectBasePath();

    // If running on localhost or via IP, use the current host instead of .env SITE_URL
    $isLocal = $host && (strpos($host, 'localhost') !== false || strpos($host, '127.0.0.1') !== false || preg_match('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/', $host));
    
    if (!$isLocal) {
        $envUrl = getenv('SITE_URL');
        if ($envUrl) {
            return rtrim($envUrl, '/');
        }
    }

    if (!$host) {
        $host = 'localhost';
    }

    return rtrim(sprintf('%s://%s%s', $scheme, $host, $basePath), '/');
}

$siteUrl = detectSiteUrl() ?: 'http://localhost';

define('SITE_URL', $siteUrl);
define('ADMIN_URL', SITE_URL . '/admin');
define('UPLOAD_URL', SITE_URL . '/uploads');

// Email Client Configuration (override in .env for production)
define('IMAP_HOST', getenv('IMAP_HOST') ?: 'mail.cicese-bi.com');
define('IMAP_PORT', getenv('IMAP_PORT') ?: 993);
define('IMAP_USER', getenv('IMAP_USER') ?: 'admin@cicese-bi.com');
define('IMAP_PASS', getenv('IMAP_PASS') ?: '');
define('IMAP_FLAGS', '/imap/ssl/novalidate-cert');

define('SMTP_HOST', getenv('SMTP_HOST') ?: 'mail.cicese-bi.com');
define('SMTP_PORT', getenv('SMTP_PORT') ?: 465);
define('SMTP_USER', getenv('SMTP_USER') ?: 'admin@cicese-bi.com');
define('SMTP_PASS', getenv('SMTP_PASS') ?: '');
define('SMTP_SECURE', getenv('SMTP_SECURE') ?: 'ssl');


// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 in production with HTTPS

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Timezone
date_default_timezone_set('Africa/Bujumbura');

// Error reporting (disable in production)
// Set DISPLAY_ERRORS=0 in .env for production
$displayErrors = getenv('DISPLAY_ERRORS') !== false ? (bool)getenv('DISPLAY_ERRORS') : true;
if ($displayErrors) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', ROOT_PATH . '/error_log');
}

// Include database configuration
require_once ROOT_PATH . '/config/database.php';

// --- RBAC: Global Kill-Switch & Maintenance Check ---
if (basename($_SERVER['PHP_SELF']) !== 'maintenance.php' && basename($_SERVER['PHP_SELF']) !== 'login.php' && !strpos($_SERVER['REQUEST_URI'], '/logout.php')) {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->query("SELECT maintenance_mode FROM system_status WHERE id = 1");
        $sysStatus = $stmt->fetch();
        
        if ($sysStatus && $sysStatus['maintenance_mode']) {
            // creator can bypass
            $isCreator = (isset($_SESSION['admin_role']) && $_SESSION['admin_role'] === 'creator');
            
            if (!$isCreator) {
                // If it's an admin page, redirect to admin login or maintenance
                // If it's front-end, redirect to maintenance.php
                header('Location: ' . SITE_URL . '/maintenance.php');
                exit;
            }
        }
    } catch (Exception $e) {
        // Fallback: if DB is dead and we're not on maintenance/login, don't crash but maybe log
        error_log("Maintenance Check Failed: " . $e->getMessage());
    }
}
// --------------------------------------------------

// Include and initialize Translator
require_once INCLUDES_PATH . '/Translator.php';
$translator = Translator::getInstance();

// Helper functions
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

function redirect($url) {
    if (!preg_match('#^https?://#i', $url)) {
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? parse_url(SITE_URL, PHP_URL_HOST);
        $base = $host ? sprintf('%s://%s', $scheme, $host) : SITE_URL;
        $url = rtrim($base, '/') . '/' . ltrim($url, '/');
    }

    header("Location: " . $url);
    exit();
}

function isLoggedIn() {
    return isset($_SESSION['admin_id']) && !empty($_SESSION['admin_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        redirect(ADMIN_URL . '/login.php');
    }
}

function hasPermission($permission) {
    if (!isset($_SESSION['admin_role'])) return false;
    
    // Creator and Super Admin have all permissions
    if ($_SESSION['admin_role'] === 'creator' || $_SESSION['admin_role'] === 'super_admin') {
        return true;
    }
    
    // Admin checks specific permissions
    $perms = $_SESSION['admin_permissions'] ?? [];
    if (is_string($perms)) {
        $perms = json_decode($perms, true) ?? [];
    }
    
    return in_array($permission, $perms);
}

function requireRole($allowedRoles) {
    requireLogin();
    
    if (is_string($allowedRoles)) {
        $allowedRoles = [$allowedRoles];
    }
    
    $currentRole = $_SESSION['admin_role'] ?? '';
    
    // Creator has access to everything
    if ($currentRole === 'creator') return;
    
    if (!in_array($currentRole, $allowedRoles)) {
        header('HTTP/1.1 403 Forbidden');
        die('Accès refusé. Vous n\'avez pas les droits nécessaires.');
    }
}

/**
 * Check if a specific business module is frozen (Read-only)
 */
function isModuleFrozen($module) {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->query("SELECT frozen_modules FROM system_status WHERE id = 1");
        $status = $stmt->fetch();
        if (!$status) return false;
        
        $frozen = json_decode($status['frozen_modules'], true) ?: [];
        return in_array($module, $frozen);
    } catch (Exception $e) {
        return false;
    }
}

function formatDate($date) {
    return date('d/m/Y H:i', strtotime($date));
}
