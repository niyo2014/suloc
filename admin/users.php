<?php
/**
 * SULOC Admin - User Management
 * Restricted to Creator and Super Admin
 */
require_once __DIR__ . '/../config/config.php';
requireRole(['creator', 'super_admin']);

$pdo = getDBConnection();
$message = '';
$messageType = '';

// Available Permissions
$availablePermissions = [
    'manage_content' => 'Gérer le Contenu (Pages, Services)',
    'manage_visa' => 'Gérer les Visas',
    'manage_logistics' => 'Gérer la Logistique',
    'manage_payments' => 'Gérer les Paiements (Sensible)',
    'manage_vehicles' => 'Gérer les Véhicules'
];

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'add' || $action === 'edit') {
        $id = $_POST['id'] ?? null;
        $username = sanitizeInput($_POST['username'] ?? '');
        $fullName = sanitizeInput($_POST['full_name'] ?? '');
        $email = sanitizeInput($_POST['email'] ?? '');
        $role = $_POST['role'] ?? 'admin';
        $password = $_POST['password'] ?? '';
        $permissions = isset($_POST['permissions']) ? json_encode($_POST['permissions']) : json_encode([]);
        $isBlocked = isset($_POST['is_blocked']) ? 1 : 0;
        
        if (empty($username) || ($action === 'add' && empty($password))) {
            $message = "Nom d'utilisateur et mot de passe requis.";
            $messageType = 'error';
        } else {
            try {
                if ($action === 'add') {
                    // Check if username exists
                    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admin_users WHERE username = ?");
                    $stmt->execute([$username]);
                    if ($stmt->fetchColumn() > 0) {
                        throw new Exception("Ce nom d'utilisateur existe déjà.");
                    }
                    
                    $hash = password_hash($password, PASSWORD_DEFAULT);
                    $stmt = $pdo->prepare("INSERT INTO admin_users (username, password_hash, full_name, email, role, permissions, is_blocked) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([$username, $hash, $fullName, $email, $role, $permissions, $isBlocked]);
                    $message = "Utilisateur créé avec succès.";
                } else {
                    // Edit
                    $sql = "UPDATE admin_users SET full_name = ?, email = ?, role = ?, permissions = ?, is_blocked = ?";
                    $params = [$fullName, $email, $role, $permissions, $isBlocked];
                    
                    if (!empty($password)) {
                        $sql .= ", password_hash = ?";
                        $params[] = password_hash($password, PASSWORD_DEFAULT);
                    }
                    
                    $sql .= " WHERE id = ?";
                    $params[] = $id;
                    
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute($params);
                    $message = "Utilisateur mis à jour.";
                }
                $messageType = 'success';
            } catch (Exception $e) {
                $message = "Erreur: " . $e->getMessage();
                $messageType = 'error';
            }
        }
    } elseif ($action === 'delete') {
        $id = intval($_POST['id']);
        // Prevent deleting self or creator
        $stmt = $pdo->prepare("SELECT role FROM admin_users WHERE id = ?");
        $stmt->execute([$id]);
        $targetRole = $stmt->fetchColumn();
        
        if ($targetRole === 'creator' || $id == $_SESSION['admin_id']) {
            $message = "Action non autorisée.";
            $messageType = 'error';
        } else {
            $stmt = $pdo->prepare("DELETE FROM admin_users WHERE id = ?");
            $stmt->execute([$id]);
            $message = "Utilisateur supprimé.";
            $messageType = 'success';
        }
    }
}

// Fetch Users (Hide Creator from list unless current user is Creator)
$query = "SELECT * FROM admin_users WHERE role != 'creator'";
if ($_SESSION['admin_role'] === 'creator') {
    $query = "SELECT * FROM admin_users"; // Creator sees everyone
}
$users = $pdo->query($query)->fetchAll();

