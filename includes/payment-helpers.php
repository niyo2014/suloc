<?php
/**
 * SULOC Payment System Helpers (v2.0)
 */

/**
 * Generate a unique SULOC verification code
 * Format: SU-XXX-XXX where X is alphanumeric excluding confusing characters
 */
function generateSULOCode($pdo) {
    $chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // Excludes 0, 1, I, L, O
    $unique = false;
    $code = '';
    while (!$unique) {
        $p1 = ''; for ($i = 0; $i < 3; $i++) $p1 .= $chars[rand(0, strlen($chars) - 1)];
        $p2 = ''; for ($i = 0; $i < 3; $i++) $p2 .= $chars[rand(0, strlen($chars) - 1)];
        $code = "SU-{$p1}-{$p2}";
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM payment_requests WHERE verification_code = ?");
        $stmt->execute([$code]);
        if ($stmt->fetchColumn() == 0) $unique = true;
    }
    return $code;
}

/**
 * Calculate Transfer Fees
 */
function calculateTransferFees($amount, $percentage) {
    $fee = ($amount * $percentage) / 100;
    return round($fee, 2);
}

/**
 * Get transfer status details for public display (v2.0)
 */
function getTransferStatus($pdo, $code) {
    $stmt = $pdo->prepare("SELECT payout_status, payment_verification_status, amount_to_receive, currency, created_at FROM payment_requests WHERE verification_code = ?");
    $stmt->execute([$code]);
    return $stmt->fetch();
}

/**
 * Format status message and color (v2.0)
 */
function formatPayoutStatus($payoutStatus, $verificationStatus = 'verified') {
    if ($verificationStatus === 'pending') {
        return ['label' => 'En attente de vérification bancaire', 'class' => 'status-confirm-pending', 'color' => '#6366f1'];
    }

    switch ($payoutStatus) {
        case 'Pending':
            return ['label' => 'En cours de traitement', 'class' => 'status-pending', 'color' => '#fbbf24'];
        case 'Ready':
            return ['label' => 'Prêt pour retrait', 'class' => 'status-ready', 'color' => '#10b981'];
        case 'Paid':
            return ['label' => 'Déjà Payé', 'class' => 'status-paid', 'color' => '#3b82f6'];
        case 'Cancelled':
            return ['label' => 'Annulé', 'class' => 'status-cancelled', 'color' => '#ef4444'];
        default:
            return ['label' => 'Inconnu', 'class' => 'status-unknown', 'color' => '#6b7280'];
    }
}
