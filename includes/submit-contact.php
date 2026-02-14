<?php
/**
 * SULOC - Contact Form Submission Handler
 * Processes contact form submissions
 */

header('Content-Type: application/json');

require_once __DIR__ . '/../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get and sanitize form data
$name = sanitizeInput($_POST['name'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = sanitizeInput($_POST['phone'] ?? '');
$serviceType = sanitizeInput($_POST['service_type'] ?? '');
$message = sanitizeInput($_POST['message'] ?? '');

// Validate required fields
if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Tous les champs obligatoires doivent être remplis']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Adresse email invalide']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Insert submission into database
    $stmt = $pdo->prepare("INSERT INTO contact_submissions (name, email, phone, service_type, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $phone, $serviceType, $message]);
    
    // Optionally send email notification
    // mail($adminEmail, 'Nouvelle demande de devis', $message);
    
    echo json_encode(['success' => true, 'message' => 'Votre demande a été envoyée avec succès']);
} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Une erreur est survenue. Veuillez réessayer.']);
}