// Edit Mode
$editUser = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE id = ?");
    $stmt->execute([$_GET['edit']]);
    $editUser = $stmt->fetch();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des Utilisateurs - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>

    <div class="container mx-auto px-6 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-blue-900">Gestion des Utilisateurs</h1>
            <?php if (!$editUser): ?>
            <button onclick="document.getElementById('userForm').classList.toggle('hidden')" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
                <i class="fas fa-plus mr-2"></i>Ajouter un Utilisateur
            </button>
            <?php endif; ?>
        </div>

        <?php if ($message): ?>
            <div class="bg-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-100 border border-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-400 text-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-700 px-4 py-3 rounded mb-6">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>

        <!-- Add/Edit Form -->
        <div id="userForm" class="<?php echo $editUser ? '' : 'hidden'; ?> bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
            <h2 class="text-xl font-bold text-gray-800 mb-6"><?php echo $editUser ? 'Modifier' : 'Nouvel'; ?> Utilisateur</h2>
            <form method="POST" action="users.php">
                <input type="hidden" name="action" value="<?php echo $editUser ? 'edit' : 'add'; ?>">
                <?php if ($editUser): ?><input type="hidden" name="id" value="<?php echo $editUser['id']; ?>"><?php endif; ?>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Nom d'utilisateur *</label>
                        <input type="text" name="username" required value="<?php echo htmlspecialchars($editUser['username'] ?? ''); ?>" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Mot de passe <?php echo $editUser ? '(Laisser vide pour ne pas changer)' : '*'; ?></label>
                        <input type="password" name="password" <?php echo $editUser ? '' : 'required'; ?> class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Nom Complet</label>
                        <input type="text" name="full_name" value="<?php echo htmlspecialchars($editUser['full_name'] ?? ''); ?>" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Email</label>
                        <input type="email" name="email" value="<?php echo htmlspecialchars($editUser['email'] ?? ''); ?>" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Rôle</label>
                        <select name="role" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" onchange="togglePermissions(this.value)">
                            <option value="admin" <?php echo ($editUser['role'] ?? '') === 'admin' ? 'selected' : ''; ?>>Administrateur (Restreint)</option>
                            <option value="super_admin" <?php echo ($editUser['role'] ?? '') === 'super_admin' ? 'selected' : ''; ?>>Super Admin (Tout accès)</option>
                            <?php if($_SESSION['admin_role'] === 'creator'): ?>
                            <option value="creator" <?php echo ($editUser['role'] ?? '') === 'creator' ? 'selected' : ''; ?>>Creator</option>
                            <?php endif; ?>
                        </select>
                    </div>
                    <div>
                        <label class="flex items-center mt-8 cursor-pointer">
                            <input type="checkbox" name="is_blocked" <?php echo ($editUser['is_blocked'] ?? 0) ? 'checked' : ''; ?> class="form-checkbox h-5 w-5 text-red-600">
                            <span class="ml-2 text-red-600 font-bold">Compte Bloqué</span>
                        </label>
                    </div>
                </div>

                <div id="permissionsBox" class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 <?php echo ($editUser['role'] ?? 'admin') === 'super_admin' ? 'hidden' : ''; ?>">
                    <h3 class="font-bold text-gray-700 mb-3">Permissions (Pour Admin uniquement)</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <?php 
                        $userPerms = $editUser['permissions'] ? json_decode($editUser['permissions'], true) : [];
                        foreach ($availablePermissions as $key => $label): 
                        ?>
                        <label class="flex items-center">
                            <input type="checkbox" name="permissions[]" value="<?php echo $key; ?>" <?php echo in_array($key, $userPerms) ? 'checked' : ''; ?> class="mr-2 text-blue-600">
                            <span><?php echo htmlspecialchars($label); ?></span>
                        </label>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="flex space-x-4">
                    <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">Enregistrer</button>
                    <a href="users.php" class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition">Annuler</a>
                </div>
            </form>
        </div>

        <!-- Users List -->
        <div class="bg-white rounded-xl shadow-lg run-flow-hidden">
            <table class="w-full">
                <thead class="bg-gray-800 text-white">
                    <tr>
                        <th class="px-6 py-4 text-left">Utilisateur</th>
                        <th class="px-6 py-4 text-left">Rôle</th>
                        <th class="px-6 py-4 text-center">Statut</th>
                        <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <?php foreach ($users as $user): ?>
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4">
                            <div class="font-bold text-blue-900"><?php echo htmlspecialchars($user['username']); ?></div>
                            <div class="text-sm text-gray-500"><?php echo htmlspecialchars($user['full_name']); ?></div>
                        </td>
                        <td class="px-6 py-4">
                            <?php 
                            $roleBadge = match($user['role']) {
                                'creator' => 'bg-red-100 text-red-800 border-red-200',
                                'super_admin' => 'bg-blue-100 text-blue-800 border-blue-200',
                                default => 'bg-gray-100 text-gray-800 border-gray-200'
                            };
                            ?>
                            <span class="px-3 py-1 rounded-full text-xs font-bold border <?php echo $roleBadge; ?>">
                                <?php echo strtoupper(str_replace('_', ' ', $user['role'])); ?>
                            </span>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <?php if ($user['is_blocked']): ?>
                                <span class="bg-red-500 text-white px-3 py-1 rounded-full text-xs">Bloqué</span>
                            <?php else: ?>
                                <span class="bg-green-500 text-white px-3 py-1 rounded-full text-xs">Actif</span>
                            <?php endif; ?>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <a href="?edit=<?php echo $user['id']; ?>" class="text-blue-600 hover:text-blue-800 mr-3">
                                <i class="fas fa-edit"></i>
                            </a>
                            <?php if ($user['id'] != $_SESSION['admin_id']): ?>
                            <form method="POST" class="inline" onsubmit="return confirm('Supprimer cet utilisateur ?');">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="<?php echo $user['id']; ?>">
                                <button type="submit" class="text-red-600 hover:text-red-800">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </form>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        function togglePermissions(role) {
            const box = document.getElementById('permissionsBox');
            if (role === 'admin') {
                box.classList.remove('hidden');
            } else {
                box.classList.add('hidden');
            }
        }
    </script>
</body>
</html>
