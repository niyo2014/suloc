<?php
/**
 * SULOC Admin - Vehicle Image Upload Handler
 * Handles multiple image uploads for vehicles
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
    echo json_encode(['success' => false, 'message' => 'ERREUR : Le module Véhicules est GELÉ. Upload impossible.']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    // Load ImageOptimizer
    require_once __DIR__ . '/../includes/ImageOptimizer.php';
    $optimizer = new ImageOptimizer();
    
    // Get vehicle ID
    $vehicle_id = intval($_POST['vehicle_id'] ?? 0);
    
    if ($vehicle_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid vehicle ID']);
        exit;
    }
    
    // Verify vehicle exists
    $stmt = $pdo->prepare("SELECT id FROM vehicles WHERE id = ?");
    $stmt->execute([$vehicle_id]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Vehicle not found']);
        exit;
    }
    
    // Check if files were uploaded
    if (empty($_FILES['images']['name'][0])) {
        echo json_encode(['success' => false, 'message' => 'No files uploaded']);
        exit;
    }
    
    // Create upload directory if it doesn't exist
    $uploadDir = __DIR__ . '/../uploads/vehicles/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $uploadedImages = [];
    $errors = [];
    
    // Process each uploaded file
    $fileCount = count($_FILES['images']['name']);
    for ($i = 0; $i < $fileCount; $i++) {
        $fileName = $_FILES['images']['name'][$i];
        $fileTmpName = $_FILES['images']['tmp_name'][$i];
        $fileSize = $_FILES['images']['size'][$i];
        $fileError = $_FILES['images']['error'][$i];
        $fileType = $_FILES['images']['type'][$i];
        
        // Skip if no file
        if ($fileError === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        
        // Check for upload errors
        if ($fileError !== UPLOAD_ERR_OK) {
            $errors[] = "Error uploading $fileName";
            continue;
        }
        
        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($fileType, $allowedTypes)) {
            $errors[] = "$fileName: Invalid file type. Only JPG, PNG, GIF, and WebP allowed.";
            continue;
        }
        
        // Validate file size (max 5MB)
        if ($fileSize > 5 * 1024 * 1024) {
            $errors[] = "$fileName: File too large. Maximum 5MB allowed.";
            continue;
        }
        
        // Generate unique filename
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $newFileName = 'vehicle_' . $vehicle_id . '_' . uniqid();
        $targetPath = $uploadDir . $newFileName . '.' . $fileExtension;
        
        // Move uploaded file to temp location
        if (move_uploaded_file($fileTmpName, $targetPath)) {
            // Optimize image
            $optimizePath = $uploadDir . $newFileName . '_optimized.' . $fileExtension;
            $result = $optimizer->optimizeImage($targetPath, $optimizePath);
            
            if ($result['success']) {
                // Delete original unoptimized file
                unlink($targetPath);
                
                // Use optimized version
                $finalPath = $result['original'];
                $webpPath = $result['webp'] ?? null;
                
                // Get current max order_index
                $stmt = $pdo->prepare("SELECT COALESCE(MAX(order_index), -1) + 1 as next_order FROM vehicle_images WHERE vehicle_id = ?");
                $stmt->execute([$vehicle_id]);
                $nextOrder = $stmt->fetchColumn();
                
                // Insert into database (use WebP if available, otherwise optimized original)
                $imageUrl = SITE_URL . '/uploads/vehicles/' . basename($webpPath ?? $finalPath);
                $altText = "Image of vehicle ID $vehicle_id";
                
                $stmt = $pdo->prepare("
                    INSERT INTO vehicle_images (vehicle_id, image_url, alt_text, order_index) 
                    VALUES (?, ?, ?, ?)
                ");
                $stmt->execute([$vehicle_id, $imageUrl, $altText, $nextOrder]);
                
                $uploadedImages[] = [
                    'id' => $pdo->lastInsertId(),
                    'url' => $imageUrl,
                    'filename' => basename($webpPath ?? $finalPath),
                    'optimized' => true,
                    'webp' => $webpPath !== null
                ];
            } else {
                $errors[] = "$fileName: Optimization failed - " . ($result['error'] ?? 'Unknown error');
                unlink($targetPath);
            }
        } else {
            $errors[] = "$fileName: Failed to move uploaded file";
        }
    }
    
    // Return response
    if (empty($uploadedImages) && !empty($errors)) {
        echo json_encode([
            'success' => false,
            'message' => 'No images uploaded',
            'errors' => $errors
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => count($uploadedImages) . ' image(s) uploaded successfully',
            'images' => $uploadedImages,
            'errors' => $errors
        ]);
    }
    
} catch (Exception $e) {
    error_log("Image upload error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
