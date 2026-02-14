<?php
/**
 * SULOC - Language Change Handler
 * Handles AJAX requests to change language
 */

session_start();
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$lang = $data['lang'] ?? '';

// Validate language
if (!in_array($lang, ['fr', 'en'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid language']);
    exit;
}

// Set language in session and cookie
$_SESSION['lang'] = $lang;
setcookie('lang', $lang, time() + (86400 * 365), '/'); // 1 year

echo json_encode(['success' => true, 'language' => $lang]);
