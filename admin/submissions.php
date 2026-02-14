<?php
/**
 * SULOC Admin - Contact Submissions
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();
$message = '';
$messageType = '';

// Handle status updates or deletion if needed (future feature)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action === 'delete') {
        $id = intval($_POST['id']);
        $stmt = $pdo->prepare("DELETE FROM contact_submissions WHERE id = ?");
        $stmt->execute([$id]);
        $message = "Message supprimé avec succès.";
        $messageType = "success";
    }
    if ($action === 'mark_read') {
        $id = intval($_POST['id']);
        $stmt = $pdo->prepare("UPDATE contact_submissions SET status = 'read' WHERE id = ?");
        $stmt->execute([$id]);
        $message = "Message marqué comme lu.";
        $messageType = "success";
    }
}

// Fetch submissions
$stmt = $pdo->query("SELECT * FROM contact_submissions ORDER BY created_at DESC");
$submissions = $stmt->fetchAll();

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demandes de Devis - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>

    <div class="container mx-auto px-6 py-8">
        <h1 class="text-3xl font-bold text-blue-900 mb-8">Demandes de Devis & Contact</h1>

        <?php if ($message): ?>
            <div class="bg-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-100 border border-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-400 text-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-700 px-4 py-3 rounded mb-6">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-blue-900 text-white">
                        <tr>
                            <th class="px-6 py-4 text-left">Date</th>
                            <th class="px-6 py-4 text-left">Client</th>
                            <th class="px-6 py-4 text-left">Service</th>
                            <th class="px-6 py-4 text-left">Message</th>
                            <th class="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <?php if (empty($submissions)): ?>
                            <tr>
                                <td colspan="5" class="px-6 py-8 text-center text-gray-500">Aucune demande reçue pour le moment.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($submissions as $sub): ?>
                                <tr class="hover:bg-gray-50 transition <?php echo $sub['status'] === 'new' ? 'bg-blue-50' : ''; ?>">
                                    <td class="px-6 py-4 text-sm text-gray-600">
                                        <?php echo date('d/m/Y H:i', strtotime($sub['created_at'])); ?>
                                        <?php if($sub['status'] === 'new'): ?>
                                            <span class="inline-block px-2 py-0.5 text-xs font-bold bg-green-100 text-green-800 rounded-full ml-2">Nouveau</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="font-bold text-gray-900"><?php echo htmlspecialchars($sub['name']); ?></div>
                                        <div class="text-sm text-gray-500"><?php echo htmlspecialchars($sub['email']); ?></div>
                                        <div class="text-sm text-gray-500 font-mono"><?php echo htmlspecialchars($sub['phone']); ?></div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                                            <?php echo htmlspecialchars($sub['service_type']); ?>
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="text-sm text-gray-700 max-w-xs truncate" title="<?php echo htmlspecialchars($sub['message']); ?>">
                                            <?php echo htmlspecialchars($sub['message']); ?>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-center">
                                        <div class="flex justify-center space-x-2">
                                            <?php
                                            // Format phone for WhatsApp (remove spaces, ensure international format)
                                            $waPhone = preg_replace('/[^0-9]/', '', $sub['phone']);
                                            $waMessage = "Bonjour " . explode(' ', trim($sub['name']))[0] . ", merci de nous avoir contactés concernant votre projet *" . $sub['service_type'] . "*. Comment pouvons-nous vous aider ?";
                                            $waLink = "https://wa.me/" . $waPhone . "?text=" . urlencode($waMessage);
                                            ?>
                                            <a href="<?php echo $waLink; ?>" target="_blank" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center shadow-sm">
                                                <i class="fab fa-whatsapp mr-2"></i> Répondre
                                            </a>
                                            
                                            <form method="POST" onsubmit="return confirm('Supprimer ce message ?');">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="id" value="<?php echo $sub['id']; ?>">
                                                <button type="submit" class="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </form>
                                            
                                            <?php if($sub['status'] === 'new'): ?>
                                            <form method="POST">
                                                <input type="hidden" name="action" value="mark_read">
                                                <input type="hidden" name="id" value="<?php echo $sub['id']; ?>">
                                                <button type="submit" class="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition" title="Marquer comme lu">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                            </form>
                                            <?php endif; ?>
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
