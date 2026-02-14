<?php
/**
 * SULOC - Vehicle Inquiry Form Handler
 * Processes vehicle inquiry submissions
 */

header('Content-Type: application/json');
require_once __DIR__ . '/../config/config.php';

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Sanitize and validate inputs
    $vehicle_id = intval($_POST['vehicle_id'] ?? 0);
    $client_name = sanitizeInput($_POST['client_name'] ?? '');
    $client_email = sanitizeInput($_POST['client_email'] ?? '');
    $client_phone = sanitizeInput($_POST['client_phone'] ?? '');
    $client_whatsapp = sanitizeInput($_POST['client_whatsapp'] ?? '');
    $message = sanitizeInput($_POST['message'] ?? '');
    
    // Validation
    $errors = [];
    
    if (empty($client_name)) {
        $errors[] = 'Le nom est requis';
    }
    
    if (empty($client_phone)) {
        $errors[] = 'Le téléphone est requis';
    }
    
    if ($vehicle_id <= 0) {
        $errors[] = 'Véhicule invalide';
    }
    
    // Validate email if provided
    if (!empty($client_email) && !filter_var($client_email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Email invalide';
    }
    
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
        exit;
    }
    
    // Verify vehicle exists
    $stmt = $pdo->prepare("SELECT id, brand, model, year FROM vehicles WHERE id = ? AND is_active = 1");
    $stmt->execute([$vehicle_id]);
    $vehicle = $stmt->fetch();
    
    if (!$vehicle) {
        echo json_encode(['success' => false, 'message' => 'Véhicule non trouvé']);
        exit;
    }
    
    // Insert into database
    $stmt = $pdo->prepare("
        INSERT INTO vehicle_requests 
        (vehicle_id, client_name, client_email, client_phone, client_whatsapp, message, status, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, 'new', NOW())
    ");
    
    $stmt->execute([
        $vehicle_id,
        $client_name,
        $client_email,
        $client_phone,
        $client_whatsapp,
        $message
    ]);
    
    $request_id = $pdo->lastInsertId();
    
    // TODO: Send email notification to admin
    // TODO: Send confirmation email to client if email provided
    
    // Log the submission
    error_log("New vehicle inquiry: ID=$request_id, Vehicle={$vehicle['brand']} {$vehicle['model']}, Client=$client_name");
    
    echo json_encode([
        'success' => true,
        'message' => 'Votre demande a été envoyée avec succès!',
        'request_id' => $request_id
    ]);
    
} catch (Exception $e) {
    error_log("Vehicle inquiry error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur est survenue. Veuillez réessayer.'
    ]);
}
