<?php
/**
 * SULOC - Visa Request Handler
 */
header('Content-Type: application/json');
require_once __DIR__ . '/../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$pdo = getDBConnection();

// SECURITY CHECK: Module Freeze
if (isModuleFrozen('visa') && ($_SESSION['admin_role'] ?? '') !== 'creator') {
    echo json_encode(['success' => false, 'message' => 'ERREUR : Le module Visa est actuellement GELÉ. Aucune nouvelle demande n\'est acceptée pour le moment.']);
    exit;
}

// 1. Sanitize Inputs
$fullName = sanitizeInput($_POST['full_name'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$phone = sanitizeInput($_POST['phone'] ?? '');
$originCountry = sanitizeInput($_POST['origin_country'] ?? '');
$destinationCountry = sanitizeInput($_POST['destination_country'] ?? '');
$visaType = sanitizeInput($_POST['visa_type'] ?? '');
$departureDate = sanitizeInput($_POST['departure_date'] ?? null);
$durationStay = sanitizeInput($_POST['duration_stay'] ?? '');
$travelPurpose = sanitizeInput($_POST['travel_purpose'] ?? '');

// Validation
if (empty($fullName) || empty($email) || empty($phone) || empty($originCountry) || empty($destinationCountry) || empty($visaType)) {
    echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs obligatoires (*)']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 2. Insert Request
    $stmt = $pdo->prepare("INSERT INTO visa_assistance_requests 
        (full_name, email, phone, origin_country, destination_country, visa_type, travel_purpose, departure_date, duration_stay, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'received')");
    
    $stmt->execute([
        $fullName, $email, $phone, $originCountry, $destinationCountry, $visaType, 
        $travelPurpose, (!empty($departureDate) ? $departureDate : null), $durationStay
    ]);
    
    $requestId = $pdo->lastInsertId();

    // 3. Handle File Uploads
    if (!empty($_FILES['documents']['name'][0])) {
        $uploadDir = __DIR__ . '/../uploads/visa_docs/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
        $maxFileSize = 5 * 1024 * 1024; // 5MB

        foreach ($_FILES['documents']['name'] as $key => $name) {
            $tmpName = $_FILES['documents']['tmp_name'][$key];
            $size = $_FILES['documents']['size'][$key];
            $error = $_FILES['documents']['error'][$key];

            if ($error === UPLOAD_ERR_OK) {
                $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
                if (in_array($ext, $allowedExtensions)) {
                    if ($size <= $maxFileSize) {
                        $newFileName = 'visa_' . $requestId . '_' . uniqid() . '.' . $ext;
                        $destination = $uploadDir . $newFileName;

                        if (move_uploaded_file($tmpName, $destination)) {
                            // Save doc reference
                            $docStmt = $pdo->prepare("INSERT INTO visa_assistance_docs (request_id, file_name, file_path, file_type, file_size) VALUES (?, ?, ?, ?, ?)");
                            $docStmt->execute([$requestId, $name, $newFileName, $_FILES['documents']['type'][$key], $size]);
                        }
                    }
                }
            }
        }
    }

    // 4. Log Action
    $logStmt = $pdo->prepare("INSERT INTO visa_assistance_logs (request_id, action_type, action_description) VALUES (?, 'submission', 'Nouvelle demande soumise par le client')");
    $logStmt->execute([$requestId]);

    $pdo->commit();

    // 5. Send Notification (Optional/Placeholder for now)
    // Here as specified in point 4, automatic messages could be triggered.
    
    echo json_encode(['success' => true, 'message' => 'Votre demande a été envoyée avec succès. SULOC vous contactera prochainement.']);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'enregistrement : ' . $e->getMessage()]);
}
