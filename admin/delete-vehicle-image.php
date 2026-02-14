<?php
/**
 * SULOC Admin - Delete Vehicle Image
 * Handles deletion of vehicle images
 */

header('Content-Type: application/json');
require_once __DIR__ . '/../config/config.php';
requireLogin();

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// SECURITY CHECK: Module Freeze
if (isModuleFrozen('vehicles') && ($_SESSION['admin_role'] ?? '') !== 'creator') {
    echo json_encode(['success' => false, 'message' => 'ERREUR : Le module Véhicules est GELÉ. Suppression impossible.']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Get image ID
    $image_id = intval($_POST['image_id'] ?? 0);
    
    if ($image_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid image ID']);
        exit;
    }
    
    // Get image details
    $stmt = $pdo->prepare("SELECT * FROM vehicle_images WHERE id = ?");
    $stmt->execute([$image_id]);
    $image = $stmt->fetch();
    
    if (!$image) {
        echo json_encode(['success' => false, 'message' => 'Image not found']);
        exit;
    }
    
    // Delete from database
    $stmt = $pdo->prepare("DELETE FROM vehicle_images WHERE id = ?");
    $stmt->execute([$image_id]);
    
    // Try to delete physical file
    $imageUrl = $image['image_url'];
    $filename = basename(parse_url($imageUrl, PHP_URL_PATH));
    $filePath = __DIR__ . '/../uploads/vehicles/' . $filename;
    
    if (file_exists($filePath)) {
        unlink($filePath);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Image supprimée avec succès'
    ]);
    
} catch (Exception $e) {
    error_log("Image deletion error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la suppression'
    ]);
}
