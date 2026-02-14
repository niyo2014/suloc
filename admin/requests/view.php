<?php
/**
 * SULOC Admin - View Request Details
 * Detailed view and management of individual requests
 */

require_once __DIR__ . '/../../config/config.php';
requireLogin();

$pdo = getDBConnection();

// Get request type and ID
$type = $_GET['type'] ?? '';
$id = intval($_GET['id'] ?? 0);

if (empty($type) || $id <= 0) {
    header("Location: index.php");
    exit;
}

// Handle status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_status'])) {
    $newStatus = sanitizeInput($_POST['status'] ?? '');
    $adminNotes = sanitizeInput($_POST['admin_notes'] ?? '');
    
    $table = $type . '_requests';
    $stmt = $pdo->prepare("UPDATE $table SET status = ?, admin_notes = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$newStatus, $adminNotes, $id]);
    
    $message = 'Statut mis à jour avec succès!';
    $messageType = 'success';
}

// Fetch request details based on type
$request = null;
$relatedData = [];

switch ($type) {
    case 'vehicle':
        $stmt = $pdo->prepare("
            SELECT vr.*, v.brand, v.model, v.year, v.price, v.currency, v.main_image
            FROM vehicle_requests vr
            LEFT JOIN vehicles v ON vr.vehicle_id = v.id
            WHERE vr.id = ?
        ");
        $stmt->execute([$id]);
        $request = $stmt->fetch();
        if ($request) {
            $relatedData['vehicle'] = [
                'name' => $request['brand'] . ' ' . $request['model'] . ' ' . $request['year'],
                'price' => number_format($request['price'], 0, ',', ' ') . ' ' . $request['currency'],
                'image' => $request['main_image']
            ];
        }
        break;
        
    case 'visa':
        $stmt = $pdo->prepare("
            SELECT vr.*, vs.service_name, vs.price, vs.processing_time
            FROM visa_requests vr
            LEFT JOIN visa_services vs ON vr.visa_service_id = vs.id
            WHERE vr.id = ?
        ");
        $stmt->execute([$id]);
        $request = $stmt->fetch();
        if ($request) {
            $relatedData['service'] = [
                'name' => $request['service_name'] ?? 'N/A',
                'price' => $request['price'] ?? 'N/A',
                'processing_time' => $request['processing_time'] ?? 'N/A'
            ];
        }
        break;
        
    case 'import':
        $stmt = $pdo->prepare("SELECT * FROM import_requests WHERE id = ?");
        $stmt->execute([$id]);
        $request = $stmt->fetch();
        break;
        
    case 'payment':
        $stmt = $pdo->prepare("SELECT * FROM payment_requests WHERE id = ?");
        $stmt->execute([$id]);
        $request = $stmt->fetch();
        break;
        
    default:
        header("Location: index.php");
        exit;
}

if (!$request) {
    header("Location: index.php");
    exit;
}

$pageTitle = 'Détails de la Demande - SULOC Admin';

// Type labels
$typeLabels = [
    'vehicle' => 'Véhicule',
    'visa' => 'Visa',
    'import' => 'Import/Logistique',
    'payment' => 'Paiement',
];

// Status labels and values based on type
$allStatusOptions = [
    'vehicle' => [
        'new' => 'Nouvelle',
        'in_progress' => 'En Cours',
        'completed' => 'Complétée',
        'cancelled' => 'Annulée'
    ],
    'visa' => [
        'new' => 'Nouvelle',
        'in_progress' => 'En Cours',
        'completed' => 'Complétée',
        'cancelled' => 'Annulée'
    ],
    'import' => [
        'new' => 'Nouvelle',
        'quote_sent' => 'Devis Envoyé',
        'docs_pending' => 'Docs Manquants',
        'in_transit' => 'En Transit',
        'completed' => 'Livré',
        'cancelled' => 'Annulé'
    ],
    'payment' => [
        'new' => 'Nouvelle',
        'in_progress' => 'En Cours',
        'completed' => 'Complétée',
        'cancelled' => 'Annulée'
    ]
];

$typeStatusOptions = $allStatusOptions[$type] ?? $allStatusOptions['vehicle'];

$statusColors = [
    'new' => 'bg-orange-100 text-orange-700 border-orange-300',
    'quote_sent' => 'bg-blue-50 text-blue-600 border-blue-200',
    'in_progress' => 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'docs_pending' => 'bg-purple-100 text-purple-700 border-purple-300',
    'in_transit' => 'bg-indigo-100 text-indigo-700 border-indigo-300',
    'completed' => 'bg-green-100 text-green-700 border-green-300',
    'cancelled' => 'bg-red-100 text-red-700 border-red-300',
];
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
    </style>
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/../includes/admin-header.php'; ?>
    
    <div class="container mx-auto px-6 py-8">
        <!-- Breadcrumb -->
        <div class="mb-6">
            <a href="index.php" class="text-blue-600 hover:text-blue-800">
                <i class="fas fa-arrow-left mr-2"></i> Retour au Centre de Demandes
            </a>
        </div>
        
        <?php if (isset($message)): ?>
        <div class="mb-6 p-4 rounded-lg <?php echo $messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'; ?>">
            <?php echo htmlspecialchars($message); ?>
        </div>
        <?php endif; ?>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Request Header -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 mb-2">
                                <?php echo $typeLabels[$type]; ?>
                            </span>
                            <h1 class="text-3xl font-bold text-suloc-navy">
                                Demande #<?php echo $request['id']; ?>
                            </h1>
                            <p class="text-gray-600 mt-1">
                                <i class="fas fa-clock mr-1"></i>
                                Créée le <?php echo formatDate($request['created_at']); ?>
                            </p>
                        </div>
                        <div>
                            <span class="inline-block px-4 py-2 rounded-lg border-2 <?php echo $statusColors[$request['status']] ?? 'bg-gray-100'; ?> font-semibold">
                                <?php echo $typeStatusOptions[$request['status']] ?? $request['status']; ?>
                            </span>
                        </div>
                    </div>
                </div>
                
                <!-- Client Information -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-xl font-bold text-suloc-navy mb-4">
                        <i class="fas fa-user mr-2"></i> Informations Client
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Nom Complet</label>
                            <p class="text-lg text-gray-900"><?php echo htmlspecialchars($request['client_name']); ?></p>
                        </div>
                        <?php if (!empty($request['client_email'])): ?>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Email</label>
                            <p class="text-lg text-gray-900">
                                <a href="mailto:<?php echo htmlspecialchars($request['client_email']); ?>" class="text-blue-600 hover:text-blue-800">
                                    <?php echo htmlspecialchars($request['client_email']); ?>
                                </a>
                            </p>
                        </div>
                        <?php endif; ?>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Téléphone</label>
                            <p class="text-lg text-gray-900">
                                <a href="tel:<?php echo htmlspecialchars($request['client_phone']); ?>" class="text-blue-600 hover:text-blue-800">
                                    <?php echo htmlspecialchars($request['client_phone']); ?>
                                </a>
                            </p>
                        </div>
                        <?php if (!empty($request['client_whatsapp'])): ?>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">WhatsApp</label>
                            <p class="text-lg">
                                <a href="https://wa.me/<?php echo preg_replace('/[^0-9]/', '', $request['client_whatsapp']); ?>" 
                                   target="_blank" 
                                   class="inline-flex items-center text-green-600 hover:text-green-700 font-semibold">
                                    <i class="fab fa-whatsapp mr-2"></i>
                                    <?php echo htmlspecialchars($request['client_whatsapp']); ?>
                                </a>
                            </p>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
                
                <!-- Request Details -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-xl font-bold text-suloc-navy mb-4">
                        <i class="fas fa-info-circle mr-2"></i> Détails de la Demande
                    </h2>
                    
                    <?php if ($type === 'vehicle' && !empty($relatedData['vehicle'])): ?>
                    <div class="mb-4 p-4 bg-gray-50 rounded-lg flex items-center space-x-4">
                        <?php if ($relatedData['vehicle']['image']): ?>
                        <img src="<?php echo htmlspecialchars($relatedData['vehicle']['image']); ?>" 
                             alt="Vehicle" 
                             class="w-24 h-24 object-cover rounded-lg">
                        <?php endif; ?>
                        <div>
                            <h3 class="font-bold text-lg"><?php echo htmlspecialchars($relatedData['vehicle']['name']); ?></h3>
                            <p class="text-suloc-gold font-semibold"><?php echo $relatedData['vehicle']['price']; ?></p>
                        </div>
                    </div>
                    <?php endif; ?>
                    
                    <?php if ($type === 'visa'): ?>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Pays de Destination</label>
                            <p class="text-lg"><?php echo htmlspecialchars($request['destination_country']); ?></p>
                        </div>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Type de Visa</label>
                            <p class="text-lg"><?php echo htmlspecialchars($request['visa_type']); ?></p>
                        </div>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Date de Départ Prévue</label>
                            <p class="text-lg"><?php echo formatDate($request['travel_date']); ?></p>
                        </div>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Nombre de Personnes</label>
                            <p class="text-lg"><?php echo $request['number_of_people']; ?></p>
                        </div>
                    </div>
                    <?php endif; ?>
                    
                    <?php if ($type === 'import'): ?>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Pays d'Origine</label>
                            <p class="text-lg"><?php echo htmlspecialchars($request['origin_country']); ?></p>
                        </div>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Port de Transit</label>
                            <p class="text-lg">
                                <span class="px-2 py-0.5 rounded shadow-sm font-bold <?php echo $request['transit_port'] === 'Mombasa' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'; ?>">
                                    <?php echo htmlspecialchars($request['transit_port']); ?>
                                </span>
                            </p>
                        </div>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Incoterm</label>
                            <p class="text-lg font-bold text-suloc-navy"><?php echo htmlspecialchars($request['incoterm']); ?></p>
                        </div>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Taille/Type</label>
                            <p class="text-lg"><?php echo htmlspecialchars($request['container_size']); ?></p>
                        </div>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Poids Estimé</label>
                            <p class="text-lg"><?php echo htmlspecialchars($request['estimated_weight']); ?> kg</p>
                        </div>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Nature des produits</label>
                            <p class="text-lg"><?php echo htmlspecialchars($request['commodity_type']); ?></p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="text-sm font-semibold text-gray-600">Description du Cargo</label>
                        <p class="text-gray-900 mt-1"><?php echo nl2br(htmlspecialchars($request['cargo_description'])); ?></p>
                    </div>
                    <?php endif; ?>
                    
                    <?php if ($type === 'payment'): ?>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Opérateur</label>
                            <p class="text-lg"><?php echo htmlspecialchars($request['operator']); ?></p>
                        </div>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Type de Transaction</label>
                            <p class="text-lg"><?php echo htmlspecialchars($request['transaction_type']); ?></p>
                        </div>
                        <div>
                            <label class="text-sm font-semibold text-gray-600">Montant</label>
                            <p class="text-lg font-semibold text-suloc-gold">
                                <?php echo number_format($request['amount'], 0, ',', ' '); ?> <?php echo htmlspecialchars($request['currency']); ?>
                            </p>
                        </div>
                    </div>
                    <?php endif; ?>
                    
                    <?php if (!empty($request['message']) || !empty($request['additional_info'])): ?>
                    <div>
                        <label class="text-sm font-semibold text-gray-600">Message/Informations Supplémentaires</label>
                        <p class="text-gray-900 mt-1 p-4 bg-gray-50 rounded-lg">
                            <?php echo nl2br(htmlspecialchars($request['message'] ?? $request['additional_info'] ?? '')); ?>
                        </p>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Sidebar -->
            <div class="lg:col-span-1 space-y-6">
                <!-- Status Management -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-lg font-bold text-suloc-navy mb-4">
                        <i class="fas fa-tasks mr-2"></i> Gestion du Statut
                    </h3>
                    <form method="POST" action="">
                        <div class="mb-4">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Statut</label>
                            <select name="status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <?php foreach ($typeStatusOptions as $val => $label): ?>
                                    <option value="<?php echo $val; ?>" <?php echo $request['status'] === $val ? 'selected' : ''; ?>>
                                        <?php echo $label; ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div class="mb-4">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Notes Admin</label>
                            <textarea name="admin_notes" rows="4" 
                                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Notes internes..."><?php echo htmlspecialchars($request['admin_notes'] ?? ''); ?></textarea>
                        </div>
                        
                        <button type="submit" name="update_status" 
                                class="w-full bg-suloc-navy text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition">
                            <i class="fas fa-save mr-2"></i> Mettre à Jour
                        </button>
                    </form>
                </div>
                
                <!-- Quick Actions -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-lg font-bold text-suloc-navy mb-4">
                        <i class="fas fa-bolt mr-2"></i> Actions Rapides
                    </h3>
                    <div class="space-y-3">
                        <?php if (!empty($request['client_whatsapp'])): ?>
                        <a href="https://wa.me/<?php echo preg_replace('/[^0-9]/', '', $request['client_whatsapp']); ?>?text=Bonjour%20<?php echo urlencode($request['client_name']); ?>%2C%20concernant%20votre%20demande%20%23<?php echo $request['id']; ?>..." 
                           target="_blank"
                           class="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition">
                            <i class="fab fa-whatsapp mr-2"></i> Répondre via WhatsApp
                        </a>
                        <?php endif; ?>
                        
                        <?php if (!empty($request['client_email'])): ?>
                        <a href="mailto:<?php echo htmlspecialchars($request['client_email']); ?>?subject=Demande%20%23<?php echo $request['id']; ?>" 
                           class="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition">
                            <i class="fas fa-envelope mr-2"></i> Envoyer un Email
                        </a>
                        <?php endif; ?>
                        
                        <a href="tel:<?php echo htmlspecialchars($request['client_phone']); ?>" 
                           class="block w-full bg-gray-600 text-white text-center py-3 rounded-lg hover:bg-gray-700 transition">
                            <i class="fas fa-phone mr-2"></i> Appeler le Client
                        </a>
                    </div>
                </div>
                
                <!-- Timeline -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-lg font-bold text-suloc-navy mb-4">
                        <i class="fas fa-history mr-2"></i> Historique
                    </h3>
                    <div class="space-y-3">
                        <div class="flex items-start space-x-3">
                            <div class="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div>
                                <p class="text-sm font-semibold">Demande créée</p>
                                <p class="text-xs text-gray-600"><?php echo formatDate($request['created_at']); ?></p>
                            </div>
                        </div>
                        <?php if (!empty($request['updated_at']) && $request['updated_at'] !== $request['created_at']): ?>
                        <div class="flex items-start space-x-3">
                            <div class="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                            <div>
                                <p class="text-sm font-semibold">Dernière mise à jour</p>
                                <p class="text-xs text-gray-600"><?php echo formatDate($request['updated_at']); ?></p>
                            </div>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
