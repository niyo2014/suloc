<?php
/**
 * SULOC Admin - System Status & Kill-Switch
 * RESTRICTED: Creator Only
 */
require_once __DIR__ . '/../config/config.php';
requireRole('creator');

$pdo = getDBConnection();
$message = '';
$messageType = '';

// Fetch current status
$stmt = $pdo->query("SELECT * FROM system_status WHERE id = 1");
$status = $stmt->fetch();

if (!$status) {
    // initialize if missing
    $pdo->exec("INSERT INTO system_status (id, maintenance_mode) VALUES (1, 0)");
    $status = ['maintenance_mode' => 0, 'frozen_modules' => json_encode([])];
}

$frozenModules = $status['frozen_modules'] ? json_decode($status['frozen_modules'], true) : [];

// Handle Updates
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $maintenance = isset($_POST['maintenance_mode']) ? 1 : 0;
    
    // Process Checkboxes for Frozen Modules
    $modules = ['payments', 'logistics', 'visa', 'vehicles'];
    $newFrozen = [];
    foreach ($modules as $mod) {
        if (isset($_POST['freeze_' . $mod])) {
            $newFrozen[] = $mod;
        }
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE system_status SET maintenance_mode = ?, frozen_modules = ? WHERE id = 1");
        $stmt->execute([$maintenance, json_encode($newFrozen)]);
        
        // Log this critical action
        $logUserId = ($_SESSION['admin_id'] == 999999) ? null : $_SESSION['admin_id'];
        $logStmt = $pdo->prepare("INSERT INTO activity_logs (user_id, action_type, details, ip_address) VALUES (?, 'SYSTEM_FREEZE', ?, ?)");
        $details = "Maintenance: $maintenance, Frozen: " . implode(', ', $newFrozen);
        $logStmt->execute([$logUserId, $details, $_SERVER['REMOTE_ADDR']]);
        
        $message = "Statut système mis à jour. Les changements sont immédiats.";
        $messageType = 'success';
        
        // Refresh data
        $status['maintenance_mode'] = $maintenance;
        $frozenModules = $newFrozen;
    } catch (Exception $e) {
        $message = "Erreur critique: " . $e->getMessage();
        $messageType = 'error';
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SULOC - Creator Command Center</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-900 text-white">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>

    <div class="container mx-auto px-6 py-12">
        <div class="flex items-center justify-between mb-12">
            <div>
                <h1 class="text-4xl font-black text-red-500 tracking-tighter">
                    <i class="fas fa-biohazard mr-4"></i>SYSTEM COMMAND CENTER
                </h1>
                <p class="text-gray-400 mt-2 text-lg">Zone de Contrôle Absolu - Creator Only</p>
            </div>
            <div class="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
                <div class="text-red-400 font-mono text-sm">SECURITY CLEARANCE: LEVEL 0</div>
                <div class="text-white font-bold"><?php echo $_SERVER['REMOTE_ADDR']; ?></div>
            </div>
        </div>

        <?php if ($message): ?>
            <div class="bg-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-900/50 border border-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-500 text-white px-6 py-4 rounded-lg mb-8 text-xl font-bold shadow-lg backdrop-blur">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <form method="POST" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <!-- Global Kill Switch -->
            <div class="bg-gray-800 rounded-2xl p-8 border-2 border-red-600 shadow-2xl relative overflow-hidden group">
                <div class="absolute inset-0 bg-red-600/5 group-hover:bg-red-600/10 transition"></div>
                
                <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
                    <i class="fas fa-power-off text-red-500 mr-3"></i>Arrêt d'Urgence Global
                </h2>
                <p class="text-gray-400 mb-8">
                    Activer le "Mode Maintenance" rendra tout le site (Front & Back) inaccessible pour les utilisateurs et admins. Seul le Creator pourra se connecter.
                </p>
                
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="maintenance_mode" class="sr-only peer" <?php echo $status['maintenance_mode'] ? 'checked' : ''; ?>>
                    <div class="w-14 h-7 bg-gray-700 peer-focus:outline-none ring-4 ring-transparent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                    <span class="ml-4 text-xl font-bold text-white">Activer Maintenance Mode</span>
                </label>
            </div>

            <!-- Module Freeze -->
            <div class="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
                <h2 class="text-2xl font-bold text-white mb-6 flex items-center">
                    <i class="fas fa-snowflake text-blue-400 mr-3"></i>Verrouillage Modulaire (Freeze)
                </h2>
                <p class="text-gray-400 mb-8">
                    Geler des modules spécifiques empêche toute écriture (INSERT/UPDATE) par les admins, mais conserve la lecture seule.
                </p>
                
                <div class="space-y-4">
                    <label class="flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                        <input type="checkbox" name="freeze_payments" <?php echo in_array('payments', $frozenModules) ? 'checked' : ''; ?> class="w-6 h-6 text-red-600 rounded focus:ring-red-500 bg-gray-900 border-gray-600">
                        <span class="ml-4 text-lg font-bold">Système de Paiements</span>
                        <i class="fas fa-money-bill-wave ml-auto text-gray-500"></i>
                    </label>
                    
                    <label class="flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                        <input type="checkbox" name="freeze_logistics" <?php echo in_array('logistics', $frozenModules) ? 'checked' : ''; ?> class="w-6 h-6 text-red-600 rounded focus:ring-red-500 bg-gray-900 border-gray-600">
                        <span class="ml-4 text-lg font-bold">Logistique & Suivi</span>
                        <i class="fas fa-truck ml-auto text-gray-500"></i>
                    </label>

                    <label class="flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                        <input type="checkbox" name="freeze_visa" <?php echo in_array('visa', $frozenModules) ? 'checked' : ''; ?> class="w-6 h-6 text-red-600 rounded focus:ring-red-500 bg-gray-900 border-gray-600">
                        <span class="ml-4 text-lg font-bold">Demandes de Visa</span>
                        <i class="fas fa-passport ml-auto text-gray-500"></i>
                    </label>

                    <label class="flex items-center p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                        <input type="checkbox" name="freeze_vehicles" <?php echo in_array('vehicles', $frozenModules) ? 'checked' : ''; ?> class="w-6 h-6 text-red-600 rounded focus:ring-red-500 bg-gray-900 border-gray-600">
                        <span class="ml-4 text-lg font-bold">Véhicules</span>
                        <i class="fas fa-car ml-auto text-gray-500"></i>
                    </label>
                </div>
            </div>
            
            <div class="lg:col-span-2">
                <button type="submit" class="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black py-6 rounded-2xl shadow-lg transform hover:scale-[1.01] transition text-2xl tracking-widest uppercase border border-red-500/50">
                    <i class="fas fa-check-circle mr-3"></i>Appliquer les Protocoles de Sécurité
                </button>
            </div>

        </form>
    </div>
</body>
</html>
