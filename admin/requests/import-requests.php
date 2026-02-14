<?php
/**
 * SULOC Admin - Import Command Center
 */
require_once __DIR__ . '/../../config/config.php';
requireLogin();

$pdo = getDBConnection();

$isFrozen = isModuleFrozen('logistics') && ($_SESSION['admin_role'] ?? '') !== 'creator';
$frozenBadge = $isFrozen ? '<span class="ml-4 px-4 py-2 bg-red-100 text-red-600 rounded-xl text-xs font-black uppercase inline-flex items-center gap-2 animate-pulse"><i class="fas fa-snowflake"></i> Système Gelé</span>' : '';

// Handle Status/Note Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_request'])) {
    // SECURITY CHECK: Module Freeze
    if (isModuleFrozen('logistics') && $_SESSION['admin_role'] !== 'creator') {
        $error = "ERREUR : Le module Logistique est actuellement GELÉ. Aucune modification (statut, notes) n'est permise.";
    } else {
        $requestId = $_POST['request_id'];
    $status = $_POST['status'];
    $adminNotes = $_POST['admin_notes'];
    
    try {
        $stmt = $pdo->prepare("UPDATE import_requests SET status = ?, admin_notes = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$status, $adminNotes, $requestId]);
        $success = "Demande #$requestId mise à jour.";
    } catch (Exception $e) {
        $error = "Erreur: " . $e->getMessage();
    }
    } // End freeze check
}

// Get filter parameters
$date_from = $_GET['date_from'] ?? '';
$date_to = $_GET['date_to'] ?? '';
$port = $_GET['port'] ?? 'all';
$req_status = $_GET['status'] ?? 'all';
$search = $_GET['search'] ?? '';

// Build Query
$where = ["1=1"];
$params = [];

if (!empty($date_from)) {
    $where[] = "DATE(created_at) >= ?";
    $params[] = $date_from;
}
if (!empty($date_to)) {
    $where[] = "DATE(created_at) <= ?";
    $params[] = $date_to;
}
if ($port !== 'all') {
    $where[] = "transit_port = ?";
    $params[] = $port;
}
if ($req_status !== 'all') {
    $where[] = "status = ?";
    $params[] = $req_status;
}
if (!empty($search)) {
    $where[] = "(client_name LIKE ? OR client_phone LIKE ? OR commodity_type LIKE ? OR cargo_description LIKE ?)";
    $searchTerm = "%$search%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $params[] = $searchTerm;
}

$whereClause = implode(' AND ', $where);

// Fetch Summary Stats
$stats = [
    'total' => $pdo->query("SELECT COUNT(*) FROM import_requests")->fetchColumn(),
    'mombasa' => $pdo->query("SELECT COUNT(*) FROM import_requests WHERE transit_port = 'Mombasa'")->fetchColumn(),
    'dar' => $pdo->query("SELECT COUNT(*) FROM import_requests WHERE transit_port = 'Dar es Salaam'")->fetchColumn(),
    'new' => $pdo->query("SELECT COUNT(*) FROM import_requests WHERE status = 'new'")->fetchColumn(),
    'in_transit' => $pdo->query("SELECT COUNT(*) FROM import_requests WHERE status = 'in_transit'")->fetchColumn(),
];

// Fetch Requests
$requests = [];
try {
    $stmt = $pdo->prepare("SELECT * FROM import_requests WHERE $whereClause ORDER BY created_at DESC");
    $stmt->execute($params);
    $requests = $stmt->fetchAll();
} catch (Exception $e) {
    $error = "Erreur: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="fr" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Centre Logistique - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --suloc-navy: #0a2342;
            --suloc-gold: #d4af37;
        }
        .bg-suloc-navy { background-color: var(--suloc-navy); }
        .text-suloc-navy { color: var(--suloc-navy); }
        .text-suloc-gold { color: var(--suloc-gold); }
        .border-suloc-gold { border-color: var(--suloc-gold); }
        .stat-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    </style>
</head>
<body class="bg-gray-100 text-gray-900 font-sans custom-scrollbar">
    <?php include __DIR__ . '/../includes/admin-header.php'; ?>

