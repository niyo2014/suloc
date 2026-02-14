<?php
/**
 * SULOC Admin - Visa Services Management
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
        $countryCode = sanitizeInput($_POST['country_code'] ?? '');
        $countryNameFr = sanitizeInput($_POST['country_name_fr'] ?? '');
        $countryNameEn = sanitizeInput($_POST['country_name_en'] ?? '');
        $flagIcon = sanitizeInput($_POST['flag_icon'] ?? '');
        $requirementsFr = $_POST['requirements_fr'] ?? '';
        $requirementsEn = $_POST['requirements_en'] ?? '';
        $documentsFr = $_POST['documents_needed_fr'] ?? '';
        $documentsEn = $_POST['documents_needed_en'] ?? '';
        $processingTime = sanitizeInput($_POST['processing_time'] ?? '');
        $serviceFee = $_POST['service_fee'] !== '' ? floatval($_POST['service_fee']) : null;
        $currency = sanitizeInput($_POST['currency'] ?? 'USD');
        $orderIndex = intval($_POST['order_index'] ?? 0);
        $isActive = isset($_POST['is_active']) ? 1 : 0;

        $required = [
            'Code pays' => $countryCode,
            'Nom (FR)' => $countryNameFr
        ];
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
                    $stmt = $pdo->prepare("INSERT INTO visa_services (country_code, country_name_fr, country_name_en, flag_icon, requirements_fr, requirements_en, documents_needed_fr, documents_needed_en, processing_time, service_fee, currency, is_active, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([$countryCode, $countryNameFr, $countryNameEn, $flagIcon, $requirementsFr, $requirementsEn, $documentsFr, $documentsEn, $processingTime, $serviceFee, $currency, $isActive, $orderIndex]);
                    $message = 'Service visa ajouté avec succès!';
                } else {
                    $stmt = $pdo->prepare("UPDATE visa_services SET country_code = ?, country_name_fr = ?, country_name_en = ?, flag_icon = ?, requirements_fr = ?, requirements_en = ?, documents_needed_fr = ?, documents_needed_en = ?, processing_time = ?, service_fee = ?, currency = ?, is_active = ?, order_index = ? WHERE id = ?");
                    $stmt->execute([$countryCode, $countryNameFr, $countryNameEn, $flagIcon, $requirementsFr, $requirementsEn, $documentsFr, $documentsEn, $processingTime, $serviceFee, $currency, $isActive, $orderIndex, $id]);
                    $message = 'Service visa modifié avec succès!';
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
            $stmt = $pdo->prepare('DELETE FROM visa_services WHERE id = ?');
            $stmt->execute([$id]);
            $message = 'Service visa supprimé avec succès!';
            $messageType = 'success';
        } catch (Exception $e) {
            $message = 'Erreur: ' . $e->getMessage();
            $messageType = 'error';
        }
    }
}

$visaServices = $pdo->query("SELECT * FROM visa_services ORDER BY order_index ASC, id DESC")->fetchAll();

$editService = null;
if (isset($_GET['edit'])) {
    $id = intval($_GET['edit']);
    $stmt = $pdo->prepare('SELECT * FROM visa_services WHERE id = ?');
    $stmt->execute([$id]);
    $editService = $stmt->fetch();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des Visas - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>

    <div class="container mx-auto px-6 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-blue-900">Gestion des Services Visa</h1>
            <a href="?action=add" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                <i class="fas fa-plus mr-2"></i>Ajouter un Service Visa
            </a>
        </div>

        <?php if ($message): ?>
            <div class="bg-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-100 border border-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-400 text-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-700 px-4 py-3 rounded mb-4">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <?php if ((isset($_GET['action']) && $_GET['action'] === 'add') || $editService): ?>
            <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 class="text-2xl font-bold text-blue-900 mb-6"><?php echo $editService ? 'Modifier' : 'Ajouter'; ?> un Service Visa</h2>
                <form method="POST" action="">
                    <input type="hidden" name="action" value="<?php echo $editService ? 'edit' : 'add'; ?>">
                    <?php if ($editService): ?><input type="hidden" name="id" value="<?php echo $editService['id']; ?>"><?php endif; ?>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Code Pays *</label>
                            <input type="text" name="country_code" required value="<?php echo htmlspecialchars($editService['country_code'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Nom Pays (FR) *</label>
                            <input type="text" name="country_name_fr" required value="<?php echo htmlspecialchars($editService['country_name_fr'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Nom Pays (EN)</label>
                            <input type="text" name="country_name_en" value="<?php echo htmlspecialchars($editService['country_name_en'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Icône Drapeau (classe)</label>
                            <input type="text" name="flag_icon" value="<?php echo htmlspecialchars($editService['flag_icon'] ?? ''); ?>" placeholder="fi fi-fr" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Délai de traitement</label>
                            <input type="text" name="processing_time" value="<?php echo htmlspecialchars($editService['processing_time'] ?? ''); ?>" placeholder="7-14 jours" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Frais de service</label>
                            <input type="number" step="0.01" name="service_fee" value="<?php echo htmlspecialchars($editService['service_fee'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Devise</label>
                            <input type="text" name="currency" value="<?php echo htmlspecialchars($editService['currency'] ?? 'USD'); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Ordre d'affichage</label>
                            <input type="number" name="order_index" value="<?php echo htmlspecialchars($editService['order_index'] ?? 0); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Exigences (FR)</label>
                            <textarea name="requirements_fr" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editService['requirements_fr'] ?? ''); ?></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Exigences (EN)</label>
                            <textarea name="requirements_en" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editService['requirements_en'] ?? ''); ?></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Documents requis (FR)</label>
                            <textarea name="documents_needed_fr" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editService['documents_needed_fr'] ?? ''); ?></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-semibold mb-2">Documents requis (EN)</label>
                            <textarea name="documents_needed_en" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editService['documents_needed_en'] ?? ''); ?></textarea>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="flex items-center">
                            <input type="checkbox" name="is_active" <?php echo ($editService['is_active'] ?? 1) ? 'checked' : ''; ?> class="mr-2">
                            <span>Service actif</span>
                        </label>
                    </div>

                    <div class="flex space-x-4">
                        <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                            <i class="fas fa-save mr-2"></i>Enregistrer
                        </button>
                        <a href="visa-services.php" class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition">Annuler</a>
                    </div>
                </form>
            </div>
        <?php endif; ?>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <table class="w-full">
                <thead class="bg-blue-900 text-white">
                    <tr>
                        <th class="px-6 py-4 text-left">Pays</th>
                        <th class="px-6 py-4 text-left">Code</th>
                        <th class="px-6 py-4 text-left">Délai</th>
                        <th class="px-6 py-4 text-center">Statut</th>
                        <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($visaServices)): ?>
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-gray-600">Aucun service visa trouvé</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($visaServices as $service): ?>
                            <tr class="border-b border-gray-200 hover:bg-gray-50">
                                <td class="px-6 py-4 font-semibold"><?php echo htmlspecialchars($service['country_name_fr']); ?></td>
                                <td class="px-6 py-4"><?php echo htmlspecialchars($service['country_code']); ?></td>
                                <td class="px-6 py-4"><?php echo htmlspecialchars($service['processing_time'] ?? '-'); ?></td>
                                <td class="px-6 py-4 text-center">
                                    <span class="px-3 py-1 rounded-full text-sm <?php echo $service['is_active'] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'; ?>"><?php echo $service['is_active'] ? 'Actif' : 'Inactif'; ?></span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <a href="?edit=<?php echo $service['id']; ?>" class="text-blue-600 hover:text-blue-800 mr-3">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <form method="POST" action="" class="inline" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer ce service?');">
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
