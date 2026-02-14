<?php
/**
 * SULOC - Logistics RFQ Handler
 */
header('Content-Type: application/json');
require_once __DIR__ . '/../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$pdo = getDBConnection();

// SECURITY CHECK: Module Freeze
if (isModuleFrozen('logistics') && ($_SESSION['admin_role'] ?? '') !== 'creator') {
    echo json_encode(['success' => false, 'message' => 'ERREUR : Le module Logistique est actuellement GELÉ. Aucune nouvelle demande n\'est acceptée pour le moment.']);
    exit;
}

// Sanitize Inputs
$client_name = sanitizeInput($_POST['client_name'] ?? '');
$client_email = sanitizeInput($_POST['client_email'] ?? '');
$client_phone = sanitizeInput($_POST['client_phone'] ?? '');
$client_whatsapp = sanitizeInput($_POST['client_whatsapp'] ?? '');
$origin_country = sanitizeInput($_POST['origin_country'] ?? '');
$destination_country = sanitizeInput($_POST['destination_country'] ?? '');
$transit_port = sanitizeInput($_POST['transit_port'] ?? '');
$cargo_type = sanitizeInput($_POST['cargo_type'] ?? '');
$container_size = sanitizeInput($_POST['container_size'] ?? '');
$incoterm = sanitizeInput($_POST['incoterm'] ?? '');
$commodity_type = sanitizeInput($_POST['commodity_type'] ?? '');
$cargo_description = sanitizeInput($_POST['cargo_description'] ?? '');
$estimated_weight = floatval($_POST['estimated_weight'] ?? 0);

// Basic Validation
if (empty($client_name) || empty($client_phone) || empty($origin_country) || empty($destination_country)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all mandatory fields.']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO import_requests 
        (client_name, client_email, client_phone, client_whatsapp, origin_country, destination_country, transit_port, cargo_type, container_size, incoterm, commodity_type, cargo_description, estimated_weight, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')");
    
    $stmt->execute([
        $client_name, $client_email, $client_phone, $client_whatsapp,
        $origin_country, $destination_country, $transit_port,
        $cargo_type, $container_size, $incoterm, $commodity_type, $cargo_description,
        $estimated_weight
    ]);

    $requestId = $pdo->lastInsertId();

    // Prepare message for WhatsApp
    $wa_msg = "SULOC RFQ #$requestId\n";
    $wa_msg .= "Client: $client_name\n";
    $wa_msg .= "Route: $origin_country -> $destination_country (Port: $transit_port)\n";
    $wa_msg .= "Cargo: $commodity_type ($cargo_type / $container_size)\n";
    $wa_msg .= "Incoterm: $incoterm\n";
    $wa_msg .= "Weight: $estimated_weight kg";

    echo json_encode([
        'success' => true, 
        'message' => 'Your request for quotation has been submitted successfully.',
        'wa_message' => $wa_msg,
        'request_id' => $requestId
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error saving request: ' . $e->getMessage()]);
}