<div class="container mx-auto px-6 py-8">
    <!-- Header & Info Cards -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 class="text-3xl font-bold text-suloc-navy flex items-center">Centre de Commande Logistique <?php echo $frozenBadge; ?></h1>
            <p class="text-gray-600 mt-1">Gérez et suivez les importations en temps réel</p>
        </div>
        <div class="flex gap-3">
            <div class="relative group">
                <button class="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition flex items-center shadow-lg shadow-green-600/20">
                    <i class="fas fa-file-export mr-2"></i> Exporter
                    <i class="fas fa-chevron-down ml-2 text-xs"></i>
                </button>
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 hidden group-hover:block z-50">
                    <a href="export.php?type=import&format=csv&<?php echo http_build_query($_GET); ?>" class="block px-4 py-3 hover:bg-gray-50 text-gray-700 border-b border-gray-100">
                        <i class="fas fa-file-csv text-green-600 mr-2"></i> Format CSV
                    </a>
                    <a href="export.php?type=import&format=excel&<?php echo http_build_query($_GET); ?>" class="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                        <i class="fas fa-file-excel text-green-600 mr-2"></i> Format Excel
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 stat-card">
            <p class="text-gray-500 text-xs font-bold uppercase mb-2">Total Demandes</p>
            <p class="text-2xl font-black text-suloc-navy"><?php echo $stats['total']; ?></p>
        </div>
        <div class="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 stat-card">
            <p class="text-blue-600 text-xs font-bold uppercase mb-2">Corridor Mombasa</p>
            <p class="text-2xl font-black text-blue-900"><?php echo $stats['mombasa']; ?></p>
        </div>
        <div class="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100 stat-card">
            <p class="text-green-600 text-xs font-bold uppercase mb-2">Corridor Dar</p>
            <p class="text-2xl font-black text-green-900"><?php echo $stats['dar']; ?></p>
        </div>
        <div class="bg-orange-50 p-6 rounded-2xl shadow-sm border border-orange-100 stat-card">
            <p class="text-orange-600 text-xs font-bold uppercase mb-2">Nouvelles</p>
            <p class="text-2xl font-black text-orange-900"><?php echo $stats['new']; ?></p>
        </div>
        <div class="bg-indigo-50 p-6 rounded-2xl shadow-sm border border-indigo-100 stat-card">
            <p class="text-indigo-600 text-xs font-bold uppercase mb-2">En Transit</p>
            <p class="text-2xl font-black text-indigo-900"><?php echo $stats['in_transit']; ?></p>
        </div>
    </div>

    <!-- Advanced Filter Bar -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <form method="GET" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            <div class="lg:col-span-1">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Du (Date)</label>
                <input type="date" name="date_from" value="<?php echo $date_from; ?>" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-suloc-gold">
            </div>
            <div class="lg:col-span-1">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Au (Date)</label>
                <input type="date" name="date_to" value="<?php echo $date_to; ?>" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-suloc-gold">
            </div>
            <div class="lg:col-span-1">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Port</label>
                <select name="port" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-suloc-gold">
                    <option value="all">Tous les ports</option>
                    <option value="Mombasa" <?php echo $port === 'Mombasa' ? 'selected' : ''; ?>>Mombasa</option>
                    <option value="Dar es Salaam" <?php echo $port === 'Dar es Salaam' ? 'selected' : ''; ?>>Dar es Salaam</option>
                </select>
            </div>
            <div class="lg:col-span-1">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Statut</label>
                <select name="status" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-suloc-gold">
                    <option value="all">Tous les statuts</option>
                    <option value="new" <?php echo $req_status === 'new' ? 'selected' : ''; ?>>Nouveau</option>
                    <option value="quote_sent" <?php echo $req_status === 'quote_sent' ? 'selected' : ''; ?>>Devis Envoyé</option>
                    <option value="in_transit" <?php echo $req_status === 'in_transit' ? 'selected' : ''; ?>>En Transit</option>
                    <option value="completed" <?php echo $req_status === 'completed' ? 'selected' : ''; ?>>Livré</option>
                </select>
            </div>
            <div class="lg:col-span-1">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Rechercher</label>
                <input type="text" name="search" value="<?php echo htmlspecialchars($search); ?>" placeholder="Nom, Cargo..." class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-suloc-gold">
            </div>
            <div class="lg:col-span-1 flex gap-2">
                <button type="submit" class="flex-1 bg-suloc-navy text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition font-bold">
                    <i class="fas fa-filter"></i>
                </button>
                <a href="import-requests.php" class="bg-gray-100 text-gray-500 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition">
                    <i class="fas fa-undo"></i>
                </a>
            </div>
        </form>
    </div>

    <?php if (isset($success)): ?>
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center shadow-sm">
            <span><i class="fas fa-check-circle mr-2"></i><?php echo $success; ?></span>
            <button onclick="this.parentElement.remove()" class="text-green-700 opacity-50"><i class="fas fa-times"></i></button>
        </div>
    <?php endif; ?>

    <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table class="w-full text-left">
            <thead class="bg-gray-50 border-bottom border-gray-100">
                <tr>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Route / Port</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cargo / Size</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                <?php foreach ($requests as $req): ?>
                    <?php
                    $portColor = ($req['transit_port'] === 'Mombasa') ? 'bg-blue-100 text-blue-800' : 
                                (($req['transit_port'] === 'Dar es Salaam') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800');
                    
                    $statusColors = [
                        'new' => 'bg-orange-100 text-orange-700',
                        'quote_sent' => 'bg-blue-50 text-blue-600',
                        'in_progress' => 'bg-yellow-100 text-yellow-700',
                        'docs_pending' => 'bg-purple-100 text-purple-700',
                        'in_transit' => 'bg-indigo-100 text-indigo-700',
                        'completed' => 'bg-green-100 text-green-700',
                        'cancelled' => 'bg-red-100 text-red-700',
                    ];
                    $statusLabel = [
                        'new' => 'Nouveau',
                        'quote_sent' => 'Devis Envoyé',
                        'in_progress' => 'En Cours',
                        'docs_pending' => 'Documents Manquants',
                        'in_transit' => 'En Transit',
                        'completed' => 'Livré',
                        'cancelled' => 'Annulé'
                    ];
                    ?>
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">#<?php echo $req['id']; ?></td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-bold text-gray-900"><?php echo htmlspecialchars($req['client_name']); ?></div>
                            <div class="text-xs text-gray-500"><?php echo htmlspecialchars($req['client_phone']); ?></div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex flex-col">
                                <span class="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1"><?php echo htmlspecialchars($req['origin_country']); ?> &rarr; Burundi</span>
                                <div>
                                    <span class="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider <?php echo $portColor; ?> shadow-sm">
                                        <i class="fas fa-anchor mr-1 text-[10px]"></i><?php echo htmlspecialchars($req['transit_port']); ?>
                                    </span>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-xs font-bold text-gray-700"><?php echo htmlspecialchars($req['commodity_type'] ?: $req['cargo_type']); ?></div>
                            <div class="text-xs text-gray-500"><?php echo $req['container_size'] ?: 'N/A'; ?> (<?php echo $req['incoterm']; ?>)</div>
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-2 py-1 rounded-full text-xs font-bold <?php echo $statusColors[$req['status']] ?? 'bg-gray-100'; ?>">
                                <?php echo $statusLabel[$req['status']] ?? $req['status']; ?>
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <button onclick="<?php echo $isFrozen ? '' : 'openModal(' . htmlspecialchars(json_encode($req)) . ')'; ?>" class="text-blue-900 hover:text-blue-700 font-bold text-sm <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>">
                                <i class="fas fa-<?php echo $isFrozen ? 'eye' : 'edit'; ?> mr-1"></i> <?php echo $isFrozen ? 'Consulter' : 'Gérer'; ?>
                            </button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Management Modal -->
<div id="requestModal" class="hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div class="p-6 bg-gray-50 border-b flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">Gérer la demande <span id="modalId"></span></h3>
            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
        </div>
        <form method="POST" class="p-6 space-y-4">
            <input type="hidden" name="request_id" id="modalRequestId">
            
            <div>
                <label class="block text-xs font-black text-gray-500 uppercase mb-2 tracking-widest">Statut de la demande</label>
                <select name="status" id="modalStatus" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-suloc-navy/5 focus:border-suloc-navy outline-none transition-all font-bold text-suloc-navy appearance-none cursor-pointer">
                    <option value="new">🆕 Nouveau</option>
                    <option value="quote_sent">📄 Devis Envoyé</option>
                    <option value="in_progress">⚙️ En Cours</option>
                    <option value="docs_pending">⚠️ Documents Manquants</option>
                    <option value="in_transit">🚢 En Transit</option>
                    <option value="completed">✅ Livré/Terminé</option>
                    <option value="cancelled">❌ Annulé</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Notes CRM / Suivi</label>
                <textarea name="admin_notes" id="modalNotes" rows="5" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-900/10 outline-none" placeholder="Notes sur le dédouanement, port, agents..."></textarea>
            </div>

            <div class="pt-4 flex space-x-3">
                <button type="button" onclick="closeModal()" class="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold">Annuler</button>
                <button type="submit" name="update_request" <?php echo $isFrozen ? 'disabled' : ''; ?> class="flex-1 px-4 py-3 bg-blue-900 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>">
                    <?php echo $isFrozen ? 'SYSTÈME GELÉ' : 'Enregistrer'; ?>
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    function openModal(req) {
        document.getElementById('modalRequestId').value = req.id;
        document.getElementById('modalId').textContent = '#' + req.id;
        document.getElementById('modalStatus').value = req.status;
        document.getElementById('modalNotes').value = req.admin_notes || '';
        document.getElementById('requestModal').classList.remove('hidden');
    }

    function closeModal() {
        document.getElementById('requestModal').classList.add('hidden');
    }
</script>
