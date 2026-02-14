<?php
/**
 * SULOC Admin - Visa Assistance Requests Listing
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();

$isFrozen = isModuleFrozen('visa') && ($_SESSION['admin_role'] ?? '') !== 'creator';
$frozenBadge = $isFrozen ? '<span class="ml-4 px-4 py-2 bg-red-100 text-red-600 rounded-xl text-xs font-black uppercase inline-flex items-center gap-2 animate-pulse"><i class="fas fa-snowflake"></i> Système Gelé</span>' : '';

// Status Mapping
$statuses = [
    'received' => ['label' => 'Reçue', 'class' => 'bg-gray-100 text-gray-800'],
    'analyzing' => ['label' => 'Analyse', 'class' => 'bg-blue-100 text-blue-800'],
    'docs_incomplete' => ['label' => 'Incomplet', 'class' => 'bg-orange-100 text-orange-800'],
    'docs_complete' => ['label' => 'Complet', 'class' => 'bg-indigo-100 text-indigo-800'],
    'submitted' => ['label' => 'Déposé', 'class' => 'bg-purple-100 text-purple-800'],
    'pending_response' => ['label' => 'En attente', 'class' => 'bg-yellow-100 text-yellow-800'],
    'accepted' => ['label' => 'Accepté', 'class' => 'bg-green-100 text-green-800'],
    'rejected' => ['label' => 'Refusé', 'class' => 'bg-red-100 text-red-800'],
    'closed' => ['label' => 'Clôturé', 'class' => 'bg-gray-400 text-white']
];

// Filtering
$filter = sanitizeInput($_GET['status'] ?? 'all');
$where = $filter === 'all' ? '' : "WHERE status = '$filter'";

$query = "SELECT * FROM visa_assistance_requests $where ORDER BY created_at DESC";
$requests = $pdo->query($query)->fetchAll();

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demandes Assistance Visa - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>
    
    <div class="container mx-auto px-6 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-blue-900 flex items-center">Demandes Assistance Visa <?php echo $frozenBadge; ?></h1>
            <div class="flex flex-wrap gap-2">
                <a href="?status=all" class="px-4 py-2 rounded-lg text-sm transition <?php echo $filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'; ?>">Tous</a>
                <?php foreach ($statuses as $key => $data): ?>
                    <a href="?status=<?php echo $key; ?>" class="px-4 py-2 rounded-lg text-sm transition <?php echo $filter === $key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'; ?>">
                        <?php echo $data['label']; ?>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-blue-900 text-white">
                        <tr>
                            <th class="px-6 py-4 text-left font-semibold">Client</th>
                            <th class="px-6 py-4 text-left font-semibold">Trajet / Type</th>
                            <th class="px-6 py-4 text-center font-semibold">Statut</th>
                            <th class="px-6 py-4 text-left font-semibold">Date Soumission</th>
                            <th class="px-6 py-4 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <?php if (empty($requests)): ?>
                            <tr>
                                <td colspan="5" class="px-6 py-12 text-center text-gray-500 italic">Aucune demande trouvée.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($requests as $request): ?>
                                <tr class="hover:bg-gray-50 transition">
                                    <td class="px-6 py-4">
                                        <div class="font-bold text-blue-900"><?php echo htmlspecialchars($request['full_name']); ?></div>
                                        <div class="text-xs text-gray-500 mt-1"><?php echo htmlspecialchars($request['email']); ?></div>
                                        <div class="text-xs text-blue-600"><?php echo htmlspecialchars($request['phone']); ?></div>
                                    </td>
                                    <td class="px-6 py-4 text-sm">
                                        <div class="flex items-center space-x-2">
                                            <span><?php echo htmlspecialchars($request['origin_country']); ?></span>
                                            <i class="fas fa-long-arrow-alt-right text-gray-400"></i>
                                            <span class="font-semibold"><?php echo htmlspecialchars($request['destination_country']); ?></span>
                                        </div>
                                        <div class="text-xs text-gray-500 mt-1">Visa <?php echo ucfirst($request['visa_type']); ?></div>
                                    </td>
                                    <td class="px-6 py-4 text-center">
                                        <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider <?php echo $statuses[$request['status']]['class']; ?>">
                                            <?php echo $statuses[$request['status']]['label']; ?>
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-600">
                                        <?php echo date('d/m/Y H:i', strtotime($request['created_at'])); ?>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <div class="flex justify-end space-x-3">
                                            <a href="visa-request-detail.php?id=<?php echo $request['id']; ?>" class="text-blue-600 hover:text-blue-800 transition" title="<?php echo $isFrozen ? 'Consulter' : 'Gérer'; ?>">
                                                <i class="fas fa-<?php echo $isFrozen ? 'eye' : 'edit'; ?> text-lg"></i>
                                            </a>
                                            <a href="https://wa.me/<?php echo preg_replace('/[^0-9]/', '', $request['phone']); ?>" target="_blank" class="text-green-600 hover:text-green-800 transition" title="WhatsApp">
                                                <i class="fab fa-whatsapp text-lg"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
