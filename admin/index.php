<?php
/**
 * SULOC Admin - Dashboard
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();

// Get statistics
$stats = [
    'new_requests' => $pdo->query("
        SELECT 
            (SELECT COUNT(*) FROM vehicle_requests WHERE status = 'new') +
            (SELECT COUNT(*) FROM visa_requests WHERE status = 'new') +
            (SELECT COUNT(*) FROM import_requests WHERE status = 'new') +
            (SELECT COUNT(*) FROM payment_requests WHERE status = 'new')
    ")->fetchColumn(),
    'active_vehicles' => $pdo->query("SELECT COUNT(*) FROM vehicles WHERE is_active = 1")->fetchColumn(),
    'pending_visa_requests' => $pdo->query("SELECT COUNT(*) FROM visa_requests WHERE status IN ('new', 'in_progress')")->fetchColumn(),
    'payment_services' => $pdo->query("SELECT COUNT(*) FROM payment_services WHERE is_active = 1")->fetchColumn(),
];

// Get recent submissions from all request tables
$recentSubmissions = $pdo->query("
    (SELECT 'vehicle' as type, client_name as name, client_email as email, created_at FROM vehicle_requests ORDER BY created_at DESC LIMIT 3)
    UNION ALL
    (SELECT 'visa' as type, client_name as name, client_email as email, created_at FROM visa_requests ORDER BY created_at DESC LIMIT 3)
    UNION ALL
    (SELECT 'import' as type, client_name as name, client_email as email, created_at FROM import_requests ORDER BY created_at DESC LIMIT 3)
    UNION ALL
    (SELECT 'payment' as type, client_name as name, NULL as email, created_at FROM payment_requests ORDER BY created_at DESC LIMIT 3)
    ORDER BY created_at DESC
    LIMIT 5
")->fetchAll();

// Global Freeze Alert
$frozenPayments = isModuleFrozen('payments');
$frozenVehicles = isModuleFrozen('vehicles');
$frozenLogistics = isModuleFrozen('logistics');
$frozenVisa = isModuleFrozen('visa');
$anyFrozen = ($frozenPayments || $frozenVehicles || $frozenLogistics || $frozenVisa) && ($_SESSION['admin_role'] ?? '') !== 'creator';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tableau de Bord - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --suloc-navy: #0a2342;
            --suloc-gold: #d4af37;
            --suloc-navy-light: #1a3a5c;
        }
        .bg-suloc-navy { background-color: var(--suloc-navy); }
        .text-suloc-gold { color: var(--suloc-gold); }
        .border-suloc-gold { border-color: var(--suloc-gold); }
    </style>
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>
    
    <div class="container mx-auto px-6 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-suloc-navy">Tableau de Bord</h1>
            <?php if ($anyFrozen): ?>
                <div class="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 animate-pulse border border-red-200">
                    <i class="fas fa-snowflake"></i> SYSTÈME PARTIELLEMENT GELÉ (LECTURE SEULE)
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-suloc-gold">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Nouvelles Demandes</p>
                        <p class="text-3xl font-bold text-suloc-navy"><?php echo $stats['new_requests']; ?></p>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <i class="fas fa-envelope text-suloc-gold text-xl"></i>
                    </div>
                </div>
                <a href="requests/" class="text-suloc-gold text-sm mt-2 inline-block hover:underline">
                    Voir <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Véhicules Actifs</p>
                        <p class="text-3xl font-bold text-blue-600"><?php echo $stats['active_vehicles']; ?></p>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <i class="fas fa-car text-blue-600 text-xl"></i>
                    </div>
                </div>
                <a href="vehicles.php" class="text-blue-600 text-sm mt-2 inline-block hover:underline">
                    Gérer <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Visas en Attente</p>
                        <p class="text-3xl font-bold text-green-600"><?php echo $stats['pending_visa_requests']; ?></p>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <i class="fas fa-passport text-green-600 text-xl"></i>
                    </div>
                </div>
                <a href="visa-services.php" class="text-green-600 text-sm mt-2 inline-block hover:underline">
                    Gérer <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Services de Paiement</p>
                        <p class="text-3xl font-bold text-orange-600"><?php echo $stats['payment_services']; ?></p>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <i class="fas fa-money-bill-wave text-orange-600 text-xl"></i>
                    </div>
                </div>
                <a href="payment-services.php" class="text-orange-600 text-sm mt-2 inline-block hover:underline">
                    Gérer <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-suloc-navy mb-4">Actions Rapides</h2>
                <div class="space-y-3">
                    <a href="<?php echo $frozenVehicles && $_SESSION['admin_role'] !== 'creator' ? '#' : 'vehicles.php?action=add'; ?>" class="block bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition <?php echo $frozenVehicles && $_SESSION['admin_role'] !== 'creator' ? 'opacity-50 cursor-not-allowed' : ''; ?>">
                        <i class="fas fa-plus mr-2"></i>Ajouter un Véhicule <?php if ($frozenVehicles && $_SESSION['admin_role'] !== 'creator') echo '(Gelé)'; ?>
                    </a>
                    <a href="<?php echo $frozenVisa && $_SESSION['admin_role'] !== 'creator' ? '#' : 'visa-services.php?action=add'; ?>" class="block bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition <?php echo $frozenVisa && $_SESSION['admin_role'] !== 'creator' ? 'opacity-50 cursor-not-allowed' : ''; ?>">
                        <i class="fas fa-plus mr-2"></i>Ajouter un Service Visa <?php if ($frozenVisa && $_SESSION['admin_role'] !== 'creator') echo '(Gelé)'; ?>
                    </a>
                    <a href="settings.php" class="block bg-suloc-navy text-white px-4 py-3 rounded-lg hover:bg-suloc-navy-light transition">
                        <i class="fas fa-cog mr-2"></i>Paramètres du Site
                    </a>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-suloc-navy mb-4">Demandes Récentes</h2>
                <?php if (empty($recentSubmissions)): ?>
                    <p class="text-gray-600">Aucune demande récente</p>
                <?php else: ?>
                    <div class="space-y-3">
                        <?php foreach ($recentSubmissions as $submission): ?>
                        <div class="border-l-4 border-suloc-gold pl-4 py-2">
                            <p class="font-semibold text-suloc-navy"><?php echo htmlspecialchars($submission['name']); ?></p>
                            <p class="text-sm text-gray-600"><?php echo htmlspecialchars($submission['email'] ?? 'N/A'); ?></p>
                            <p class="text-xs text-gray-500"><?php echo formatDate($submission['created_at']); ?> (<?php echo $submission['type']; ?>)</p>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <a href="requests/" class="text-suloc-gold text-sm mt-4 inline-block hover:underline">
                        Voir toutes les demandes <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</body>
</html>