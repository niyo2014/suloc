<?php
/**
 * SULOC Admin - Translation Management
 * Interface for managing site translations
 */

require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();
$message = '';
$messageType = '';

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'sync_from_files') {
        // Sync translations from JSON files to database
        try {
            $languages = ['fr', 'en'];
            $synced = 0;
            
            foreach ($languages as $lang) {
                $file = __DIR__ . '/../lang/' . $lang . '.json';
                if (file_exists($file)) {
                    $json = file_get_contents($file);
                    $translations = json_decode($json, true);
                    
                    if ($translations) {
                        foreach ($translations as $key => $value) {
                            // Check if translation exists
                            $stmt = $pdo->prepare("SELECT id FROM translations WHERE translation_key = ? AND language = ?");
                            $stmt->execute([$key, $lang]);
                            
                            if ($stmt->fetch()) {
                                // Update existing
                                $stmt = $pdo->prepare("UPDATE translations SET translation_value = ?, updated_at = NOW() WHERE translation_key = ? AND language = ?");
                                $stmt->execute([$value, $key, $lang]);
                            } else {
                                // Insert new
                                $stmt = $pdo->prepare("INSERT INTO translations (translation_key, translation_value, language, is_active) VALUES (?, ?, ?, 1)");
                                $stmt->execute([$key, $value, $lang]);
                            }
                            $synced++;
                        }
                    }
                }
            }
            
            $message = "$synced traductions synchronisées avec succès!";
            $messageType = 'success';
        } catch (Exception $e) {
            $message = 'Erreur: ' . $e->getMessage();
            $messageType = 'error';
        }
    } elseif ($action === 'update') {
        // Update a single translation
        $id = intval($_POST['id'] ?? 0);
        $value = sanitizeInput($_POST['value'] ?? '');
        
        try {
            $stmt = $pdo->prepare("UPDATE translations SET translation_value = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([$value, $id]);
            
            $message = 'Traduction mise à jour avec succès!';
            $messageType = 'success';
        } catch (Exception $e) {
            $message = 'Erreur: ' . $e->getMessage();
            $messageType = 'error';
        }
    } elseif ($action === 'toggle') {
        // Toggle active status
        $id = intval($_POST['id'] ?? 0);
        
        try {
            $stmt = $pdo->prepare("UPDATE translations SET is_active = NOT is_active WHERE id = ?");
            $stmt->execute([$id]);
            
            $message = 'Statut mis à jour avec succès!';
            $messageType = 'success';
        } catch (Exception $e) {
            $message = 'Erreur: ' . $e->getMessage();
            $messageType = 'error';
        }
    }
}

// Get filter parameters
$language = $_GET['lang'] ?? 'fr';
$search = $_GET['search'] ?? '';

// Build query
$where = ["language = ?"];
$params = [$language];

if (!empty($search)) {
    $where[] = "(translation_key LIKE ? OR translation_value LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

$whereClause = implode(' AND ', $where);

// Get translations
$stmt = $pdo->prepare("
    SELECT * FROM translations 
    WHERE $whereClause 
    ORDER BY translation_key ASC
");
$stmt->execute($params);
$translations = $stmt->fetchAll();

$pageTitle = 'Gestion des Traductions - SULOC Admin';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --suloc-navy: #0a2342;
            --suloc-gold: #d4af37;
        }
        .bg-suloc-navy { background-color: var(--suloc-navy); }
        .text-suloc-gold { color: var(--suloc-gold); }
    </style>
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>
    
    <div class="container mx-auto px-6 py-8">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-suloc-navy">Gestion des Traductions</h1>
                <p class="text-gray-600 mt-1">Gérez les traductions multilingues du site</p>
            </div>
            <form method="POST" action="">
                <input type="hidden" name="action" value="sync_from_files">
                <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    <i class="fas fa-sync mr-2"></i> Synchroniser depuis les fichiers
                </button>
            </form>
        </div>
        
        <?php if ($message): ?>
        <div class="mb-6 p-4 rounded-lg <?php echo $messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'; ?>">
            <?php echo htmlspecialchars($message); ?>
        </div>
        <?php endif; ?>
        
        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <form method="GET" action="" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Langue</label>
                    <select name="lang" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="fr" <?php echo $language === 'fr' ? 'selected' : ''; ?>>Français</option>
                        <option value="en" <?php echo $language === 'en' ? 'selected' : ''; ?>>English</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Rechercher</label>
                    <input type="text" name="search" value="<?php echo htmlspecialchars($search); ?>" 
                           placeholder="Clé ou valeur..." 
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div class="flex items-end">
                    <button type="submit" class="w-full bg-suloc-navy text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition">
                        <i class="fas fa-filter mr-2"></i> Filtrer
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Translations Table -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-suloc-navy text-white">
                        <tr>
                            <th class="px-6 py-4 text-left">Clé</th>
                            <th class="px-6 py-4 text-left">Traduction</th>
                            <th class="px-6 py-4 text-center">Statut</th>
                            <th class="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($translations)): ?>
                        <tr>
                            <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                                <i class="fas fa-language text-4xl mb-2"></i>
                                <p>Aucune traduction trouvée</p>
                            </td>
                        </tr>
                        <?php else: ?>
                        <?php foreach ($translations as $translation): ?>
                        <tr class="border-b border-gray-200 hover:bg-gray-50">
                            <td class="px-6 py-4">
                                <code class="text-sm bg-gray-100 px-2 py-1 rounded"><?php echo htmlspecialchars($translation['translation_key']); ?></code>
                            </td>
                            <td class="px-6 py-4">
                                <form method="POST" action="" class="flex items-center gap-2" onsubmit="return confirm('Mettre à jour cette traduction?');">
                                    <input type="hidden" name="action" value="update">
                                    <input type="hidden" name="id" value="<?php echo $translation['id']; ?>">
                                    <input type="text" name="value" value="<?php echo htmlspecialchars($translation['translation_value']); ?>" 
                                           class="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <button type="submit" class="text-blue-600 hover:text-blue-800">
                                        <i class="fas fa-save"></i>
                                    </button>
                                </form>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <form method="POST" action="" class="inline">
                                    <input type="hidden" name="action" value="toggle">
                                    <input type="hidden" name="id" value="<?php echo $translation['id']; ?>">
                                    <button type="submit" class="<?php echo $translation['is_active'] ? 'text-green-600' : 'text-gray-400'; ?> hover:opacity-70">
                                        <i class="fas fa-<?php echo $translation['is_active'] ? 'check-circle' : 'times-circle'; ?>"></i>
                                    </button>
                                </form>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span class="text-xs text-gray-500">
                                    <?php echo date('d/m/Y', strtotime($translation['updated_at'] ?? $translation['created_at'])); ?>
                                </span>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Total Traductions</p>
                        <p class="text-3xl font-bold text-suloc-navy"><?php echo count($translations); ?></p>
                    </div>
                    <i class="fas fa-language text-4xl text-blue-200"></i>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Actives</p>
                        <p class="text-3xl font-bold text-green-600">
                            <?php echo count(array_filter($translations, fn($t) => $t['is_active'])); ?>
                        </p>
                    </div>
                    <i class="fas fa-check-circle text-4xl text-green-200"></i>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Inactives</p>
                        <p class="text-3xl font-bold text-gray-600">
                            <?php echo count(array_filter($translations, fn($t) => !$t['is_active'])); ?>
                        </p>
                    </div>
                    <i class="fas fa-times-circle text-4xl text-gray-200"></i>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
