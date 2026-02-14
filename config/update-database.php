<?php
/**
 * Update Database Schema for Enhanced Project Fields
 * Run this once to add new fields to projects table
 */

require_once __DIR__ . '/database.php';

$pdo = getDBConnection();

try {
    // Add new columns to projects table if they don't exist
    $columns = [
        'challenges' => 'TEXT',
        'solutions' => 'TEXT',
        'key_features' => 'TEXT',
        'statistics' => 'TEXT',
        'testimonial' => 'TEXT',
        'testimonial_author' => 'VARCHAR(255)',
        'testimonial_role' => 'VARCHAR(255)',
        'client' => 'VARCHAR(255)',
        'duration' => 'VARCHAR(100)',
        'budget' => 'VARCHAR(100)',
        'services_used' => 'TEXT',
        'impact_educational' => 'TEXT',
        'impact_environmental' => 'TEXT',
    ];
    
    foreach ($columns as $column => $type) {
        try {
            $pdo->exec("ALTER TABLE projects ADD COLUMN $column $type");
            echo "✓ Added column: $column<br>";
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate column') !== false) {
                echo "→ Column $column already exists<br>";
            } else {
                echo "✗ Error adding $column: " . $e->getMessage() . "<br>";
            }
        }
    }
    
    echo "<br><strong>Database update complete!</strong><br>";
    echo "<a href='../admin/projects.php'>Go to Admin</a>";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>

