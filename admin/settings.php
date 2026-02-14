<?php
/**
 * SULOC Admin - Site Settings
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();
requireRole(['creator', 'super_admin']);

$pdo = getDBConnection();
$message = '';
$messageType = '';

// Handle settings update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($_POST as $key => $value) {
        if ($key !== 'submit') {
            $value = sanitizeInput($value);
            $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
            $stmt->execute([$key, $value, $value]);
        }
    }
    $message = 'Paramètres enregistrés avec succès!';
    $messageType = 'success';
}

// Get all settings
$settings = [];
$stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings");
while ($row = $stmt->fetch()) {
    $settings[$row['setting_key']] = $row['setting_value'];
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paramètres du Site - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>
    
    <div class="container mx-auto px-6 py-8">
        <h1 class="text-3xl font-bold text-blue-900 mb-8">Paramètres du Site</h1>
        
        <?php if ($message): ?>
        <div class="bg-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-100 border border-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-400 text-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-700 px-4 py-3 rounded mb-4">
            <?php echo htmlspecialchars($message); ?>
        </div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
                <h2 class="text-2xl font-bold text-blue-900 mb-6">Informations de Contact</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Téléphone Principal</label>
                        <input type="text" name="phone" value="<?php echo htmlspecialchars($settings['phone'] ?? '+257 79 496 117'); ?>" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Téléphone Secondaire</label>
                        <input type="text" name="phone2" value="<?php echo htmlspecialchars($settings['phone2'] ?? '+257 69 826 865'); ?>" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Email Principal</label>
                        <input type="email" name="email" value="<?php echo htmlspecialchars($settings['email'] ?? 'ndayiprud@gmail.com'); ?>" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Email Secondaire</label>
                        <input type="email" name="email2" value="<?php echo htmlspecialchars($settings['email2'] ?? 'ciceseentreprise@gmail.com'); ?>" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="block text-gray-700 font-semibold mb-2">Adresse</label>
                    <textarea name="address" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($settings['address'] ?? 'Bujumbura-Rohero I-Avenu de l\'ONU N°3, Galerie d\'Innovation Bureau B1, BURUNDI.'); ?></textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Représentant Légal</label>
                        <input type="text" name="representative" value="<?php echo htmlspecialchars($settings['representative'] ?? 'NDAYIZAMBA Prudence'); ?>" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">NIF</label>
                        <input type="text" name="nif" value="<?php echo htmlspecialchars($settings['nif'] ?? '4000781700'); ?>" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Date d'autorisation</label>
                        <input type="text" name="authorization_date" value="<?php echo htmlspecialchars($settings['authorization_date'] ?? '2 janvier 2017'); ?>" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
            </div>
            
            <div class="flex justify-end">
                <button type="submit" name="submit" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
                    <i class="fas fa-save mr-2"></i>Enregistrer les Paramètres
                </button>
            </div>
        </form>
    </div>
</body>
</html>

