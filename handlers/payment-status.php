<?php
/**
 * SULOC Payment Status AJAX Handler
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/payment-helpers.php';

header('Content-Type: application/json');

// Simple Rate Limiting (Session Based)
if (!isset($_SESSION['tracker_attempts'])) {
    $_SESSION['tracker_attempts'] = 0;
    $_SESSION['last_tracker_request'] = time();
}

if (time() - $_SESSION['last_tracker_request'] < 2) {
    if ($_SESSION['tracker_attempts'] > 10) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many requests. Please wait.']);
        exit;
    }
} else {
    $_SESSION['tracker_attempts'] = 0;
}

$_SESSION['tracker_attempts']++;
$_SESSION['last_tracker_request'] = time();

$code = strtoupper(trim($_GET['code'] ?? ''));

if (empty($code)) {
    echo json_encode(['error' => 'Code requis']);
    exit;
}

$pdo = getDBConnection();
$status = getTransferStatus($pdo, $code);

if ($status) {
    $info = formatPayoutStatus($status['payout_status'], $status['payment_verification_status']);
    echo json_encode([
        'found' => true,
        'status' => $status['payout_status'],
        'v_status' => $status['payment_verification_status'],
        'label' => $info['label'],
        'color' => $info['color'],
        'amount' => number_format($status['amount_to_receive'], 2),
        'currency' => $status['currency'],
        'date' => date('d/m/Y', strtotime($status['created_at']))
    ]);
} else {
    echo json_encode(['found' => false]);
}
