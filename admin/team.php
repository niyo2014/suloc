<?php
/**
 * SULOC Admin - Team Management
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();

function ensureTeamSchema(PDO $pdo): void {
    $columnsToAdd = [
        'photo_url' => "ALTER TABLE team_members ADD COLUMN photo_url VARCHAR(500)"
    ];

    try {
        $existingColumns = $pdo->query("SHOW COLUMNS FROM team_members")->fetchAll(PDO::FETCH_COLUMN);
    } catch (Exception $e) {
        error_log("Unable to inspect team_members table: " . $e->getMessage());
        return;
    }

    foreach ($columnsToAdd as $column => $sql) {
        if (!in_array($column, $existingColumns, true)) {
            try {
                $pdo->exec($sql);
            } catch (Exception $e) {
                error_log("Failed to add column {$column}: " . $e->getMessage());
            }
        }
    }
}

ensureTeamSchema($pdo);
$message = '';
$messageType = '';

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'add' || $action === 'edit') {
        $id = $_POST['id'] ?? null;
        $name = sanitizeInput($_POST['name'] ?? '');
        $role = sanitizeInput($_POST['role'] ?? '');
        $description = sanitizeInput($_POST['description'] ?? '');
        $icon = sanitizeInput($_POST['icon'] ?? 'fas fa-user');
        $order_index = intval($_POST['order_index'] ?? 0);
        $is_active = isset($_POST['is_active']) ? 1 : 0;
        $photo_url = sanitizeInput($_POST['photo_url'] ?? '');

        if (isset($_FILES['photo_file']) && $_FILES['photo_file']['error'] === UPLOAD_ERR_OK) {
            $uploadType = 'team';
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (in_array($_FILES['photo_file']['type'], $allowedTypes) && $_FILES['photo_file']['size'] <= 5 * 1024 * 1024) {
                $uploadDir = UPLOAD_PATH . '/' . $uploadType . '/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                $extension = pathinfo($_FILES['photo_file']['name'], PATHINFO_EXTENSION);
                $filename = uniqid('team_', true) . '.' . $extension;
                $filepath = $uploadDir . $filename;
                if (move_uploaded_file($_FILES['photo_file']['tmp_name'], $filepath)) {
                    $photo_url = UPLOAD_URL . '/' . $uploadType . '/' . $filename;
                }
            }
        }
        
        try {
            if ($action === 'add') {
                $stmt = $pdo->prepare("INSERT INTO team_members (name, role, description, icon, order_index, is_active, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$name, $role, $description, $icon, $order_index, $is_active, $photo_url]);
                $message = 'Membre ajouté avec succès!';
            } else {
                $stmt = $pdo->prepare("UPDATE team_members SET name = ?, role = ?, description = ?, icon = ?, order_index = ?, is_active = ?, photo_url = ? WHERE id = ?");
                $stmt->execute([$name, $role, $description, $icon, $order_index, $is_active, $photo_url, $id]);
                $message = 'Membre modifié avec succès!';
            }
            $messageType = 'success';
        } catch (Exception $e) {
            $message = 'Erreur: ' . $e->getMessage();
            $messageType = 'error';
        }
    } elseif ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        try {
            $stmt = $pdo->prepare("DELETE FROM team_members WHERE id = ?");
            $stmt->execute([$id]);
            $message = 'Membre supprimé avec succès!';
            $messageType = 'success';
        } catch (Exception $e) {
            $message = 'Erreur: ' . $e->getMessage();
            $messageType = 'error';
        }
    }
}

// Get team members
$teamMembers = $pdo->query("SELECT * FROM team_members ORDER BY order_index ASC, id DESC")->fetchAll();

// Get member to edit
$editMember = null;
if (isset($_GET['edit'])) {
    $id = intval($_GET['edit']);
    $stmt = $pdo->prepare("SELECT * FROM team_members WHERE id = ?");
    $stmt->execute([$id]);
    $editMember = $stmt->fetch();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion de l'Équipe - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>
    
    <div class="container mx-auto px-6 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-blue-900">Gestion de l'Équipe</h1>
            <a href="?action=add" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                <i class="fas fa-plus mr-2"></i>Ajouter un Membre
            </a>
        </div>
        
        <?php if ($message): ?>
        <div class="bg-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-100 border border-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-400 text-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-700 px-4 py-3 rounded mb-4">
            <?php echo htmlspecialchars($message); ?>
        </div>
        <?php endif; ?>
        
<?php if ((isset($_GET['action']) && $_GET['action'] === 'add') || $editMember): ?>
        <!-- Add/Edit Form -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-bold text-blue-900 mb-6"><?php echo $editMember ? 'Modifier' : 'Ajouter'; ?> un Membre</h2>
            <form method="POST" action="" enctype="multipart/form-data">
                <input type="hidden" name="action" value="<?php echo $editMember ? 'edit' : 'add'; ?>">
                <?php if ($editMember): ?><input type="hidden" name="id" value="<?php echo $editMember['id']; ?>"><?php endif; ?>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Nom *</label>
                        <input type="text" name="name" required value="<?php echo htmlspecialchars($editMember['name'] ?? ''); ?>" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Rôle</label>
                        <input type="text" name="role" value="<?php echo htmlspecialchars($editMember['role'] ?? ''); ?>" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Photo du Membre</label>
                        <div class="space-y-3">
                            <input type="file" name="photo_file" accept="image/*" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <input type="url" name="photo_url" value="<?php echo htmlspecialchars($editMember['photo_url'] ?? ''); ?>" 
                                   placeholder="https://example.com/photo.jpg" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <?php if (!empty($editMember['photo_url'])): ?>
                            <div class="mt-2">
                                <img src="<?php echo htmlspecialchars($editMember['photo_url']); ?>" alt="Photo membre" class="h-32 rounded-lg object-cover border">
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Ordre d'affichage</label>
                        <input type="number" name="order_index" value="<?php echo $editMember['order_index'] ?? 0; ?>" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="block text-gray-700 font-semibold mb-2">Description</label>
                    <textarea name="description" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editMember['description'] ?? ''); ?></textarea>
                </div>
                
                <div class="mb-6">
                    <label class="flex items-center">
                        <input type="checkbox" name="is_active" <?php echo ($editMember['is_active'] ?? 1) ? 'checked' : ''; ?> class="mr-2">
                        <span>Membre actif</span>
                    </label>
                </div>
                
                <div class="flex space-x-4">
                    <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                        <i class="fas fa-save mr-2"></i>Enregistrer
                    </button>
                    <a href="team.php" class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition">
                        Annuler
                    </a>
                </div>
            </form>
        </div>
        <?php endif; ?>
        
        <!-- Team List -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <table class="w-full">
                <thead class="bg-blue-900 text-white">
                    <tr>
                        <th class="px-6 py-4 text-left">Nom</th>
                        <th class="px-6 py-4 text-left">Rôle</th>
                        <th class="px-6 py-4 text-left">Photo</th>
                        <th class="px-6 py-4 text-center">Ordre</th>
                        <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($teamMembers)): ?>
                    <tr>
                        <td colspan="5" class="px-6 py-8 text-center text-gray-600">Aucun membre trouvé</td>
                    </tr>
                    <?php else: ?>
                    <?php foreach ($teamMembers as $member): ?>
                    <tr class="border-b border-gray-200 hover:bg-gray-50">
                        <td class="px-6 py-4 font-semibold"><?php echo htmlspecialchars($member['name']); ?></td>
                        <td class="px-6 py-4"><?php echo htmlspecialchars($member['role'] ?? '-'); ?></td>
                        <td class="px-6 py-4">
                            <?php if (!empty($member['photo_url'])): ?>
                                <img src="<?php echo htmlspecialchars($member['photo_url']); ?>" alt="<?php echo htmlspecialchars($member['name']); ?>" class="h-16 w-16 rounded-full object-cover border">
                            <?php else: ?>
                                <div class="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                                    <i class="fas fa-user"></i>
                                </div>
                            <?php endif; ?>
                        </td>
                        <td class="px-6 py-4 text-center"><?php echo $member['order_index']; ?></td>
                        <td class="px-6 py-4 text-right">
                            <a href="?edit=<?php echo $member['id']; ?>" class="text-blue-600 hover:text-blue-800 mr-3">
                                <i class="fas fa-edit"></i>
                            </a>
                            <form method="POST" action="" class="inline" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer ce membre?');">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="<?php echo $member['id']; ?>">
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

