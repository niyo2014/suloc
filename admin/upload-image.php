<?php
/**
 * Image Upload Handler for Admin Panel
 */
// Start output buffering to catch any unexpected output
ob_start();

require_once __DIR__ . '/../config/config.php';

// Check if user is logged in - for AJAX requests, return JSON instead of redirecting
if (!isLoggedIn()) {
    ob_end_clean();
    header('Content-Type: application/json');
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentication required. Please log in.']);
    exit;
}

// Clear any output that might have been generated
ob_clean();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $errorCode = $_FILES['image']['error'] ?? 'UNKNOWN';
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive',
        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
    ];
    $errorMsg = $errorMessages[$errorCode] ?? 'Upload error code: ' . $errorCode;
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error: ' . $errorMsg]);
    exit;
}

$file = $_FILES['image'];
$uploadType = $_POST['type'] ?? 'project'; // project, service, team, etc.

// Validate file type (both MIME type and extension)
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($file['type'], $allowedTypes) || !in_array($extension, $allowedExtensions)) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.']);
    exit;
}

// Validate file size (max 5MB)
if ($file['size'] > 5 * 1024 * 1024) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'File too large. Maximum size is 5MB.']);
    exit;
}

// **--- FIX START ---**
// Determine the base path: This reliably steps from /admin (where this file is) back to the project root (/cicese-bi/).
$baseDir = __DIR__ . '/..'; 

// Create upload directory if it doesn't exist
$uploadDir = $baseDir . '/uploads/' . $uploadType . '/';
if (!is_dir($uploadDir)) {
    // We are maintaining your current 0755 permission setting
    mkdir($uploadDir, 0755, true); 
}
// **--- FIX END ---**

// Generate unique filename (extension already validated above)
$filename = uniqid() . '_' . time() . '.' . $extension;
$filepath = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    // Verify file was actually written
    if (!file_exists($filepath)) {
        ob_end_clean();
        echo json_encode(['success' => false, 'message' => 'File upload failed: File not found after upload']);
        exit;
    }
    
    $url = UPLOAD_URL . '/' . $uploadType . '/' . $filename;
    ob_end_clean();
    echo json_encode([
        'success' => true,
        'url' => $url,
        'filename' => $filename,
        'message' => 'Image uploaded successfully'
    ]);
} else {
    // Provide more detailed error message
    $errorMsg = 'Failed to move uploaded file';
    if (!is_writable($uploadDir)) {
        $errorMsg .= ': Upload directory is not writable. Please check permissions (should be 755 or 775)';
    } elseif (!is_dir($uploadDir)) {
        $errorMsg .= ': Upload directory does not exist';
    } else {
        $errorMsg .= ': Check file permissions and PHP upload settings';
    }
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => $errorMsg]);
}
?>