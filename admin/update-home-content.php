<?php
// admin/update-home-content.php
require_once __DIR__ . '/../config/config.php';
requireLogin(); // Use the consistent authentication function

// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $pdo = getDBConnection();

    // Prepare the statement for updating content using PDO
    $sql = "INSERT INTO site_content (content_key, content_value) VALUES (:key, :value) ON DUPLICATE KEY UPDATE content_value = VALUES(content_value)";
    $stmt = $pdo->prepare($sql);

    if ($stmt === false) {
        exit('Failed to prepare the database statement.');
    }

    // A list of all expected keys from the form
    $expected_keys = [
        'hero_headline', 'hero_tagline',
        'hero_cta1_text', 'hero_cta1_link',
        'hero_cta2_text', 'hero_cta2_link',
        'stat1_value', 'stat1_label',
        'stat2_value', 'stat2_label',
        'stat3_value', 'stat3_label',
        'stat4_value', 'stat4_label'
    ];

    // Loop through the expected keys and update the database
    foreach ($expected_keys as $key) {
        // Check if the key exists in the POST data, default to empty string if not
        $value = isset($_POST[$key]) ? trim($_POST[$key]) : '';
        
        // Execute the statement for each key-value pair
        $stmt->execute(['key' => $key, 'value' => $value]);
    }

    // Close the statement
    $stmt->closeCursor();
    
    // Redirect back to the home content editor with a success message
    header('Location: home.php?status=success');
    exit();

} else {
    // If not a POST request, redirect to the dashboard
    header('Location: index.php');
    exit();
}
?>
