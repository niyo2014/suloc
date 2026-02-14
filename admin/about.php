<?php
/**
 * SULOC Admin - About Section Management
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();
$message = '';
$messageType = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $pdo->beginTransaction();
        
        $stmt = $pdo->prepare("UPDATE about_content SET section_value = :value WHERE section_key = :key");

        foreach ($_POST as $key => $value) {
            if ($key === 'intervention_items' || $key === 'office_equipment_items' || $key === 'field_equipment_items' || $key === 'transversal_services_items' || $key === 'complementary_resources_items') {
                $items = array_filter(array_map('trim', explode("\n", $value)));
                $jsonValue = json_encode($items, JSON_UNESCAPED_UNICODE);
                $stmt->execute(['value' => $jsonValue, 'key' => $key]);
            } else {
                $stmt->execute(['value' => $value, 'key' => $key]);
            }
        }
        
        $pdo->commit();
        $message = 'Informations de la section "À Propos" mises à jour avec succès!';
        $messageType = 'success';
    } catch (Exception $e) {
        $pdo->rollBack();
        $message = 'Erreur lors de la mise à jour: ' . $e->getMessage();
        $messageType = 'error';
    }
}

// Fetch current content
$aboutContent = [];
try {
    $stmt = $pdo->query("SELECT section_key, section_value FROM about_content");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $aboutContent[$row['section_key']] = $row['section_value'];
    }
} catch (Exception $e) {
    // If table doesn't exist, show an error and link to the update script
    $message = "La table 'about_content' semble ne pas exister. Veuillez <a href='../config/update_database_about.php' target='_blank' class='font-bold underline'>exécuter le script de mise à jour</a>.";
    $messageType = 'error';
}


function get_textarea_content($key, $content, $is_json = true) {
    if (isset($content[$key])) {
        if (!$is_json) {
            return htmlspecialchars($content[$key]);
        }
        $decoded = json_decode($content[$key], true);
        if (is_array($decoded)) {
            return implode("\n", $decoded);
        }
    }
    return '';
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion de la Section "À Propos" - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>
    
    <div class="container mx-auto px-6 py-8">
        <h1 class="text-3xl font-bold text-blue-900 mb-8">Gestion de la Section "À Propos"</h1>
        
        <?php if ($message): ?>
        <div class="bg-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-100 border border-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-400 text-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-700 px-4 py-3 rounded mb-6">
            <?php echo $message; ?>
        </div>
        <?php endif; ?>
        
        <?php if (!empty($aboutContent)): ?>
        <form method="POST" action="" class="bg-white rounded-xl shadow-lg p-8">
            
            <!-- Main Info -->
            <div class="mb-10">
                <h2 class="text-2xl font-bold text-blue-900 mb-6 border-b pb-3">Informations Principales</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Sous-titre</label>
                        <input type="text" name="subtitle" value="<?php echo htmlspecialchars($aboutContent['subtitle'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Titre Principal</label>
                        <input type="text" name="title" value="<?php echo htmlspecialchars($aboutContent['title'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg">
                    </div>
                </div>
                <div class="mt-6">
                    <label class="block text-gray-700 font-semibold mb-2">Texte d'Introduction</label>
                    <textarea name="main_text" rows="5" class="w-full px-4 py-3 border rounded-lg"><?php echo htmlspecialchars($aboutContent['main_text'] ?? ''); ?></textarea>
                    <p class="text-sm text-gray-500 mt-1">Vous pouvez utiliser les balises &lt;strong&gt; pour mettre le texte en gras.</p>
                </div>
            </div>

            <!-- Interventions -->
            <div class="mb-10">
                <h2 class="text-2xl font-bold text-blue-900 mb-6 border-b pb-3">Domaines d'Intervention</h2>
                <div class="mb-4">
                    <label class="block text-gray-700 font-semibold mb-2">Titre de la section</label>
                    <input type="text" name="intervention_title" value="<?php echo htmlspecialchars($aboutContent['intervention_title'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg">
                </div>
                <div>
                    <label class="block text-gray-700 font-semibold mb-2">Liste des interventions (une par ligne)</label>
                    <textarea name="intervention_items" rows="5" class="w-full px-4 py-3 border rounded-lg"><?php echo get_textarea_content('intervention_items', $aboutContent); ?></textarea>
                </div>
            </div>

            <!-- Technical Means -->
            <div class="mb-10">
                <h2 class="text-2xl font-bold text-blue-900 mb-6 border-b pb-3">Moyens Techniques</h2>
                <div class="mb-6">
                    <label class="block text-gray-700 font-semibold mb-2">Titre de la section</label>
                    <input type="text" name="tech_means_title" value="<?php echo htmlspecialchars($aboutContent['tech_means_title'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg">
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Titre Équipements de Bureau</label>
                        <input type="text" name="office_equipment_title" value="<?php echo htmlspecialchars($aboutContent['office_equipment_title'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg mb-2">
                        <label class="block text-gray-700 font-semibold mb-2">Liste (une par ligne)</label>
                        <textarea name="office_equipment_items" rows="6" class="w-full px-4 py-3 border rounded-lg"><?php echo get_textarea_content('office_equipment_items', $aboutContent); ?></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Titre Équipements Terrain</label>
                        <input type="text" name="field_equipment_title" value="<?php echo htmlspecialchars($aboutContent['field_equipment_title'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg mb-2">
                        <label class="block text-gray-700 font-semibold mb-2">Liste (une par ligne)</label>
                        <textarea name="field_equipment_items" rows="6" class="w-full px-4 py-3 border rounded-lg"><?php echo get_textarea_content('field_equipment_items', $aboutContent); ?></textarea>
                    </div>
                </div>
            </div>

            <!-- Methodology -->
            <div class="mb-10">
                <h2 class="text-2xl font-bold text-blue-900 mb-6 border-b pb-3">Méthodologie</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Sous-titre</label>
                        <input type="text" name="methodology_subtitle" value="<?php echo htmlspecialchars($aboutContent['methodology_subtitle'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Titre</label>
                        <input type="text" name="methodology_title" value="<?php echo htmlspecialchars($aboutContent['methodology_title'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg">
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Étape 1 - Titre</label>
                        <input type="text" name="methodology_step1_title" value="<?php echo htmlspecialchars($aboutContent['methodology_step1_title'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg mb-2">
                        <label class="block text-gray-700 font-semibold mb-2">Étape 1 - Texte</label>
                        <textarea name="methodology_step1_text" rows="6" class="w-full px-4 py-3 border rounded-lg"><?php echo htmlspecialchars($aboutContent['methodology_step1_text'] ?? ''); ?></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Étape 2 - Titre</label>
                        <input type="text" name="methodology_step2_title" value="<?php echo htmlspecialchars($aboutContent['methodology_step2_title'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg mb-2">
                        <label class="block text-gray-700 font-semibold mb-2">Étape 2 - Texte</label>
                        <textarea name="methodology_step2_text" rows="6" class="w-full px-4 py-3 border rounded-lg"><?php echo htmlspecialchars($aboutContent['methodology_step2_text'] ?? ''); ?></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Étape 3 - Titre</label>
                        <input type="text" name="methodology_step3_title" value="<?php echo htmlspecialchars($aboutContent['methodology_step3_title'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg mb-2">
                        <label class="block text-gray-700 font-semibold mb-2">Étape 3 - Texte</label>
                        <textarea name="methodology_step3_text" rows="6" class="w-full px-4 py-3 border rounded-lg"><?php echo htmlspecialchars($aboutContent['methodology_step3_text'] ?? ''); ?></textarea>
                    </div>
                </div>
                 <p class="text-sm text-gray-500 mt-2">Vous pouvez utiliser les balises &lt;strong&gt; pour mettre le texte en gras.</p>
            </div>
            
            <!-- Admin Organization -->
            <div class="mb-10">
                <h2 class="text-2xl font-bold text-blue-900 mb-6 border-b pb-3">Organisation Administrative</h2>
                <div class="mb-6">
                    <label class="block text-gray-700 font-semibold mb-2">Titre de la section</label>
                    <input type="text" name="admin_org_title" value="<?php echo htmlspecialchars($aboutContent['admin_org_title'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg">
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Titre Services Transversaux</label>
                        <input type="text" name="transversal_services_title" value="<?php echo htmlspecialchars($aboutContent['transversal_services_title'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg mb-2">
                        <label class="block text-gray-700 font-semibold mb-2">Liste (une par ligne)</label>
                        <textarea name="transversal_services_items" rows="5" class="w-full px-4 py-3 border rounded-lg"><?php echo get_textarea_content('transversal_services_items', $aboutContent); ?></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Titre Ressources Complémentaires</label>
                        <input type="text" name="complementary_resources_title" value="<?php echo htmlspecialchars($aboutContent['complementary_resources_title'] ?? ''); ?>" class="w-full px-4 py-3 border rounded-lg mb-2">
                        <label class="block text-gray-700 font-semibold mb-2">Liste (une par ligne)</label>
                        <textarea name="complementary_resources_items" rows="5" class="w-full px-4 py-3 border rounded-lg"><?php echo get_textarea_content('complementary_resources_items', $aboutContent); ?></textarea>
                    </div>
                </div>
            </div>

            <div>
                <button type="submit" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg">
                    <i class="fas fa-save mr-2"></i>Enregistrer les Modifications
                </button>
            </div>
        </form>
        <?php endif; ?>
    </div>
</body>
</html>
