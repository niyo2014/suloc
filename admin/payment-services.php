<?php
/**
 * SULOC Admin - Payment Services Management
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();
$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'add' || $action === 'edit') {
        $id = $_POST['id'] ?? null;
        $operatorName = sanitizeInput($_POST['operator_name'] ?? '');
        $operatorLogo = sanitizeInput($_POST['operator_logo'] ?? '');
        $descriptionFr = $_POST['description_fr'] ?? '';
        $descriptionEn = $_POST['description_en'] ?? '';
        $limitsFr = $_POST['limits_info_fr'] ?? '';
        $limitsEn = $_POST['limits_info_en'] ?? '';
        $guideFr = $_POST['guide_content_fr'] ?? '';
        $guideEn = $_POST['guide_content_en'] ?? '';
        $dailyLimit = $_POST['daily_limit'] !== '' ? floatval($_POST['daily_limit']) : null;
        $monthlyLimit = $_POST['monthly_limit'] !== '' ? floatval($_POST['monthly_limit']) : null;
        $exchangeRate = $_POST['exchange_rate'] !== '' ? floatval($_POST['exchange_rate']) : null;
        $currencyPair = sanitizeInput($_POST['currency_pair'] ?? '');
        $orderIndex = intval($_POST['order_index'] ?? 0);
        $isActive = isset($_POST['is_active']) ? 1 : 0;

        if (isset($_FILES['operator_logo_file']) && $_FILES['operator_logo_file']['error'] === UPLOAD_ERR_OK) {
            $uploadType = 'services';
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (in_array($_FILES['operator_logo_file']['type'], $allowedTypes) && $_FILES['operator_logo_file']['size'] <= 5 * 1024 * 1024) {
                $uploadDir = UPLOAD_PATH . '/' . $uploadType . '/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                $extension = pathinfo($_FILES['operator_logo_file']['name'], PATHINFO_EXTENSION);
                $filename = uniqid('operator_', true) . '.' . $extension;
                $filepath = $uploadDir . $filename;
                if (move_uploaded_file($_FILES['operator_logo_file']['tmp_name'], $filepath)) {
                    $operatorLogo = UPLOAD_URL . '/' . $uploadType . '/' . $filename;
                }
            }
        }

        $required = ['Opérateur' => $operatorName];
        $missing = [];
        foreach ($required as $label => $value) {
            if ($value === '') {
                $missing[] = $label;
            }
        }

        if ($missing) {
            $message = 'Veuillez remplir les champs obligatoires: ' . implode(', ', $missing);
            $messageType = 'error';
        } else {
            try {
                if ($action === 'add') {
                    $stmt = $pdo->prepare("INSERT INTO payment_services (operator_name, operator_logo, description_fr, description_en, limits_info_fr, limits_info_en, guide_content_fr, guide_content_en, daily_limit, monthly_limit, exchange_rate, currency_pair, is_active, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([$operatorName, $operatorLogo, $descriptionFr, $descriptionEn, $limitsFr, $limitsEn, $guideFr, $guideEn, $dailyLimit, $monthlyLimit, $exchangeRate, $currencyPair, $isActive, $orderIndex]);
                    $message = 'Opérateur ajouté avec succès!';
                } else {
                    $stmt = $pdo->prepare("UPDATE payment_services SET operator_name = ?, operator_logo = ?, description_fr = ?, description_en = ?, limits_info_fr = ?, limits_info_en = ?, guide_content_fr = ?, guide_content_en = ?, daily_limit = ?, monthly_limit = ?, exchange_rate = ?, currency_pair = ?, is_active = ?, order_index = ? WHERE id = ?");
                    $stmt->execute([$operatorName, $operatorLogo, $descriptionFr, $descriptionEn, $limitsFr, $limitsEn, $guideFr, $guideEn, $dailyLimit, $monthlyLimit, $exchangeRate, $currencyPair, $isActive, $orderIndex, $id]);
                    $message = 'Opérateur modifié avec succès!';
                }
                $messageType = 'success';
            } catch (Exception $e) {
                $message = 'Erreur: ' . $e->getMessage();
                $messageType = 'error';
            }
        }
    } elseif ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        try {
            $stmt = $pdo->prepare('DELETE FROM payment_services WHERE id = ?');
            $stmt->execute([$id]);
            $message = 'Opérateur supprimé avec succès!';
            $messageType = 'success';
        } catch (Exception $e) {
            $message = 'Erreur: ' . $e->getMessage();
            $messageType = 'error';
        }
    } elseif ($action === 'update_rates') {
        $rateBIF = sanitizeInput($_POST['daily_rate_bif'] ?? '');
        $rateCDF = sanitizeInput($_POST['daily_rate_cdf'] ?? '');
        $feePercent = sanitizeInput($_POST['transfer_fee_percentage'] ?? '');
        
        try {
            $stmt = $pdo->prepare("UPDATE site_settings SET setting_value = ? WHERE setting_key = 'daily_rate_bif'");
            $stmt->execute([$rateBIF]);
            $stmt = $pdo->prepare("UPDATE site_settings SET setting_value = ? WHERE setting_key = 'daily_rate_cdf'");
            $stmt->execute([$rateCDF]);
            $stmt = $pdo->prepare("UPDATE site_settings SET setting_value = ? WHERE setting_key = 'transfer_fee_percentage'");
            $stmt->execute([$feePercent]);
            $message = 'Configurations (Taux et Frais) mises à jour avec succès!';
            $messageType = 'success';
        } catch (Exception $e) {
            $message = 'Erreur lors de la mise à jour: ' . $e->getMessage();
            $messageType = 'error';
        }
    }
}

// Get current rates and fees
$stmt = $pdo->prepare("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('daily_rate_bif', 'daily_rate_cdf', 'transfer_fee_percentage')");
$stmt->execute();
$settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
$rateBIF = $settings['daily_rate_bif'] ?? '0';
$rateCDF = $settings['daily_rate_cdf'] ?? '0';
$feePercent = $settings['transfer_fee_percentage'] ?? '5.97';

$paymentServices = $pdo->query("SELECT * FROM payment_services ORDER BY order_index ASC, id DESC")->fetchAll();

$editService = null;
if (isset($_GET['edit'])) {
    $id = intval($_GET['edit']);
    $stmt = $pdo->prepare('SELECT * FROM payment_services WHERE id = ?');
    $stmt->execute([$id]);
    $editService = $stmt->fetch();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion Paiements - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>

    <div class="container mx-auto px-6 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-blue-900">Gestion des Opérateurs de Paiement</h1>
            <a href="?action=add" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                <i class="fas fa-plus mr-2"></i>Ajouter un Opérateur
            </a>
        </div>

        <!-- Global Rate Control Widget -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-yellow-500">
            <h2 class="text-xl font-bold text-blue-900 mb-4"><i class="fas fa-chart-line mr-2"></i>Contrôle Global des Taux (SULOC Daily Rate)</h2>
            <form method="POST" action="" class="flex flex-wrap items-end gap-4">
                <input type="hidden" name="action" value="update_rates">
                <div>
                    <label class="block text-sm font-semibold text-gray-600 mb-1">USD vers BIF (Burundi)</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">1$ =</span>
                        <input type="text" name="daily_rate_bif" value="<?php echo htmlspecialchars($rateBIF); ?>" class="pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-40">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-600 mb-1">USD vers CDF (Congo)</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">1$ =</span>
                        <input type="text" name="daily_rate_cdf" value="<?php echo htmlspecialchars($rateCDF); ?>" class="pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-40">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-600 mb-1">Frais de Transfert (%)</label>
                    <div class="relative">
                        <input type="text" name="transfer_fee_percentage" value="<?php echo htmlspecialchars($feePercent); ?>" placeholder="5.97" class="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-32">
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                    </div>
                </div>
                <button type="submit" class="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition shadow-md">
                    <i class="fas fa-sync-alt mr-2"></i>Mettre à jour
                </button>
            </form>
        </div>

        <?php if ($message): ?>
            <div class="bg-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-100 border border-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-400 text-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-700 px-4 py-3 rounded mb-4">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <?php if ((isset($_GET['action']) && $_GET['action'] === 'add') || $editService): ?>
            <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-blue-900 mb-6"><?php echo $editService ? 'Modifier' : 'Ajouter'; ?> un Opérateur</h2>
                <form method="POST" action="" enctype="multipart/form-data">
                    <input type="hidden" name="action" value="<?php echo $editService ? 'edit' : 'add'; ?>">
                    <?php if ($editService): ?><input type="hidden" name="id" value="<?php echo $editService['id']; ?>"><?php endif; ?>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Nom opérateur *</label>
                            <input type="text" name="operator_name" required value="<?php echo htmlspecialchars($editService['operator_name'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Logo opérateur</label>
                            <div class="space-y-3">
                                <input type="file" name="operator_logo_file" accept="image/*" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <input type="url" name="operator_logo" value="<?php echo htmlspecialchars($editService['operator_logo'] ?? ''); ?>" placeholder="https://example.com/logo.png" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <?php if (!empty($editService['operator_logo'])): ?>
                                    <img src="<?php echo htmlspecialchars($editService['operator_logo']); ?>" alt="Logo" class="h-16 rounded">
                                <?php endif; ?>
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Limite journalière</label>
                            <input type="number" step="0.01" name="daily_limit" value="<?php echo htmlspecialchars($editService['daily_limit'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Limite mensuelle</label>
                            <input type="number" step="0.01" name="monthly_limit" value="<?php echo htmlspecialchars($editService['monthly_limit'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Taux de change</label>
                            <input type="number" step="0.0001" name="exchange_rate" value="<?php echo htmlspecialchars($editService['exchange_rate'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Paire de devises</label>
                            <input type="text" name="currency_pair" value="<?php echo htmlspecialchars($editService['currency_pair'] ?? ''); ?>" placeholder="USD/BIF" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Ordre d'affichage</label>
                            <input type="number" name="order_index" value="<?php echo htmlspecialchars($editService['order_index'] ?? 0); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Description (FR)</label>
                            <textarea name="description_fr" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editService['description_fr'] ?? ''); ?></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Description (EN)</label>
                            <textarea name="description_en" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editService['description_en'] ?? ''); ?></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Limites (FR)</label>
                            <textarea name="limits_info_fr" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editService['limits_info_fr'] ?? ''); ?></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Limites (EN)</label>
                            <textarea name="limits_info_en" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editService['limits_info_en'] ?? ''); ?></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Guide d'utilisation (FR)</label>
                            <textarea name="guide_content_fr" rows="6" placeholder="Instructions HTML ou texte..." class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editService['guide_content_fr'] ?? ''); ?></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Guide d'utilisation (EN)</label>
                            <textarea name="guide_content_en" rows="6" placeholder="HTML or text instructions..." class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editService['guide_content_en'] ?? ''); ?></textarea>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="flex items-center">
                            <input type="checkbox" name="is_active" <?php echo ($editService['is_active'] ?? 1) ? 'checked' : ''; ?> class="mr-2">
                            <span>Opérateur actif</span>
                        </label>
                    </div>

                    <div class="flex space-x-4">
                        <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                            <i class="fas fa-save mr-2"></i>Enregistrer
                        </button>
                        <a href="payment-services.php" class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition">Annuler</a>
                    </div>
                </form>
            </div>
        <?php endif; ?>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <table class="w-full">
                <thead class="bg-blue-900 text-white">
                    <tr>
                        <th class="px-6 py-4 text-left">Opérateur</th>
                        <th class="px-6 py-4 text-left">Taux</th>
                        <th class="px-6 py-4 text-center">Statut</th>
                        <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($paymentServices)): ?>
                        <tr>
                            <td colspan="4" class="px-6 py-8 text-center text-gray-600">Aucun opérateur trouvé</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($paymentServices as $service): ?>
                            <tr class="border-b border-gray-200 hover:bg-gray-50">
                                <td class="px-6 py-4 font-semibold"><?php echo htmlspecialchars($service['operator_name']); ?></td>
                                <td class="px-6 py-4"><?php echo htmlspecialchars($service['exchange_rate'] ?? '-'); ?></td>
                                <td class="px-6 py-4 text-center">
                                    <span class="px-3 py-1 rounded-full text-sm <?php echo $service['is_active'] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'; ?>"><?php echo $service['is_active'] ? 'Actif' : 'Inactif'; ?></span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <a href="?edit=<?php echo $service['id']; ?>" class="text-blue-600 hover:text-blue-800 mr-3">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <form method="POST" action="" class="inline" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer cet opérateur?');">
                                        <input type="hidden" name="action" value="delete">
                                        <input type="hidden" name="id" value="<?php echo $service['id']; ?>">
                                        <button type="submit" class="text-red-600 hover:text-red-800">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
