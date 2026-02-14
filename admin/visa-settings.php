<?php
/**
 * SULOC Admin - Visa Notification Settings
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();

// Handle Settings Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_settings'])) {
    try {
        $pdo->beginTransaction();
        foreach ($_POST['settings'] as $key => $value) {
            $stmt = $pdo->prepare("UPDATE visa_assistance_settings SET setting_value = ? WHERE setting_key = ?");
            $stmt->execute([$value, $key]);
        }
        $pdo->commit();
        $successMsg = "Paramètres mis à jour avec succès.";
    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        $errorMsg = "Erreur: " . $e->getMessage();
    }
}

// Fetch Settings
$settings = $pdo->query("SELECT * FROM visa_assistance_settings")->fetchAll();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paramètres Notifications Visa - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>
    
    <div class="container mx-auto px-6 py-8 max-w-4xl">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-blue-900">Notifications Automatiques</h1>
            <p class="text-gray-600">Personnalisez les messages envoyés aux clients selon l'évolution de leur dossier.</p>
        </div>

        <?php if (isset($successMsg)): ?>
            <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8"><?php echo $successMsg; ?></div>
        <?php endif; ?>

        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div class="bg-blue-50 p-6 border-b border-gray-100">
                <h3 class="font-bold text-blue-900 flex items-center">
                    <i class="fas fa-magic mr-2 text-gold"></i> Variables disponibles
                </h3>
                <div class="flex flex-wrap gap-2 mt-3">
                    <code class="bg-white px-2 py-1 rounded border text-xs text-blue-800">{client_name}</code>
                    <code class="bg-white px-2 py-1 rounded border text-xs text-blue-800">{destination}</code>
                    <code class="bg-white px-2 py-1 rounded border text-xs text-blue-800">{visa_type}</code>
                    <code class="bg-white px-2 py-1 rounded border text-xs text-blue-800">{status}</code>
                </div>
            </div>

            <form method="POST" class="p-8 space-y-8">
                <?php foreach ($settings as $setting): ?>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">
                            <?php echo htmlspecialchars($setting['description']); ?>
                            <span class="text-xs text-gray-400 ml-2 font-normal">(<?php echo $setting['setting_key']; ?>)</span>
                        </label>
                        <textarea name="settings[<?php echo $setting['setting_key']; ?>]" rows="3" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition"><?php echo htmlspecialchars($setting['setting_value']); ?></textarea>
                    </div>
                <?php endforeach; ?>

                <div class="flex justify-end pt-4">
                    <button type="submit" name="update_settings" class="bg-blue-900 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-800 transition shadow-lg">
                        Enregistrer les templates
                    </button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
