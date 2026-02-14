<?php
/**
 * SULOC Admin - Unified Request Center
 * Centralized inbox for all request types
 */

require_once __DIR__ . '/../../config/config.php';
requireLogin();

$pdo = getDBConnection();

// Get filter parameters
$type = $_GET['type'] ?? 'all';
$status = $_GET['status'] ?? 'all';
$search = $_GET['search'] ?? '';

// Handle AJAX Status Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_status') {
    header('Content-Type: application/json');
    $reqType = $_POST['type'];
    $reqId = intval($_POST['id']);
    $newStatus = $_POST['status'];
    
    try {
        $table = $reqType . '_requests';
        $stmt = $pdo->prepare("UPDATE $table SET status = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$newStatus, $reqId]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Build queries for each request type
$requests = [];

// Vehicle Requests
if ($type === 'all' || $type === 'vehicle') {
    $where = ["1=1"];
    $params = [];
    
    if ($status !== 'all') {
        $where[] = "status = ?";
        $params[] = $status;
    }
    
    if (!empty($search)) {
        $where[] = "(client_name LIKE ? OR client_email LIKE ? OR client_phone LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = implode(' AND ', $where);
    $stmt = $pdo->prepare("
        SELECT 'vehicle' as request_type, vr.id, vr.client_name, vr.client_email, vr.client_phone, 
               vr.client_whatsapp, vr.message, vr.status, vr.created_at,
               CONCAT(v.brand, ' ', v.model, ' ', v.year) as subject
        FROM vehicle_requests vr
        LEFT JOIN vehicles v ON vr.vehicle_id = v.id
        WHERE $whereClause
    ");
    $stmt->execute($params);
    $requests = array_merge($requests, $stmt->fetchAll());
}

// Visa Requests
if ($type === 'all' || $type === 'visa') {
    $where = ["1=1"];
    $params = [];
    
    if ($status !== 'all') {
        $where[] = "status = ?";
        $params[] = $status;
    }
    
    if (!empty($search)) {
        $where[] = "(client_name LIKE ? OR client_email LIKE ? OR client_phone LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = implode(' AND ', $where);
    $stmt = $pdo->prepare("
        SELECT 'visa' as request_type, vr.id, vr.client_name, vr.client_email, vr.client_phone,
               vr.client_whatsapp, vr.additional_info as message, vr.status, vr.created_at,
               CONCAT('Visa pour ', vr.destination_country) as subject
        FROM visa_requests vr
        WHERE $whereClause
    ");
    $stmt->execute($params);
    $requests = array_merge($requests, $stmt->fetchAll());
}

// Import Requests
if ($type === 'all' || $type === 'import') {
    $where = ["1=1"];
    $params = [];
    
    if ($status !== 'all') {
        $where[] = "status = ?";
        $params[] = $status;
    }
    
    if (!empty($search)) {
        $where[] = "(client_name LIKE ? OR client_email LIKE ? OR client_phone LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = implode(' AND ', $where);
    $stmt = $pdo->prepare("
        SELECT 'import' as request_type, ir.id, ir.client_name, ir.client_email, ir.client_phone,
               ir.client_whatsapp, ir.cargo_description as message, ir.status, ir.created_at,
               ir.transit_port, ir.incoterm, ir.container_size,
               CONCAT('Import: ', ir.origin_country, ' → ', ir.destination_country) as subject
        FROM import_requests ir
        WHERE $whereClause
    ");
    $stmt->execute($params);
    $requests = array_merge($requests, $stmt->fetchAll());
}

// Payment Requests
if ($type === 'all' || $type === 'payment') {
    $where = ["1=1"];
    $params = [];
    
    if ($status !== 'all') {
        $where[] = "status = ?";
        $params[] = $status;
    }
    
    if (!empty($search)) {
        $where[] = "(client_name LIKE ? OR client_phone LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = implode(' AND ', $where);
    $stmt = $pdo->prepare("
        SELECT 'payment' as request_type, pr.id, pr.client_name, NULL as client_email, pr.client_phone,
               pr.client_whatsapp, '' as message, pr.status, pr.created_at,
               CONCAT(pr.operator, ' - ', pr.amount, ' ', pr.currency) as subject
        FROM payment_requests pr
        WHERE $whereClause
    ");
    $stmt->execute($params);
    $requests = array_merge($requests, $stmt->fetchAll());
}

// Sort by created_at DESC
usort($requests, function($a, $b) {
    return strtotime($b['created_at']) - strtotime($a['created_at']);
});

// Get statistics
$stats = [
    'total' => count($requests),
    'new' => count(array_filter($requests, fn($r) => $r['status'] === 'new')),
    'in_progress' => count(array_filter($requests, fn($r) => $r['status'] === 'in_progress')),
    'completed' => count(array_filter($requests, fn($r) => $r['status'] === 'completed')),
];

$pageTitle = 'Centre de Demandes - SULOC Admin';
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
        .border-suloc-gold { border-color: var(--suloc-gold); }
        
        .request-card {
            transition: all 0.3s;
        }
        
        .request-card:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .type-badge {
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
        }
        
        .status-badge {
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: 0.375rem;
        }
    </style>
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/../includes/admin-header.php'; ?>
    
    <div class="container mx-auto px-6 py-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-bold text-suloc-navy">Centre de Demandes</h1>
                <p class="text-gray-600 mt-1">Gérez toutes vos demandes clients en un seul endroit</p>
            </div>
            <div class="relative">
                <button id="export-btn" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center">
                    <i class="fas fa-file-export mr-2"></i> Exporter
                    <i class="fas fa-chevron-down ml-2"></i>
                </button>
                <div id="export-menu" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                    <a href="export.php?type=<?php echo $type; ?>&status=<?php echo $status; ?>&format=csv" 
                       class="block px-4 py-3 hover:bg-gray-50 text-gray-700 border-b border-gray-200">
                        <i class="fas fa-file-csv text-green-600 mr-2"></i> Export CSV
                    </a>
                    <a href="export.php?type=<?php echo $type; ?>&status=<?php echo $status; ?>&format=excel" 
                       class="block px-4 py-3 hover:bg-gray-50 text-gray-700">
                        <i class="fas fa-file-excel text-green-600 mr-2"></i> Export Excel
                    </a>
                </div>
            </div>
        </div>
        
        <script>
            // Export menu toggle
            document.getElementById('export-btn').addEventListener('click', () => {
                const menu = document.getElementById('export-menu');
                menu.classList.toggle('hidden');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                const btn = document.getElementById('export-btn');
                const menu = document.getElementById('export-menu');
                if (!btn.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.add('hidden');
                }
            });
        </script>
        
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Total</p>
                        <p class="text-3xl font-bold text-blue-600"><?php echo $stats['total']; ?></p>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <i class="fas fa-inbox text-blue-600 text-xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Nouvelles</p>
                        <p class="text-3xl font-bold text-orange-600"><?php echo $stats['new']; ?></p>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <i class="fas fa-bell text-orange-600 text-xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">En Cours</p>
                        <p class="text-3xl font-bold text-yellow-600"><?php echo $stats['in_progress']; ?></p>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <i class="fas fa-spinner text-yellow-600 text-xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 text-sm">Complétées</p>
                        <p class="text-3xl font-bold text-green-600"><?php echo $stats['completed']; ?></p>
                    </div>
                    <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <i class="fas fa-check-circle text-green-600 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <form method="GET" action="" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Type Filter -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Type de Demande</label>
                    <select name="type" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all" <?php echo $type === 'all' ? 'selected' : ''; ?>>Toutes</option>
                        <option value="vehicle" <?php echo $type === 'vehicle' ? 'selected' : ''; ?>>Véhicules</option>
                        <option value="visa" <?php echo $type === 'visa' ? 'selected' : ''; ?>>Visas</option>
                        <option value="import" <?php echo $type === 'import' ? 'selected' : ''; ?>>Import/Logistique</option>
                        <option value="payment" <?php echo $type === 'payment' ? 'selected' : ''; ?>>Paiements</option>
                    </select>
                </div>
                
                <!-- Status Filter -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Statut</label>
                    <select name="status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all" <?php echo $status === 'all' ? 'selected' : ''; ?>>Tous</option>
                        <option value="new" <?php echo $status === 'new' ? 'selected' : ''; ?>>Nouvelles (New)</option>
                        <option value="quote_sent" <?php echo $status === 'quote_sent' ? 'selected' : ''; ?>>Devis Envoyé</option>
                        <option value="docs_pending" <?php echo $status === 'docs_pending' ? 'selected' : ''; ?>>Docs Manquants</option>
                        <option value="in_transit" <?php echo $status === 'in_transit' ? 'selected' : ''; ?>>En Transit</option>
                        <option value="in_progress" <?php echo $status === 'in_progress' ? 'selected' : ''; ?>>En Cours</option>
                        <option value="completed" <?php echo $status === 'completed' ? 'selected' : ''; ?>>Complétées / Livrées</option>
                        <option value="cancelled" <?php echo $status === 'cancelled' ? 'selected' : ''; ?>>Annulées</option>
                    </select>
                </div>
                
                <!-- Search -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Rechercher</label>
                    <input type="text" name="search" value="<?php echo htmlspecialchars($search); ?>" 
                           placeholder="Nom, email, téléphone..." 
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <!-- Submit -->
                <div class="flex items-end">
                    <button type="submit" class="w-full bg-suloc-navy text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition">
                        <i class="fas fa-search mr-2"></i> Filtrer
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Requests List -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <?php if (empty($requests)): ?>
            <div class="px-6 py-12 text-center text-gray-600">
                <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                <p class="text-xl font-semibold">Aucune demande trouvée</p>
                <p class="text-gray-500 mt-2">Modifiez vos filtres pour voir plus de résultats</p>
            </div>
            <?php else: ?>
            <div class="divide-y divide-gray-200">
                <?php foreach ($requests as $request): 
                    $typeColors = [
                        'vehicle' => 'bg-blue-100 text-blue-700',
                        'visa' => 'bg-green-100 text-green-700',
                        'import' => 'bg-purple-100 text-purple-700',
                        'payment' => 'bg-orange-100 text-orange-700',
                    ];

                    $typeStatusOptions = [
                        'vehicle' => ['new' => 'Nouvelle', 'in_progress' => 'En Cours', 'completed' => 'Complétée', 'cancelled' => 'Annulée'],
                        'visa' => ['new' => 'Nouvelle', 'in_progress' => 'En Cours', 'completed' => 'Complétée', 'cancelled' => 'Annulée'],
                        'import' => ['new' => 'Nouvelle', 'quote_sent' => 'Devis Envoyé', 'docs_pending' => 'Docs Manquants', 'in_transit' => 'En Transit', 'completed' => 'Livré', 'cancelled' => 'Annulé'],
                        'payment' => ['new' => 'Nouvelle', 'in_progress' => 'En Cours', 'completed' => 'Complétée', 'cancelled' => 'Annulée']
                    ];
                    
                    $statusColors = [
                        'new' => 'bg-orange-100 text-orange-700',
                        'quote_sent' => 'bg-blue-50 text-blue-600',
                        'in_progress' => 'bg-yellow-100 text-yellow-700',
                        'docs_pending' => 'bg-purple-100 text-purple-700',
                        'in_transit' => 'bg-indigo-100 text-indigo-700',
                        'completed' => 'bg-green-100 text-green-700',
                        'cancelled' => 'bg-red-100 text-red-700',
                    ];
                    
                    $typeLabels = [
                        'vehicle' => 'Véhicule',
                        'visa' => 'Visa',
                        'import' => 'Import',
                        'payment' => 'Paiement',
                    ];
                ?>
                <div class="request-card p-6 hover:bg-gray-50 cursor-pointer relative" 
                     onclick="window.location.href='view.php?type=<?php echo $request['request_type']; ?>&id=<?php echo $request['id']; ?>'">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-2">
                                <span class="type-badge <?php echo $typeColors[$request['request_type']]; ?>">
                                    <?php echo $typeLabels[$request['request_type']]; ?>
                                </span>
                                
                                <!-- Quick Status Selector -->
                                <div class="relative inline-block" onclick="event.stopPropagation()">
                                    <select onchange="updateRequestStatus('<?php echo $request['request_type']; ?>', <?php echo $request['id']; ?>, this.value)" 
                                            class="status-badge <?php echo $statusColors[$request['status']] ?? 'bg-gray-100 text-gray-700'; ?> border-none cursor-pointer appearance-none pr-6 focus:ring-2 focus:ring-blue-500">
                                        <?php foreach ($typeStatusOptions[$request['request_type']] as $val => $label): ?>
                                            <option value="<?php echo $val; ?>" <?php echo $request['status'] === $val ? 'selected' : ''; ?>>
                                                <?php echo $label; ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                    <div class="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[0.6rem]">
                                        <i class="fas fa-chevron-down"></i>
                                    </div>
                                </div>
                                <span class="text-sm text-gray-500">
                                    <i class="fas fa-clock mr-1"></i>
                                    <?php echo formatDate($request['created_at']); ?>
                                </span>
                            </div>
                            
                            <h3 class="text-lg font-bold text-suloc-navy mb-1">
                                <?php echo htmlspecialchars($request['client_name']); ?>
                            </h3>
                            
                            <p class="text-gray-700 mb-2">
                                <strong><?php echo htmlspecialchars($request['subject']); ?></strong>
                                <?php if ($request['request_type'] === 'import' && !empty($request['transit_port'])): ?>
                                <span class="ml-2 px-2 py-0.5 text-xs font-bold rounded <?php echo $request['transit_port'] === 'Mombasa' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'; ?>">
                                    Port: <?php echo $request['transit_port']; ?>
                                </span>
                                <span class="ml-1 text-xs text-gray-500">(<?php echo $request['incoterm']; ?> / <?php echo $request['container_size']; ?>)</span>
                                <?php endif; ?>
                            </p>
                            
                            <div class="flex items-center space-x-4 text-sm text-gray-600">
                                <?php if ($request['client_email']): ?>
                                <span><i class="fas fa-envelope mr-1"></i> <?php echo htmlspecialchars($request['client_email']); ?></span>
                                <?php endif; ?>
                                <span><i class="fas fa-phone mr-1"></i> <?php echo htmlspecialchars($request['client_phone']); ?></span>
                                <?php if ($request['client_whatsapp']): ?>
                                <a href="https://wa.me/<?php echo preg_replace('/[^0-9]/', '', $request['client_whatsapp']); ?>" 
                                   target="_blank" 
                                   class="text-green-600 hover:text-green-700"
                                   onclick="event.stopPropagation()">
                                    <i class="fab fa-whatsapp mr-1"></i> WhatsApp
                                </a>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <div>
                            <i class="fas fa-chevron-right text-gray-400"></i>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>
    </div>
    <script>
        function updateRequestStatus(type, id, status) {
            const formData = new FormData();
            formData.append('action', 'update_status');
            formData.append('type', type);
            formData.append('id', id);
            formData.append('status', status);

            fetch('index.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update the select background color dynamically if needed
                    location.reload(); // Simplest way to reflect color changes and stats
                } else {
                    alert('Erreur lors de la mise à jour: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Une erreur réseau est survenue.');
            });
        }
    </script>
</body>
</html>
