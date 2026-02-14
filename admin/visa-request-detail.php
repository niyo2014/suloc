<?php
/**
 * SULOC Admin - Visa Request Detail & Management
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();
$id = intval($_GET['id'] ?? 0);

$isFrozen = isModuleFrozen('visa') && ($_SESSION['admin_role'] ?? '') !== 'creator';
$frozenBadge = $isFrozen ? '<span class="ml-4 px-4 py-2 bg-red-100 text-red-600 rounded-xl text-xs font-black uppercase inline-flex items-center gap-2 animate-pulse"><i class="fas fa-snowflake"></i> Système Gelé</span>' : '';

if (!$id) {
    header('Location: visa-assistance-requests.php');
    exit;
}

// Handle Status & Notes Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_request'])) {
    // SECURITY CHECK: Module Freeze
    if (isModuleFrozen('visa') && $_SESSION['admin_role'] !== 'creator') {
        $errorMsg = "ERREUR : Le module Visa est actuellement GELÉ. Aucune modification (statut, notes) n'est permise.";
    } else {
        $status = sanitizeInput($_POST['status']);
    $adminNotes = sanitizeInput($_POST['admin_notes']);
    $checklist = $_POST['checklist'] ?? [];
    
    try {
        $stmt = $pdo->prepare("UPDATE visa_assistance_requests SET status = ?, admin_notes = ?, checklist_status = ?, assigned_agent_id = ? WHERE id = ?");
        $stmt->execute([$status, $adminNotes, json_encode($checklist), $_POST['assigned_agent_id'] ?: null, $id]);
        
        // Log action
        $logStmt = $pdo->prepare("INSERT INTO visa_assistance_logs (request_id, admin_id, action_type, action_description) VALUES (?, ?, 'status_update', ?)");
        $logStmt->execute([$id, $_SESSION['admin_id'], "Statut/Détails mis à jour. Nouveau statut: " . $status]);
        
        $successMsg = "Demande mise à jour avec succès.";
    } catch (Exception $e) {
        $errorMsg = "Erreur: " . $e->getMessage();
    }
    } // End freeze check
}

// Fetch Admins for assignment
$admins = $pdo->query("SELECT id, full_name, username FROM admin_users WHERE is_active = 1")->fetchAll();

// Fetch Notification Templates
$settingsStmt = $pdo->query("SELECT * FROM visa_assistance_settings");
$notificationTemplates = [];
while ($row = $settingsStmt->fetch()) {
    $notificationTemplates[$row['setting_key']] = $row['setting_value'];
}

// Fetch Request Detail
$stmt = $pdo->prepare("SELECT * FROM visa_assistance_requests WHERE id = ?");
$stmt->execute([$id]);
$request = $stmt->fetch();

if (!$request) {
    header('Location: visa-assistance-requests.php');
    exit;
}

// Fetch Documents
$docStmt = $pdo->prepare("SELECT * FROM visa_assistance_docs WHERE request_id = ?");
$docStmt->execute([$id]);
$documents = $docStmt->fetchAll();

// Fetch Logs
$logStmt = $pdo->prepare("SELECT v.*, a.full_name as admin_name FROM visa_assistance_logs v LEFT JOIN admin_users a ON v.admin_id = a.id WHERE request_id = ? ORDER BY created_at DESC");
$logStmt->execute([$id]);
$logs = $logStmt->fetchAll();

// Checklist Template
$checklistItems = [
    'passport' => 'Passeport valide (> 6 mois)',
    'photo' => 'Photos d\'identité conformes',
    'form' => 'Formulaire de demande signé',
    'invitation' => 'Lettre d\'invitation / Réservation hôtel',
    'insurance' => 'Assurance voyage',
    'proof_funds' => 'Preuve de moyens financiers',
    'itinerary' => 'Itinéraire de vol',
];
$currentChecklist = json_decode($request['checklist_status'] ?? '{}', true);

$statuses = [
    'received' => 'Reçue',
    'analyzing' => 'En cours d\'analyse',
    'docs_incomplete' => 'Documents incomplets',
    'docs_complete' => 'Dossier complet',
    'submitted' => 'Déposé',
    'pending_response' => 'En attente de réponse',
    'accepted' => 'Accepté',
    'rejected' => 'Refusé',
    'closed' => 'Clôturé'
];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Détail Demande #<?php echo $id; ?> - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>
    
    <div class="container mx-auto px-6 py-8">
        <div class="mb-6 flex items-center justify-between">
            <a href="visa-assistance-requests.php" class="text-blue-900 hover:text-blue-700 font-semibold flex items-center">
                <i class="fas fa-arrow-left mr-2"></i> Retour à la liste
            </a>
            <div class="space-x-2">
                <a href="https://wa.me/<?php echo preg_replace('/[^0-9]/', '', $request['phone']); ?>" target="_blank" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    <i class="fab fa-whatsapp mr-2"></i> WhatsApp
                </a>
                <a href="mailto:<?php echo $request['email']; ?>" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <i class="fas fa-envelope mr-2"></i> Email
                </a>
            </div>
        </div>

        <?php if (isset($successMsg)): ?>
            <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8"><?php echo $successMsg; ?></div>
        <?php endif; ?>

        <div class="grid lg:grid-cols-3 gap-8">
            <!-- Left Column: Info & Management -->
            <div class="lg:col-span-2 space-y-8">
                <!-- Customer info card -->
                <div class="bg-white rounded-xl shadow-md p-8">
                    <h2 class="text-2xl font-bold text-blue-900 mb-6 border-b pb-4 flex items-center">Informations de la demande <?php echo $frozenBadge; ?></h2>
                    <div class="grid md:grid-cols-2 gap-y-6 gap-x-12">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Client</label>
                            <p class="text-lg font-bold text-gray-800"><?php echo htmlspecialchars($request['full_name']); ?></p>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Coordonnées</label>
                            <p class="text-gray-800"><?php echo htmlspecialchars($request['phone']); ?></p>
                            <p class="text-sm text-blue-600"><?php echo htmlspecialchars($request['email']); ?></p>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Destination</label>
                            <p class="text-lg font-semibold text-blue-900"><?php echo htmlspecialchars($request['origin_country']); ?> <i class="fas fa-plane mx-2 text-xs opacity-50"></i> <?php echo htmlspecialchars($request['destination_country']); ?></p>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Type de Visa</label>
                            <span class="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm border border-blue-100"><?php echo ucfirst($request['visa_type']); ?></span>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Dates & Durée</label>
                            <p class="text-gray-800">Départ: <?php echo $request['departure_date'] ? date('d/m/Y', strtotime($request['departure_date'])) : 'Non précisé'; ?></p>
                            <p class="text-sm text-gray-600">Durée: <?php echo htmlspecialchars($request['duration_stay'] ?: '-'); ?></p>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Objectif</label>
                            <p class="text-sm text-gray-700 italic"><?php echo nl2br(htmlspecialchars($request['travel_purpose'] ?: 'Aucun détail fourni')); ?></p>
                        </div>
                    </div>
                </div>

                <!-- Management Form -->
                <div class="bg-white rounded-xl shadow-md p-8 border-t-4 border-blue-900">
                    <h2 class="text-2xl font-bold text-blue-900 mb-6">Gestion & Statut</h2>
                    <form method="POST" class="space-y-6">
                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Statut de la demande</label>
                                <select name="status" id="status-select" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition">
                                    <?php foreach ($statuses as $val => $label): ?>
                                        <option value="<?php echo $val; ?>" <?php echo $request['status'] === $val ? 'selected' : ''; ?>><?php echo $label; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Agent Assigné</label>
                                <select name="assigned_agent_id" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition">
                                    <option value="">Non assigné</option>
                                    <?php foreach ($admins as $admin): ?>
                                        <option value="<?php echo $admin['id']; ?>" <?php echo $request['assigned_agent_id'] == $admin['id'] ? 'selected' : ''; ?>>
                                            <?php echo htmlspecialchars($admin['full_name'] ?: $admin['username']); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>

                        <!-- Notification Trigger -->
                        <div id="notification-preview" class="bg-indigo-50 p-6 rounded-xl border border-indigo-100 hidden">
                            <h4 class="text-sm font-bold text-indigo-900 mb-3 flex items-center">
                                <i class="fas fa-comment-dots mr-2"></i> Message de notification suggéré
                            </h4>
                            <p id="preview-text" class="text-sm text-indigo-800 italic mb-4"></p>
                            <div class="flex space-x-3">
                                <button type="button" id="copy-whatsapp" class="bg-white text-indigo-900 px-4 py-2 rounded-lg text-xs font-bold border border-indigo-200 hover:bg-white/80 transition shadow-sm">
                                    <i class="fab fa-whatsapp mr-1"></i> Préparer WhatsApp
                                </button>
                            </div>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Checklist Documentaire</label>
                                <div class="space-y-2 max-h-48 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                                    <?php foreach ($checklistItems as $key => $label): ?>
                                        <label class="flex items-center space-x-3 cursor-pointer">
                                            <input type="checkbox" name="checklist[<?php echo $key; ?>]" value="1" <?php echo isset($currentChecklist[$key]) ? 'checked' : ''; ?> class="w-5 h-5 rounded text-blue-900 focus:ring-blue-900">
                                            <span class="text-sm text-gray-700"><?php echo $label; ?></span>
                                        </label>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Notes Internes</label>
                                <textarea name="admin_notes" rows="6" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition" placeholder="Commentaires internes..."><?php echo htmlspecialchars($request['admin_notes']); ?></textarea>
                            </div>
                        </div>

                        <div class="flex justify-end">
                            <button type="submit" name="update_request" <?php echo $isFrozen ? 'disabled' : ''; ?> class="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>">
                                <?php echo $isFrozen ? 'MODIFICATIONS BLOQUÉES (GELÉ)' : 'Enregistrer les modifications'; ?>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Right Column: Documents & Logs -->
            <div class="space-y-8">
                <!-- Documents Card -->
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h3 class="text-xl font-bold text-blue-900 mb-4 flex items-center">
                        <i class="fas fa-file-alt mr-2 text-gold"></i> Documents Téléversés
                    </h3>
                    <?php if (empty($documents)): ?>
                        <p class="text-sm text-gray-500 italic">Aucun document joint.</p>
                    <?php else: ?>
                        <div class="space-y-3">
                            <?php foreach ($documents as $doc): ?>
                                <a href="../uploads/visa_docs/<?php echo $doc['file_path']; ?>" target="_blank" class="flex items-center p-3 border rounded-lg hover:bg-blue-50 transition group">
                                    <div class="bg-blue-100 text-blue-600 p-2 rounded mr-3">
                                        <i class="fas fa-download"></i>
                                    </div>
                                    <div class="overflow-hidden">
                                        <p class="text-sm font-semibold text-gray-800 truncate"><?php echo htmlspecialchars($doc['file_name']); ?></p>
                                        <p class="text-xs text-gray-500"><?php echo round($doc['file_size'] / 1024, 1); ?> KB</p>
                                    </div>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- History Logs -->
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h3 class="text-xl font-bold text-blue-900 mb-4 flex items-center">
                        <i class="fas fa-history mr-2 text-gold"></i> Historique
                    </h3>
                    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        <?php foreach ($logs as $log): ?>
                            <div class="border-l-2 border-blue-100 pl-4 py-1">
                                <p class="text-xs text-gray-400 font-bold"><?php echo date('d/m/Y H:i', strtotime($log['created_at'])); ?></p>
                                <p class="text-sm text-gray-800"><?php echo htmlspecialchars($log['action_description']); ?></p>
                                <?php if ($log['admin_name']): ?>
                                    <p class="text-[10px] text-blue-600">Par: <?php echo htmlspecialchars($log['admin_name']); ?></p>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
    const templates = <?php echo json_encode($notificationTemplates); ?>;
    const clientName = <?php echo json_encode($request['full_name']); ?>;
    const destination = <?php echo json_encode($request['destination_country']); ?>;
    const phone = <?php echo json_encode(preg_replace('/[^0-9]/', '', $request['phone'])); ?>;

    const statusSelect = document.getElementById('status-select');
    const previewDiv = document.getElementById('notification-preview');
    const previewText = document.getElementById('preview-text');
    const whatsappBtn = document.getElementById('copy-whatsapp');

    function updatePreview() {
        const status = statusSelect.value;
        let templateKey = '';
        
        if (status === 'received') templateKey = 'template_received';
        else if (status === 'docs_incomplete') templateKey = 'template_docs_incomplete';
        else if (status === 'docs_complete') templateKey = 'template_docs_complete';
        else if (status === 'accepted' || status === 'rejected') templateKey = 'template_result';

        if (templateKey && templates[templateKey]) {
            let msg = templates[templateKey]
                .replace('{client_name}', clientName)
                .replace('{destination}', destination);
            
            previewText.textContent = msg;
            previewDiv.classList.remove('hidden');
        } else {
            previewDiv.classList.add('hidden');
        }
    }

    statusSelect.addEventListener('change', updatePreview);
    whatsappBtn.addEventListener('click', function() {
        const text = encodeURIComponent(previewText.textContent);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });

    // Initial check
    updatePreview();
    </script>
</body>
</html>
