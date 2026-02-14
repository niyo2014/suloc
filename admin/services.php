<?php
/**
 * SULOC Admin - Services Management
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();
$message = '';
$messageType = '';

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'add' || $action === 'edit') {
        $id = $_POST['id'] ?? null;
        $title = sanitizeInput($_POST['title'] ?? '');
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        $description = sanitizeInput($_POST['description'] ?? '');
        $icon = sanitizeInput($_POST['icon'] ?? 'fas fa-cog');
        $features = json_encode(array_filter(array_map('trim', explode("\n", $_POST['features'] ?? ''))));
        $content = $_POST['content'] ?? '';
        $image_url = sanitizeInput($_POST['image_url'] ?? '');
        if (isset($_FILES['service_image']) && $_FILES['service_image']['error'] === UPLOAD_ERR_OK) {
            $uploadType = 'services';
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (in_array($_FILES['service_image']['type'], $allowedTypes) && $_FILES['service_image']['size'] <= 5 * 1024 * 1024) {
                $uploadDir = UPLOAD_PATH . '/' . $uploadType . '/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                $extension = pathinfo($_FILES['service_image']['name'], PATHINFO_EXTENSION);
                $filename = uniqid('service_', true) . '.' . $extension;
                $filepath = $uploadDir . $filename;
                if (move_uploaded_file($_FILES['service_image']['tmp_name'], $filepath)) {
                    $image_url = UPLOAD_URL . '/' . $uploadType . '/' . $filename;
                }
            }
        }
        $order_index = intval($_POST['order_index'] ?? 0);
        $is_active = isset($_POST['is_active']) ? 1 : 0;
        
        try {
            if ($action === 'add') {
                $stmt = $pdo->prepare("INSERT INTO services (slug, title, description, icon, features, content, image_url, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$slug, $title, $description, $icon, $features, $content, $image_url, $order_index, $is_active]);
                $message = 'Service ajouté avec succès!';
            } else {
                $stmt = $pdo->prepare("UPDATE services SET slug = ?, title = ?, description = ?, icon = ?, features = ?, content = ?, image_url = ?, order_index = ?, is_active = ? WHERE id = ?");
                $stmt->execute([$slug, $title, $description, $icon, $features, $content, $image_url, $order_index, $is_active, $id]);
                $message = 'Service modifié avec succès!';
            }
            $messageType = 'success';
        } catch (Exception $e) {
            $message = 'Erreur: ' . $e->getMessage();
            $messageType = 'error';
        }
    } elseif ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        try {
            $stmt = $pdo->prepare("DELETE FROM services WHERE id = ?");
            $stmt->execute([$id]);
            $message = 'Service supprimé avec succès!';
            $messageType = 'success';
        } catch (Exception $e) {
            $message = 'Erreur: ' . $e->getMessage();
            $messageType = 'error';
        }
    }
}

// Get services
$services = $pdo->query("SELECT * FROM services ORDER BY order_index ASC, id DESC")->fetchAll();

// Get service to edit
$editService = null;
if (isset($_GET['edit'])) {
    $id = intval($_GET['edit']);
    $stmt = $pdo->prepare("SELECT * FROM services WHERE id = ?");
    $stmt->execute([$id]);
    $editService = $stmt->fetch();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des Services - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>
    
    <div class="container mx-auto px-6 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-blue-900">Gestion des Services</h1>
            <a href="?action=add" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
                <i class="fas fa-plus mr-2"></i>Ajouter un Service
            </a>
        </div>
        
        <?php if ($message): ?>
        <div class="bg-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-100 border border-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-400 text-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-700 px-4 py-3 rounded mb-4">
            <?php echo htmlspecialchars($message); ?>
        </div>
        <?php endif; ?>
        
        <?php if ((isset($_GET['action']) && $_GET['action'] === 'add') || $editService): ?>
        <!-- Add/Edit Form -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-bold text-blue-900 mb-6"><?php echo $editService ? 'Modifier' : 'Ajouter'; ?> un Service</h2>
            <form method="POST" action="" enctype="multipart/form-data">
                <input type="hidden" name="action" value="<?php echo $editService ? 'edit' : 'add'; ?>">
                <?php if ($editService): ?><input type="hidden" name="id" value="<?php echo $editService['id']; ?>"><?php endif; ?>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Titre *</label>
                        <input type="text" name="title" required value="<?php echo htmlspecialchars($editService['title'] ?? ''); ?>" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Icône Font Awesome</label>
                        <input type="text" name="icon" value="<?php echo htmlspecialchars($editService['icon'] ?? 'fas fa-cog'); ?>" 
                               placeholder="fas fa-leaf" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Image du Service</label>
                        <div class="space-y-3">
                            <input type="file" name="service_image" accept="image/*" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <input type="url" name="image_url" value="<?php echo htmlspecialchars($editService['image_url'] ?? ''); ?>" 
                                   placeholder="https://example.com/image.jpg"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <?php if (!empty($editService['image_url'])): ?>
                            <div class="mt-2">
                                <img src="<?php echo htmlspecialchars($editService['image_url']); ?>" alt="Prévisualisation Service" class="h-32 rounded-lg object-cover border">
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Ordre d'affichage</label>
                        <input type="number" name="order_index" value="<?php echo $editService['order_index'] ?? 0; ?>" 
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="block text-gray-700 font-semibold mb-2">Description</label>
                    <textarea name="description" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editService['description'] ?? ''); ?></textarea>
                </div>
                
                <div class="mb-6">
                    <label class="block text-gray-700 font-semibold mb-2">Caractéristiques (une par ligne)</label>
                    <textarea name="features" rows="5" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php 
                        if ($editService && $editService['features']) {
                            $features = json_decode($editService['features'], true);
                            echo htmlspecialchars(implode("\n", $features));
                        }
                    ?></textarea>
                </div>
                
                <div class="mb-6">
                    <label class="block text-gray-700 font-semibold mb-2">Contenu détaillé</label>
                    <textarea name="content" rows="10" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><?php echo htmlspecialchars($editService['content'] ?? ''); ?></textarea>
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
                    <a href="services.php" class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition">
                        Annuler
                    </a>
                </div>
            </form>
        </div>
        <?php endif; ?>
        
        <!-- Services List -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <table class="w-full">
                <thead class="bg-blue-900 text-white">
                    <tr>
                        <th class="px-6 py-4 text-left">Titre</th>
                        <th class="px-6 py-4 text-left">Icône</th>
                        <th class="px-6 py-4 text-center">Ordre</th>
                        <th class="px-6 py-4 text-center">Statut</th>
                        <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($services)): ?>
                    <tr>
                        <td colspan="5" class="px-6 py-8 text-center text-gray-600">Aucun service trouvé</td>
                    </tr>
                    <?php else: ?>
                    <?php foreach ($services as $service): ?>
                    <tr class="border-b border-gray-200 hover:bg-gray-50">
                        <td class="px-6 py-4 font-semibold"><?php echo htmlspecialchars($service['title']); ?></td>
                        <td class="px-6 py-4"><i class="<?php echo htmlspecialchars($service['icon']); ?> text-xl"></i></td>
                        <td class="px-6 py-4 text-center"><?php echo $service['order_index']; ?></td>
                        <td class="px-6 py-4 text-center">
                            <span class="px-3 py-1 rounded-full text-sm <?php echo $service['is_active'] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'; ?>">
                                <?php echo $service['is_active'] ? 'Actif' : 'Inactif'; ?>
                            </span>
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
