<?php
/**
 * SULOC Admin - Money Transfer Platform (v2.0)
 * Optimized for High-Volume Data (Search, Filter, Pagination)
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/payment-helpers.php';
requireLogin();

$pdo = getDBConnection();
$message = '';
$messageType = '';

// Check for POST size limit violation (File too large)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($_POST) && empty($_FILES) && $_SERVER['CONTENT_LENGTH'] > 0) {
    $message = "Erreur Critique: Le fichier envoyé dépasse la limite du serveur (post_max_size).";
    $messageType = 'error';
}

// Pagination Settings
$limit = 25;
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$offset = ($page - 1) * $limit;

// Search & Filter Parameters
$search = sanitizeInput($_GET['search'] ?? '');
$statusFilter = sanitizeInput($_GET['status'] ?? '');
$methodFilter = sanitizeInput($_GET['method'] ?? '');

// Build Query
$queryParts = ["1=1"];
$params = [];

if (!empty($search)) {
    $queryParts[] = "(r.verification_code LIKE ? OR r.receiver_name LIKE ? OR r.receiver_phone LIKE ? OR r.receiver_id_number LIKE ? OR r.sender_name LIKE ?)";
    $s = "%$search%";
    array_push($params, $s, $s, $s, $s, $s);
}

if (!empty($statusFilter)) {
    $queryParts[] = "r.payout_status = ?";
    $params[] = $statusFilter;
}

if (!empty($methodFilter)) {
    $queryParts[] = "r.payment_method = ?";
    $params[] = $methodFilter;
}

$whereClause = implode(" AND ", $queryParts);

// Get Total for Pagination
$countStmt = $pdo->prepare("SELECT COUNT(*) FROM payment_requests r WHERE $whereClause");
$countStmt->execute($params);
$totalRecords = $countStmt->fetchColumn();
$totalPages = ceil($totalRecords / $limit);

// Fetch Global Fee
$stmt = $pdo->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'transfer_fee_percentage'");
$stmt->execute();
$globalFeePercent = floatval($stmt->fetchColumn() ?: 5.97);

// Handle Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // SECURITY CHECK: Module Freeze
    if (isModuleFrozen('payments') && $_SESSION['admin_role'] !== 'creator') {
        $message = "ERREUR : Le module de Paiements est actuellement GELÉ par le Système. Aucune modification n'est permise.";
        $messageType = 'error';
    } else {
        $action = $_POST['action'] ?? '';
    
    // 1. REGISTER NEW TRANSFER
    if ($action === 'register_transfer') {
        $senderName = sanitizeInput($_POST['sender_name'] ?? '');
        $senderAddress = sanitizeInput($_POST['sender_address'] ?? '');
        $receiverName = sanitizeInput($_POST['receiver_name'] ?? '');
        $receiverID = sanitizeInput($_POST['receiver_id_number'] ?? '');
        $receiverPhone = sanitizeInput($_POST['receiver_phone'] ?? '');
        $receiverAddress = sanitizeInput($_POST['receiver_address'] ?? '');
        $amount = floatval($_POST['amount'] ?? 0);
        $currency = sanitizeInput($_POST['currency'] ?? 'USD');
        $operatorId = intval($_POST['payment_service_id'] ?? 0);
        $method = $_POST['payment_method'] ?? 'cash';
        
        $feeAmount = calculateTransferFees($amount, $globalFeePercent);
        $totalToPay = $amount + $feeAmount;
        $amountToReceive = $amount;
        
        $receiverPhoto = '';
        $bankSlip = '';
        
        if (isset($_FILES['receiver_photo'])) {
            if ($_FILES['receiver_photo']['error'] === UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['receiver_photo']['name'], PATHINFO_EXTENSION);
                $filename = 'rec_' . uniqid() . '.' . $ext;
                if (move_uploaded_file($_FILES['receiver_photo']['tmp_name'], UPLOAD_PATH . '/payments/' . $filename)) {
                    $receiverPhoto = UPLOAD_URL . '/payments/' . $filename;
                } else {
                     error_log("Upload failed: Could not move file to " . UPLOAD_PATH . '/payments/' . $filename);
                }
            } else {
                error_log("Upload error code: " . $_FILES['receiver_photo']['error']);
            }
        } else {
            error_log("No file uploaded for receiver_photo");
        }
        
        if ($method === 'bank' && isset($_FILES['bank_slip']) && $_FILES['bank_slip']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['bank_slip']['name'], PATHINFO_EXTENSION);
            $filename = 'slip_' . uniqid() . '.' . $ext;
            if (move_uploaded_file($_FILES['bank_slip']['tmp_name'], UPLOAD_PATH . '/payments/' . $filename)) {
                $bankSlip = UPLOAD_URL . '/payments/' . $filename;
            }
        }
        
        $vStatus = ($method === 'cash') ? 'verified' : 'pending';
        $pStatus = ($method === 'cash') ? 'Ready' : 'Pending';
        $code = ($method === 'cash') ? generateSULOCode($pdo) : null;
        
        try {
            $stmt = $pdo->prepare("INSERT INTO payment_requests (payment_service_id, client_name, client_phone, sender_name, sender_address, receiver_name, receiver_id_number, receiver_phone, receiver_address, receiver_photo, payment_method, bank_slip_proof, amount, currency, transfer_fee_percentage, transfer_fee_amount, total_to_pay, amount_to_receive, verification_code, payout_status, payment_verification_status, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $operatorId, $senderName, $receiverPhone, 
                $senderName, $senderAddress, $receiverName, $receiverID, $receiverPhone, $receiverAddress, $receiverPhoto,
                $method, $bankSlip, $amount, $currency, $globalFeePercent, $feeAmount, $totalToPay, $amountToReceive,
                $code, $pStatus, $vStatus, 'new'
            ]);
            $message = "Transfert enregistré! " . ($code ? "Code Secret: $code" : "En attente de vérification du versement bancaire.");
            $messageType = 'success';
        } catch (Exception $e) { $message = "Erreur: " . $e->getMessage(); $messageType = 'error'; }
    }
    
    // 2. VERIFY BANK SLIP
    elseif ($action === 'verify_bank') {
        $id = intval($_POST['request_id'] ?? 0);
        try {
            $code = generateSULOCode($pdo);
            $stmt = $pdo->prepare("UPDATE payment_requests SET payment_verification_status = 'verified', payout_status = 'Ready', verification_code = ?, status = 'in_progress' WHERE id = ?");
            $stmt->execute([$code, $id]);
            $message = "Versement vérifié et Code généré: $code"; $messageType = 'success';
        } catch (Exception $e) { $message = "Erreur: " . $e->getMessage(); $messageType = 'error'; }
    }
    
// 3. DISBURSE (3-POINT VERIFICATION)
    elseif ($action === 'disburse_payout') {
        $id = intval($_POST['request_id'] ?? 0);
        $code = strtoupper(trim($_POST['secret_code'] ?? ''));
        $stmt = $pdo->prepare("SELECT * FROM payment_requests WHERE id = ?");
        $stmt->execute([$id]);
        $req = $stmt->fetch();
        if ($req && $req['verification_code'] === $code) {
            $stmt = $pdo->prepare("UPDATE payment_requests SET payout_status = 'Paid', status = 'completed', code_verified_at = NOW(), verified_by_admin = ? WHERE id = ?");
            $stmt->execute([$_SESSION['admin_id'], $id]);
            $message = "PAIEMENT EFFECTUÉ AVEC SUCCÈS!"; $messageType = 'success';
        } else { $message = "ÉCHEC DE VÉRIFICATION: Code secret erroné."; $messageType = 'error'; }
    }
    } // End freeze check
}

// Ensure upload directory exists
if (!is_dir(UPLOAD_PATH . '/payments')) { mkdir(UPLOAD_PATH . '/payments', 0755, true); }

$isFrozen = isModuleFrozen('payments') && ($_SESSION['admin_role'] ?? '') !== 'creator';
$frozenClass = $isFrozen ? 'opacity-50 pointer-events-none' : '';
$frozenBadge = $isFrozen ? '<span class="ml-4 px-4 py-2 bg-red-100 text-red-600 rounded-xl text-xs font-black uppercase inline-flex items-center gap-2 animate-pulse"><i class="fas fa-snowflake"></i> Système Gelé (Lecture Seule)</span>' : '';

// Fetch Operators
$operators = $pdo->query("SELECT id, operator_name FROM payment_services WHERE is_active = 1")->fetchAll();

// Fetch Requests with Limit
$fetchStmt = $pdo->prepare("SELECT r.*, s.operator_name FROM payment_requests r LEFT JOIN payment_services s ON r.payment_service_id = s.id WHERE $whereClause ORDER BY r.created_at DESC LIMIT $limit OFFSET $offset");
$fetchStmt->execute($params);
$requests = $fetchStmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>SULOC Control Center v2.0</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50/50">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>

    <div class="container mx-auto px-6 py-10">
        
        <!-- Header & Fast Discovery -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
            <div>
                <h1 class="text-4xl font-black text-slate-900 tracking-tight flex items-center">SULOC <span class="text-blue-600">Command Center</span> <?php echo $frozenBadge; ?></h1>
                <p class="text-slate-500 font-medium">Gestion des flux monétaires et vérification sécurisée.</p>
            </div>
            <div class="flex gap-4">
                <div class="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4">
                    <div class="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl"><i class="fas fa-users-viewfinder"></i></div>
                    <div>
                        <div class="text-[10px] font-black text-slate-400 uppercase">Total Clients</div>
                        <div class="text-xl font-black text-slate-900"><?php echo number_format($totalRecords); ?></div>
                    </div>
                </div>
                <button onclick="toggleReportModal()" class="bg-white text-slate-900 border border-slate-200 px-6 py-4 rounded-2xl font-black hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                    <i class="fas fa-chart-line text-blue-600"></i> Rapports Financiers
                </button>
                <button onclick="toggleForm()" <?php echo $isFrozen ? 'disabled' : ''; ?> class="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl hover:shadow-blue-500/20 active:scale-95 flex items-center gap-2 <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>">
                    <i class="fas fa-plus-circle"></i> Nouveau Transfert
                </button>
            </div>
        </div>

        <?php if ($message): ?>
            <div class="p-6 mb-10 rounded-3xl <?php echo $messageType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'; ?> shadow-2xl flex items-center gap-4 animate-bounce-in">
                <i class="fas <?php echo $messageType === 'success' ? 'fa-check-circle' : 'fa-triangle-exclamation'; ?> text-3xl"></i>
                <p class="font-bold text-lg"><?php echo htmlspecialchars($message); ?></p>
            </div>
        <?php endif; ?>

        <!-- ADVANCED SEARCH & FILTERING -->
        <div class="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 mb-10">
            <form method="GET" class="flex flex-wrap items-center gap-4">
                <div class="flex-grow relative">
                    <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input type="text" name="search" value="<?php echo htmlspecialchars($search); ?>" placeholder="Rechercher par Code Secret, Nom ou Téléphone..." class="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition font-medium">
                </div>
                <select name="status" class="px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 transition font-bold text-slate-600">
                    <option value="">Tous les Statuts</option>
                    <option value="Pending" <?php echo $statusFilter == 'Pending' ? 'selected' : ''; ?>>En attente</option>
                    <option value="Ready" <?php echo $statusFilter == 'Ready' ? 'selected' : ''; ?>>Prêt pour retrait</option>
                    <option value="Paid" <?php echo $statusFilter == 'Paid' ? 'selected' : ''; ?>>Payés</option>
                </select>
                <select name="method" class="px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 transition font-bold text-slate-600">
                    <option value="">Tous les Modes</option>
                    <option value="cash" <?php echo $methodFilter == 'cash' ? 'selected' : ''; ?>>Cash</option>
                    <option value="bank" <?php echo $methodFilter == 'bank' ? 'selected' : ''; ?>>Banque</option>
                </select>
                <button type="submit" class="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-slate-800 transition">FILTRER</button>
            </form>
        </div>

        <!-- NEW TRANSFER FORM (Collapsible) -->
        <div id="transferForm" class="hidden bg-white rounded-[2.5rem] shadow-2xl p-10 border border-blue-50 mb-10 overflow-hidden">
            <h2 class="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <span class="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><i class="fas fa-pencil-alt text-lg"></i></span>
                Enregistrement Client
            </h2>
            <form method="POST" action="" enctype="multipart/form-data" class="space-y-8">
                <input type="hidden" name="action" value="register_transfer">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div class="space-y-4">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest px-2">1. Expéditeur (DRC)</label>
                        <input type="text" name="sender_name" required placeholder="Nom de l'Expéditeur" class="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition">
                        <textarea name="sender_address" required placeholder="Adresse Postale / Physique" class="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition" rows="2"></textarea>
                        <div class="flex gap-4">
                            <input type="number" step="0.01" name="amount" id="formAmount" required placeholder="Montant USD" class="flex-1 p-5 border-2 rounded-2xl font-bold" oninput="calculateFees()">
                            <select name="payment_service_id" required class="flex-1 p-5 border-2 rounded-2xl font-bold bg-white">
                                <option value="" disabled selected>Opérateur</option>
                                <?php foreach($operators as $op): ?>
                                    <option value="<?php echo $op['id']; ?>"><?php echo htmlspecialchars($op['operator_name']); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="bg-slate-900 p-6 rounded-3xl text-white flex justify-between items-center shadow-inner">
                            <div>
                                <div class="text-[10px] font-black opacity-40 uppercase">Frais SULOC (<?php echo $globalFeePercent; ?>%)</div>
                                <div id="dispFee" class="text-2xl font-black text-blue-400">0.00 USD</div>
                            </div>
                            <div class="text-right">
                                <div class="text-[10px] font-black opacity-40 uppercase">Total Perception</div>
                                <div id="dispTotal" class="text-2xl font-black text-green-400">0.00 USD</div>
                            </div>
                        </div>
                        <div class="flex gap-4 p-2 bg-slate-100 rounded-2xl">
                            <label class="flex-1 text-center py-4 rounded-xl cursor-pointer has-[:checked]:bg-white has-[:checked]:shadow-sm border-2 border-transparent transition font-bold text-slate-500 has-[:checked]:text-blue-600">
                                <input type="radio" name="payment_method" value="cash" checked class="hidden" onchange="toggleBankUpload(false)"> CASH 💵
                            </label>
                            <label class="flex-1 text-center py-4 rounded-xl cursor-pointer has-[:checked]:bg-white has-[:checked]:shadow-sm border-2 border-transparent transition font-bold text-slate-500 has-[:checked]:text-blue-600">
                                <input type="radio" name="payment_method" value="bank" class="hidden" onchange="toggleBankUpload(true)"> BANQUE 🏦
                            </label>
                        </div>
                        <div id="bankUpload" class="hidden p-4 bg-blue-50 rounded-2xl border border-blue-100 border-dashed">
                             <span class="text-xs font-bold text-blue-800 block mb-2">Upload du Bordereau de Dépôt <span class="text-red-500">(Max 200 Ko)</span> :</span>
                             <input type="file" name="bank_slip" class="w-full bg-white p-2 rounded-xl" accept=".pdf,image/*" onchange="validateFileSize(this)">
                        </div>
                    </div>
                    <div class="space-y-4">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-widest px-2">2. Bénéficiaire (Destination)</label>
                        <input type="text" name="receiver_name" required placeholder="Nom du Bénéficiaire" class="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition">
                        <div class="flex gap-4">
                            <input type="text" name="receiver_id_number" required placeholder="N° ID / Passeport" class="flex-1 p-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition">
                            <input type="text" name="receiver_phone" required placeholder="N° Téléphone" class="flex-1 p-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition">
                        </div>
                        <input type="text" name="receiver_address" required placeholder="Adresse de Retrait" class="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition">
                        <div id="photoContainer" class="p-8 bg-gold/10 border-4 border-dashed border-gold/30 rounded-3xl text-center group cursor-pointer hover:bg-white transition relative overflow-hidden" style="background-color: #d4af3710; border-color: #d4af3730;">
                            <div id="photoPlaceholder" class="pointer-events-none transition-opacity duration-300">
                                <i class="fas fa-camera text-4xl text-gold mb-4 group-hover:scale-110 transition duration-500" style="color: #d4af37;"></i>
                                <div class="text-sm font-black text-slate-900">CAPTURE PHOTO OBLIGATOIRE</div>
                                <p class="text-xs text-slate-500 mt-1">Cliquer pour uploader la photo (Max 200 Ko)</p>
                            </div>
                            <img id="photoPreview" class="absolute inset-0 w-full h-full object-cover hidden pointer-events-none">
                            <input type="file" id="receiverPhotoInput" name="receiver_photo" required class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" onchange="previewReceiverPhoto(this)">
                        </div>
                    </div>
                </div>
                <button type="submit" <?php echo $isFrozen ? 'disabled' : ''; ?> class="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-2xl shadow-2xl hover:bg-blue-700 transition transform hover:-translate-y-1 <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>"><?php echo $isFrozen ? 'SYSTÈME GELÉ' : 'LANCER LE TRANSFERT SÉCURISÉ'; ?></button>
            </form>
        </div>

        <!-- TRANSACTION TABLE -->
        <div class="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 border-b">
                        <tr>
                            <th class="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Référence / Date</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Acteurs (Exp / Dest)</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Montant / Taxes</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Statut / Payé</th>
                            <th class="px-8 py-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Contrôle Agency</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php if (empty($requests)): ?>
                            <tr>
                                <td colspan="5" class="px-8 py-20 text-center text-slate-400 font-bold">Aucun transfert trouvé pour ces critères.</td>
                            </tr>
                        <?php endif; ?>
                        <?php foreach($requests as $req): ?>
                            <tr class="hover:bg-slate-50/50 transition">
                                <td class="px-8 py-6">
                                    <div class="font-black text-slate-900"><?php echo $req['verification_code'] ?: '<span class="text-slate-300 italic">En attente...</span>'; ?></div>
                                    <div class="text-[10px] font-bold text-slate-400 mt-1"><?php echo date('d M Y H:i', strtotime($req['created_at'])); ?></div>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border-2 border-white ring-1 ring-slate-100">
                                            <img src="<?php echo $req['receiver_photo'] ?: 'https://ui-avatars.com/api/?name='.urlencode($req['receiver_name']); ?>" class="w-full h-full object-cover">
                                        </div>
                                        <div>
                                            <div class="text-xs font-black text-slate-900"><?php echo htmlspecialchars($req['receiver_name']); ?></div>
                                            <div class="text-[10px] font-bold text-blue-500">ID: <?php echo htmlspecialchars($req['receiver_id_number']); ?></div>
                                            <div class="text-[10px] text-slate-400">Exp: <?php echo htmlspecialchars($req['sender_name']); ?></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="text-lg font-black text-slate-900"><?php echo number_format($req['amount'], 2); ?> <span class="text-xs"><?php echo $req['currency']; ?></span></div>
                                    <div class="text-[10px] font-bold text-slate-400">+ Frais <?php echo number_format($req['transfer_fee_amount'], 2); ?></div>
                                </td>
                                <td class="px-8 py-6">
                                    <?php $statusClasses = ['Pending' => 'bg-amber-100 text-amber-700', 'Ready' => 'bg-emerald-100 text-emerald-700', 'Paid' => 'bg-blue-100 text-blue-700']; ?>
                                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase <?php echo $statusClasses[$req['payout_status']] ?? 'bg-slate-100'; ?>">
                                        <?php echo $req['payout_status']; ?>
                                    </span>
                                    <?php if ($req['payment_verification_status'] === 'pending'): ?>
                                        <button onclick="<?php echo $isFrozen ? '' : 'openBankVerifyModal(' . $req['id'] . ', \'' . $req['bank_slip_proof'] . '\')'; ?>" class="mt-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase hover:bg-red-100 transition flex items-center gap-2 shadow-sm w-full justification-center <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>">
                                            <i class="fas fa-search-dollar"></i> <?php echo $isFrozen ? 'GELÉ : VÉRIF BLOQUÉE' : 'BORDEREAU À VÉRIFIER'; ?>
                                        </button>
                                    <?php endif; ?>
                                </td>
                                <td class="px-8 py-6 text-right">
                                    <?php if ($req['payout_status'] === 'Ready'): ?>
                                        <button onclick="<?php echo $isFrozen ? '' : 'open3PointGate(' . $req['id'] . ', \'' . $req['receiver_name'] . '\', \'' . $req['receiver_id_number'] . '\', \'' . $req['receiver_phone'] . '\', \'' . $req['receiver_photo'] . '\', \'' . $req['amount_to_receive'] . ' ' . $req['currency'] . '\')'; ?>" class="bg-amber-400 text-navy px-6 py-2 rounded-xl font-black text-xs shadow-lg hover:bg-amber-500 transition active:scale-95 <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>" style="background-color: <?php echo $isFrozen ? '#ccc' : '#d4af37'; ?>; color: #0a2342;">
                                            <?php echo $isFrozen ? 'PAIEMENT GELÉ' : 'VÉRIFIER & PAYER'; ?>
                                        </button>
                                    <?php elseif ($req['payout_status'] === 'Paid'): ?>
                                        <div class="text-emerald-600 font-bold text-xs"><i class="fas fa-check-double mr-1"></i>DÉCAISSEMENT TERMINÉ</div>
                                    <?php else: ?>
                                        <span class="text-slate-300 text-xs italic">Versement en attente</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <!-- PAGINATION -->
            <?php if ($totalPages > 1): ?>
                <div class="px-8 py-8 border-t flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
                    <p class="text-xs font-bold text-slate-500">Affichage de <?php echo count($requests); ?> sur <?php echo $totalRecords; ?> transferts</p>
                    <div class="flex gap-2">
                        <?php for($i = 1; $i <= $totalPages; $i++): ?>
                            <a href="?page=<?php echo $i; ?>&search=<?php echo urlencode($search); ?>&status=<?php echo $statusFilter; ?>&method=<?php echo $methodFilter; ?>" class="w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs transition <?php echo $page == $i ? 'bg-blue-600 text-white shadow-xl' : 'bg-white text-slate-600 hover:bg-slate-200'; ?>">
                                <?php echo $i; ?>
                            </a>
                        <?php endfor; ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- FINANCIAL REPORT MODAL -->
    <div id="reportModal" class="fixed inset-0 bg-slate-900/90 backdrop-blur-sm hidden z-50 flex items-center justify-center p-6">
        <div class="bg-white rounded-[3rem] shadow-3xl w-full max-w-2xl overflow-hidden animate-zoom-in">
            <div class="bg-slate-900 p-8 text-white flex justify-between items-center">
                <div>
                    <h3 class="text-2xl font-black mb-1">Centre de Rapports</h3>
                    <p class="text-blue-400 font-bold text-[10px] uppercase tracking-widest">Générer des statistiques précises</p>
                </div>
                <button onclick="toggleReportModal()" class="text-white/50 hover:text-white"><i class="fas fa-times text-xl"></i></button>
            </div>
            
            <div class="p-8">
                <div class="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Du (Date Début)</label>
                        <input type="date" id="reportStart" value="<?php echo date('Y-m-01'); ?>" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 transition">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Au (Date Fin)</label>
                        <input type="date" id="reportEnd" value="<?php echo date('Y-m-t'); ?>" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 transition">
                    </div>
                </div>

                <div class="mb-8">
                    <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Ou par Année Entière</label>
                    <select id="reportYear" class="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 transition font-bold">
                        <option value="">-- Choisir une année --</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                    </select>
                </div>

                <!-- Summary Display -->
                <div id="reportSummary" class="hidden mb-8 space-y-3">
                    <h4 class="text-xs font-black text-slate-900 uppercase tracking-widest border-b pb-2">Prévisualisation (Transferts Payés)</h4>
                    <div id="summaryContent" class="space-y-2">
                        <!-- Dynamic Content -->
                    </div>
                </div>

                <div class="flex gap-4">
                    <button onclick="generateSummary()" class="flex-1 py-5 bg-blue-100 text-blue-700 font-black rounded-2xl hover:bg-blue-200 transition">
                        <i class="fas fa-sync-alt mr-2"></i> CALCULER
                    </button>
                    <button onclick="exportReport()" class="flex-1 py-5 bg-emerald-100 text-emerald-700 font-black rounded-2xl hover:bg-emerald-200 transition">
                        <i class="fas fa-file-csv mr-2"></i> CSV
                    </button>
                    <button onclick="generatePDF()" class="flex-1 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-500/20">
                        <i class="fas fa-file-pdf mr-2"></i> PDF
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 3-POINT DISBURSEMENT GATE -->
    <div id="gateModal" class="fixed inset-0 bg-gray-900/90 backdrop-blur-sm hidden z-50 flex items-center justify-center p-6">
        <div class="bg-white rounded-[3rem] shadow-3xl w-full max-w-2xl overflow-hidden animate-zoom-in">
            <div class="bg-slate-900 p-10 text-white flex justify-between items-center">
                <div>
                    <h3 class="text-3xl font-black mb-1">Gate Keeper Gate</h3>
                    <p class="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">Verify identity - Confirm ID - Enter Code</p>
                </div>
                <i class="fas fa-user-shield text-5xl text-blue-500"></i>
            </div>
            <div class="p-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                    <div class="space-y-4">
                        <div class="p-5 bg-slate-50 rounded-2xl border">
                            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Bénéficiaire Attendu</label>
                            <div class="text-xl font-black text-slate-900" id="gateReceiver"></div>
                            <div class="text-sm font-bold text-blue-600" id="gateID"></div>
                            <div class="text-xs text-slate-400" id="gatePhone"></div>
                        </div>
                        <div class="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <label class="block text-[10px] font-black text-emerald-800 uppercase mb-1">Espèces à Remettre</label>
                            <div class="text-4xl font-black text-emerald-700" id="gateAmount"></div>
                        </div>
                    </div>
                    <div>
                        <div class="relative rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white transform -rotate-1">
                            <img id="gatePhoto" src="" class="w-full h-56 object-cover">
                            <div class="absolute bottom-0 inset-x-0 p-3 bg-slate-900/80 text-white text-[10px] font-black text-center uppercase">Vérification Visuelle</div>
                        </div>
                    </div>
                </div>
                <form method="POST" class="space-y-8">
                    <input type="hidden" name="action" value="disburse_payout">
                    <input type="hidden" name="request_id" id="gateRequestId">
                    <div>
                        <label class="block text-xs font-black text-slate-400 uppercase text-center mb-4 tracking-[0.3em]">Code Secret Présenté par le Client</label>
                        <input type="text" name="secret_code" required placeholder="SU-XXX-XXX" class="w-full text-center py-6 text-5xl font-mono font-black border-4 border-slate-200 rounded-3xl bg-slate-50 focus:border-blue-500 focus:bg-white transition outline-none tracking-widest uppercase">
                    </div>
                    <div class="flex gap-4">
                        <button type="button" onclick="closeGate()" class="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl">ANNULER</button>
                        <button type="submit" <?php echo $isFrozen ? 'disabled' : ''; ?> class="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-blue-700 transition <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>"><?php echo $isFrozen ? 'PAIEMENT BLOQUÉ (GELÉ)' : 'AUTORISER LE PAIEMENT'; ?></button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        const feePercent = <?php echo $globalFeePercent; ?>;
        function toggleForm() { document.getElementById('transferForm').classList.toggle('hidden'); }
        function toggleBankUpload(show) { document.getElementById('bankUpload').classList.toggle('hidden', !show); }
        function calculateFees() {
            const amt = parseFloat(document.getElementById('formAmount').value) || 0;
            const fee = (amt * feePercent) / 100;
            const total = amt + fee;
            document.getElementById('dispFee').innerText = fee.toFixed(2) + ' USD';
            document.getElementById('dispTotal').innerText = total.toFixed(2) + ' USD';
        }
        function open3PointGate(id, name, idNum, phone, photo, amount) {
            document.getElementById('gateRequestId').value = id;
            document.getElementById('gateReceiver').innerText = name;
            document.getElementById('gateID').innerText = idNum;
            document.getElementById('gatePhone').innerText = phone;
            document.getElementById('gateAmount').innerText = amount;
            document.getElementById('gatePhoto').src = photo || 'https://ui-avatars.com/api/?name='+encodeURIComponent(name);
            document.getElementById('gateModal').classList.remove('hidden');
        }
        function closeGate() { document.getElementById('gateModal').classList.add('hidden'); }

        // Reporting Logic
        function toggleReportModal() {
            document.getElementById('reportModal').classList.toggle('hidden');
        }

        async function generateSummary() {
            const start = document.getElementById('reportStart').value;
            const end = document.getElementById('reportEnd').value;
            const year = document.getElementById('reportYear').value;
            
            const btn = event.currentTarget;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> CALCUL...';
            
            try {
                const res = await fetch(`../handlers/financial-report.php?action=summary&start_date=${start}&end_date=${end}&year=${year}`);
                const data = await res.json();
                
                if (data.success) {
                    const container = document.getElementById('summaryContent');
                    document.getElementById('reportSummary').classList.remove('hidden');
                    
                    if (data.data.length === 0) {
                        container.innerHTML = '<p class="text-sm font-bold text-slate-400 italic">Aucune donnée pour cette période.</p>';
                    } else {
                        container.innerHTML = data.data.map(row => `
                            <div class="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border">
                                <div>
                                    <div class="text-[10px] font-black text-slate-400 uppercase">${row.currency}</div>
                                    <div class="text-lg font-black text-slate-900">${parseFloat(row.total_transferred).toLocaleString()} ${row.currency}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-[10px] font-black text-blue-400 uppercase">Frais Récoltés</div>
                                    <div class="text-lg font-black text-blue-600">${parseFloat(row.total_fees).toLocaleString()} ${row.currency}</div>
                                    <div class="text-[9px] font-bold text-slate-400">${row.transaction_count} transactions</div>
                                </div>
                            </div>
                        `).join('');
                    }
                }
            } catch (e) { console.error(e); }
            finally { btn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i> CALCULER'; }
        }

        function exportReport() {
            const start = document.getElementById('reportStart').value;
            const end = document.getElementById('reportEnd').value;
            const year = document.getElementById('reportYear').value;
            window.location.href = `../handlers/financial-report.php?action=export&start_date=${start}&end_date=${end}&year=${year}`;
        }

        function generatePDF() {
            const start = document.getElementById('reportStart').value;
            const end = document.getElementById('reportEnd').value;
            const year = document.getElementById('reportYear').value;
            window.open(`print-report.php?start_date=${start}&end_date=${end}&year=${year}`, '_blank');
        }

        function openBankVerifyModal(requestId, slipUrl) {
            document.getElementById('bankRequestId').value = requestId;
            const previewImg = document.getElementById('bankSlipPreview');
            const previewPdf = document.getElementById('bankSlipPdf');
            const link = document.getElementById('bankSlipLink');

            // Detect if file is PDF
            const isPdf = slipUrl.toLowerCase().endsWith('.pdf');

            if (isPdf) {
                previewImg.classList.add('hidden');
                previewPdf.src = slipUrl;
                previewPdf.classList.remove('hidden');
            } else {
                previewPdf.classList.add('hidden');
                previewImg.src = slipUrl;
                previewImg.classList.remove('hidden');
            }

            link.href = slipUrl;
            document.getElementById('bankVerifyModal').classList.remove('hidden');
        }
        function closeBankModal() {
            document.getElementById('bankVerifyModal').classList.add('hidden');
            // Clear src to stop playing/downloading
            document.getElementById('bankSlipPreview').src = '';
            document.getElementById('bankSlipPdf').src = '';
        }

        function validateFileSize(input) {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                if (file.size > 200 * 1024) { // 200KB limit check
                    alert("Attention : Le fichier dépasse la taille maximale autorisée (200 Ko). Veuillez choisir un fichier plus léger.");
                    input.value = ''; // Clear input
                    return false;
                }
                return true;
            }
            return true;
        }

        function previewReceiverPhoto(input) {
            if (!validateFileSize(input)) return;

            if (input.files && input.files[0]) {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('photoPreview');
                    const placeholder = document.getElementById('photoPlaceholder');
                    const container = document.getElementById('photoContainer');
                    
                    preview.src = e.target.result;
                    preview.classList.remove('hidden');
                    placeholder.classList.add('opacity-0');
                    
                    container.classList.remove('border-gold/30', 'bg-gold/10');
                    container.classList.add('border-green-500', 'bg-green-50');
                }
                reader.readAsDataURL(file);
            }
        }
    </script>
    
    <!-- BANK VERIFICATION MODAL -->
    <div id="bankVerifyModal" class="fixed inset-0 bg-slate-900/90 backdrop-blur-sm hidden z-50 flex items-center justify-center p-6">
        <div class="bg-white rounded-[2.5rem] shadow-3xl w-full max-w-lg overflow-hidden animate-zoom-in">
            <div class="bg-slate-50 p-6 border-b flex justify-between items-center">
                <h3 class="text-xl font-black text-slate-900 flex items-center gap-2">
                    <i class="fas fa-university text-blue-600"></i> Vérification Bancaire
                </h3>
                <button onclick="closeBankModal()" class="w-10 h-10 rounded-xl hover:bg-slate-200 flex items-center justify-center transition"><i class="fas fa-times"></i></button>
            </div>
            <div class="p-8">
                <div class="mb-6 bg-slate-100 rounded-2xl p-4 border overflow-hidden">
                    <p class="text-[10px] font-black text-slate-400 uppercase mb-2">Aperçu du Bordereau</p>
                    
                    <!-- Image Preview -->
                    <img id="bankSlipPreview" src="" class="w-full h-48 object-cover rounded-xl mb-3 cursor-zoom-in hidden" onclick="window.open(this.src, '_blank')">
                    
                    <!-- PDF Preview -->
                    <iframe id="bankSlipPdf" src="" class="w-full h-64 rounded-xl mb-3 border hidden"></iframe>
                    
                    <a id="bankSlipLink" href="" target="_blank" class="block text-center text-blue-600 font-bold text-xs hover:underline">Voir le fichier complet <i class="fas fa-external-link-alt ml-1"></i></a>
                </div>
                <form method="POST">
                    <input type="hidden" name="action" value="verify_bank">
                    <input type="hidden" id="bankRequestId" name="request_id" value="">
                    <button type="submit" <?php echo $isFrozen ? 'disabled' : ''; ?> class="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-700 transition transform active:scale-95 <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>">
                        <?php echo $isFrozen ? 'ACTION BLOQUÉE (SYSTÈME GELÉ)' : 'DECLARER VALIDE & GÉNÉRER CODE'; ?>
                    </button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
