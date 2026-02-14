<?php
/**
 * SULOC Admin - Vehicles Management
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();
$message = '';
$messageType = '';

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // SECURITY CHECK: Module Freeze
    if (isModuleFrozen('vehicles') && $_SESSION['admin_role'] !== 'creator') {
        $message = "ERREUR : Le module des Véhicules est actuellement GELÉ par le Système. Aucune modification n'est permise.";
        $messageType = 'error';
    } else {
        $action = $_POST['action'] ?? '';
    
    if ($action === 'add' || $action === 'edit') {
        require_once __DIR__ . '/../includes/ImageOptimizer.php';
        $optimizer = new ImageOptimizer();
        $uploadDir = __DIR__ . '/../uploads/vehicles/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $id = $_POST['id'] ?? null;
        $brand = sanitizeInput($_POST['brand'] ?? '');
        $model = sanitizeInput($_POST['model'] ?? '');
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $brand . '-' . $model)));
        $year = intval($_POST['year'] ?? 0);
        $transmission = sanitizeInput($_POST['transmission'] ?? 'automatic');
        $fuel_type = sanitizeInput($_POST['fuel_type'] ?? 'petrol');
        $price = floatval($_POST['price'] ?? 0);
        $currency = sanitizeInput($_POST['currency'] ?? 'USD');
        $vehicle_condition = sanitizeInput($_POST['vehicle_condition'] ?? 'used');
        $description = sanitizeInput($_POST['description'] ?? '');
        $current_main_image = sanitizeInput($_POST['current_main_image'] ?? ''); // Preserve existing image
        $main_image = $current_main_image;
        $mileage = intval($_POST['mileage'] ?? 0);
        $color = sanitizeInput($_POST['color'] ?? '');
        $engine_size = sanitizeInput($_POST['engine_size'] ?? '');
        $doors = intval($_POST['doors'] ?? 4);
        $seats = intval($_POST['seats'] ?? 5);
        $is_featured = isset($_POST['is_featured']) ? 1 : 0;
        $is_active = isset($_POST['is_active']) ? 1 : 0;
        $status = sanitizeInput($_POST['status'] ?? 'available');
        $order_index = intval($_POST['order_index'] ?? 0);

        // Handle Main Image Upload
        if (isset($_FILES['main_image_file']) && $_FILES['main_image_file']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['main_image_file'];
            $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $newFileName = 'vehicle_main_' . uniqid();
            $targetPath = $uploadDir . $newFileName . '.' . $fileExtension;
            
            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                $optimizePath = $uploadDir . $newFileName . '_opt.' . $fileExtension;
                $result = $optimizer->optimizeImage($targetPath, $optimizePath);
                
                if ($result['success']) {
                    unlink($targetPath); // Remove original unoptimized
                    $finalPath = $result['webp'] ?? $result['original'];
                    $main_image = SITE_URL . '/uploads/vehicles/' . basename($finalPath);
                } else {
                    $main_image = SITE_URL . '/uploads/vehicles/' . basename($targetPath);
                }
            }
        }

        $requiredFields = [
            'Marque' => $brand,
            'Modèle' => $model,
            'Année' => $year,
            'Prix' => $price,
        ];

        $missingFields = [];
        foreach ($requiredFields as $label => $value) {
            if (empty($value)) {
                $missingFields[] = $label;
            }
        }

        if (!empty($missingFields)) {
            $message = 'Veuillez remplir les champs obligatoires: ' . implode(', ', $missingFields);
            $messageType = 'error';
        } else {
            try {
                $columns = "slug, brand, model, year, transmission, fuel_type, price, currency, vehicle_condition, status, description, main_image, mileage, color, engine_size, doors, seats, is_featured, is_active, order_index";
                $values = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?";
                $params = [$slug, $brand, $model, $year, $transmission, $fuel_type, $price, $currency, $vehicle_condition, $status, $description, $main_image, $mileage, $color, $engine_size, $doors, $seats, $is_featured, $is_active, $order_index];

                if ($action === 'add') {
                    $stmt = $pdo->prepare("INSERT INTO vehicles ($columns) VALUES ($values)");
                    $stmt->execute($params);
                    $id = $pdo->lastInsertId(); // Get ID for gallery images
                    $message = 'Véhicule ajouté avec succès!';
                } else {
                    $updateFields = "slug = ?, brand = ?, model = ?, year = ?, transmission = ?, fuel_type = ?, price = ?, currency = ?, vehicle_condition = ?, status = ?, description = ?, main_image = ?, mileage = ?, color = ?, engine_size = ?, doors = ?, seats = ?, is_featured = ?, is_active = ?, order_index = ?";
                    $params[] = $id;
                    $stmt = $pdo->prepare("UPDATE vehicles SET $updateFields WHERE id = ?");
                    $stmt->execute($params);
                    $message = 'Véhicule modifié avec succès!';
                }

                // Handle Gallery Images Upload
                if (isset($_FILES['gallery_images']) && !empty($_FILES['gallery_images']['name'][0])) {
                    $fileCount = count($_FILES['gallery_images']['name']);
                    
                    // Get current max order
                    $stmt = $pdo->prepare("SELECT COALESCE(MAX(order_index), -1) + 1 FROM vehicle_images WHERE vehicle_id = ?");
                    $stmt->execute([$id]);
                    $nextOrder = $stmt->fetchColumn();

                    for ($i = 0; $i < $fileCount; $i++) {
                        if ($_FILES['gallery_images']['error'][$i] === UPLOAD_ERR_OK) {
                            $gFileName = $_FILES['gallery_images']['name'][$i];
                            $gTmpName = $_FILES['gallery_images']['tmp_name'][$i];
                            $gExt = strtolower(pathinfo($gFileName, PATHINFO_EXTENSION));
                            $gNewName = 'vehicle_' . $id . '_' . uniqid() . '_' . $i;
                            $gTarget = $uploadDir . $gNewName . '.' . $gExt;

                            if (move_uploaded_file($gTmpName, $gTarget)) {
                                $gOptPath = $uploadDir . $gNewName . '_opt.' . $gExt;
                                $gResult = $optimizer->optimizeImage($gTarget, $gOptPath);
                                
                                $finalGPath = $gTarget;
                                if ($gResult['success']) {
                                    unlink($gTarget);
                                    $finalGPath = $gResult['webp'] ?? $gResult['original'];
                                }

                                $gImageUrl = SITE_URL . '/uploads/vehicles/' . basename($finalGPath);
                                $stmt = $pdo->prepare("INSERT INTO vehicle_images (vehicle_id, image_url, alt_text, order_index) VALUES (?, ?, ?, ?)");
                                $stmt->execute([$id, $gImageUrl, "$brand $model gallery", $nextOrder++]);
                            }
                        }
                    }
                }

                $messageType = 'success';
                
                // If added, redirect to edit page to see results/add more
                if ($action === 'add') {
                     header("Location: vehicles.php?edit=$id&message=created");
                     exit;
                }

            } catch (Exception $e) {
                $message = 'Erreur: ' . $e->getMessage();
                $messageType = 'error';
            }
        }
    } elseif ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        try {
            $stmt = $pdo->prepare("DELETE FROM vehicles WHERE id = ?");
            $stmt->execute([$id]);
            $message = 'Véhicule supprimé avec succès!';
            $messageType = 'success';
        } catch (Exception $e) {
            $message = 'Erreur: ' . $e->getMessage();
            $messageType = 'error';
        }
    }
    } // End freeze check
}

// Get vehicles
$vehicles = $pdo->query("SELECT * FROM vehicles ORDER BY order_index ASC, id DESC")->fetchAll();

$isFrozen = isModuleFrozen('vehicles') && ($_SESSION['admin_role'] ?? '') !== 'creator';
$frozenBadge = $isFrozen ? '<span class="ml-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg text-xs font-black uppercase inline-flex items-center gap-2 animate-pulse"><i class="fas fa-snowflake"></i> Système Gelé</span>' : '';

// Get vehicle to edit
$editVehicle = null;
if (isset($_GET['edit'])) {
    $id = intval($_GET['edit']);
    $stmt = $pdo->prepare("SELECT * FROM vehicles WHERE id = ?");
    $stmt->execute([$id]);
    $editVehicle = $stmt->fetch();
}

// Get success message from redirect
if (isset($_GET['message']) && $_GET['message'] === 'created') {
    $message = "Véhicule créé avec succès ! Ajoutez d'autres images si nécessaire.";
    $messageType = "success";
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des Véhicules - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>
    
    <div class="container mx-auto px-6 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-suloc-navy flex items-center">Gestion des Véhicules <?php echo $frozenBadge; ?></h1>
            <a href="<?php echo $isFrozen ? '#' : '?action=add'; ?>" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>">
                <i class="fas fa-plus mr-2"></i>Ajouter un Véhicule
            </a>
        </div>
        
        <?php if ($message): ?>
        <div class="bg-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-100 border border-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-400 text-<?php echo $messageType === 'success' ? 'green' : 'red'; ?>-700 px-4 py-3 rounded mb-4">
            <?php echo htmlspecialchars($message); ?>
        </div>
        <?php endif; ?>
        
        <?php if ((isset($_GET['action']) && $_GET['action'] === 'add') || $editVehicle): ?>
        <!-- Add/Edit Form -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-bold text-suloc-navy mb-6"><?php echo $editVehicle ? 'Modifier' : 'Ajouter'; ?> un Véhicule</h2>
            <form method="POST" action="" enctype="multipart/form-data">
                <input type="hidden" name="action" value="<?php echo $editVehicle ? 'edit' : 'add'; ?>">
                <?php if ($editVehicle): ?><input type="hidden" name="id" value="<?php echo $editVehicle['id']; ?>"><?php endif; ?>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Marque *</label>
                        <input type="text" name="brand" required value="<?php echo htmlspecialchars($editVehicle['brand'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Modèle *</label>
                        <input type="text" name="model" required value="<?php echo htmlspecialchars($editVehicle['model'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Année *</label>
                        <input type="number" name="year" required value="<?php echo htmlspecialchars($editVehicle['year'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Prix *</label>
                        <input type="number" step="0.01" name="price" required value="<?php echo htmlspecialchars($editVehicle['price'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Monnaie</label>
                        <input type="text" name="currency" value="<?php echo htmlspecialchars($editVehicle['currency'] ?? 'USD'); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Kilométrage</label>
                        <input type="number" name="mileage" value="<?php echo htmlspecialchars($editVehicle['mileage'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Couleur</label>
                        <input type="text" name="color" value="<?php echo htmlspecialchars($editVehicle['color'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Moteur</label>
                        <input type="text" name="engine_size" value="<?php echo htmlspecialchars($editVehicle['engine_size'] ?? ''); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Portes</label>
                        <input type="number" name="doors" value="<?php echo htmlspecialchars($editVehicle['doors'] ?? 4); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Sièges</label>
                        <input type="number" name="seats" value="<?php echo htmlspecialchars($editVehicle['seats'] ?? 5); ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Transmission</label>
                        <select name="transmission" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                            <option value="automatic" <?php echo ($editVehicle['transmission'] ?? '') === 'automatic' ? 'selected' : ''; ?>>Automatique</option>
                            <option value="manual" <?php echo ($editVehicle['transmission'] ?? '') === 'manual' ? 'selected' : ''; ?>>Manuelle</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Carburant</label>
                        <select name="fuel_type" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                            <option value="petrol" <?php echo ($editVehicle['fuel_type'] ?? '') === 'petrol' ? 'selected' : ''; ?>>Essence</option>
                            <option value="diesel" <?php echo ($editVehicle['fuel_type'] ?? '') === 'diesel' ? 'selected' : ''; ?>>Diesel</option>
                            <option value="hybrid" <?php echo ($editVehicle['fuel_type'] ?? '') === 'hybrid' ? 'selected' : ''; ?>>Hybride</option>
                            <option value="electric" <?php echo ($editVehicle['fuel_type'] ?? '') === 'electric' ? 'selected' : ''; ?>>Électrique</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Condition</label>
                        <select name="vehicle_condition" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                            <option value="new" <?php echo ($editVehicle['vehicle_condition'] ?? '') === 'new' ? 'selected' : ''; ?>>Neuf</option>
                            <option value="used" <?php echo ($editVehicle['vehicle_condition'] ?? '') === 'used' ? 'selected' : ''; ?>>Occasion</option>
                            <option value="certified" <?php echo ($editVehicle['vehicle_condition'] ?? '') === 'certified' ? 'selected' : ''; ?>>Certifié</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Statut de vente *</label>
                        <select name="status" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                            <option value="available" <?php echo ($editVehicle['status'] ?? 'available') === 'available' ? 'selected' : ''; ?>>Disponible</option>
                            <option value="negotiating" <?php echo ($editVehicle['status'] ?? '') === 'negotiating' ? 'selected' : ''; ?>>En négociation</option>
                            <option value="sold" <?php echo ($editVehicle['status'] ?? '') === 'sold' ? 'selected' : ''; ?>>Vendu</option>
                        </select>
                    </div>
                    
                    <!-- Main Image Upload -->
                    <div class="md:col-span-2 lg:col-span-3">
                        <label class="block text-gray-700 font-semibold mb-2">Image Principale</label>
                        <?php if (!empty($editVehicle['main_image'])): ?>
                            <div class="mb-2">
                                <img src="<?php echo htmlspecialchars($editVehicle['main_image']); ?>" alt="Current Main" class="h-32 object-cover rounded">
                                <p class="text-xs text-gray-500 mt-1">Image actuelle</p>
                            </div>
                        <?php endif; ?>
                        <input type="hidden" name="current_main_image" value="<?php echo htmlspecialchars($editVehicle['main_image'] ?? ''); ?>">
                        <input type="file" name="main_image_file" accept="image/*" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                        <p class="text-sm text-gray-500 mt-1">Laisser vide pour conserver l'image actuelle.</p>
                    </div>

                    <!-- Gallery Images Upload -->
                    <div class="md:col-span-2 lg:col-span-3">
                        <label class="block text-gray-700 font-semibold mb-2">Galerie d'Images (Optionnel)</label>
                        <input type="file" name="gallery_images[]" multiple accept="image/*" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                        <p class="text-sm text-gray-500 mt-1">Sélectionnez plusieurs images pour les ajouter à la galerie.</p>
                    </div>

                    <div class="md:col-span-2 lg:col-span-3">
                        <label class="block text-gray-700 font-semibold mb-2">Description</label>
                        <textarea name="description" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold"><?php echo htmlspecialchars($editVehicle['description'] ?? ''); ?></textarea>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">Ordre d'affichage</label>
                        <input type="number" name="order_index" value="<?php echo $editVehicle['order_index'] ?? 0; ?>" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-suloc-gold">
                    </div>
                    <div class="flex items-center">
                        <label class="flex items-center">
                            <input type="checkbox" name="is_featured" <?php echo ($editVehicle['is_featured'] ?? 0) ? 'checked' : ''; ?> class="mr-2">
                            <span>En vedette</span>
                        </label>
                    </div>
                    <div class="flex items-center">
                        <label class="flex items-center">
                            <input type="checkbox" name="is_active" <?php echo ($editVehicle['is_active'] ?? 1) ? 'checked' : ''; ?> class="mr-2">
                            <span>Actif</span>
                        </label>
                    </div>
                </div>
                
                <div class="flex space-x-4 mt-8">
                    <button type="submit" <?php echo $isFrozen ? 'disabled' : ''; ?> class="bg-suloc-navy text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>">
                        <i class="fas fa-save mr-2"></i><?php echo $isFrozen ? 'ACTIONS GELÉES' : 'Enregistrer'; ?>
                    </button>
                    <a href="vehicles.php" class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition">
                        Annuler
                    </a>
                </div>
            </form>
        </div>
        <?php endif; ?>
        
        <?php if ($editVehicle): ?>
        <!-- Image Gallery Management -->
        <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-bold text-suloc-navy mb-6">Galerie d'Images Existantes</h2>
            
            <!-- JavaScript-based Upload Zone (Kept for compatibility/bulk ajax uploads if preferred) -->
            <div class="mb-6 border-b pb-6">
                <h3 class="font-semibold text-gray-700 mb-2">Ajouter via Glisser-Déposer (AJAX)</h3>
                <div id="drop-zone" class="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-suloc-gold transition cursor-pointer">
                    <i class="fas fa-cloud-upload-alt text-6xl text-gray-400 mb-4"></i>
                    <p class="text-lg font-semibold text-gray-700 mb-2">Glissez-déposez des images supplémentaires ici</p>
                    <input type="file" id="image-input" multiple accept="image/*" class="hidden" <?php echo $isFrozen ? 'disabled' : ''; ?>>
                    <button type="button" onclick="<?php echo $isFrozen ? '' : "document.getElementById('image-input').click()"; ?>" 
                            class="bg-suloc-navy text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>">
                        <i class="fas fa-folder-open mr-2"></i> <?php echo $isFrozen ? 'UPLOAD GELÉ' : 'Sélectionner des Images'; ?>
                    </button>
                </div>
            </div>
            
            <!-- Current Images -->
            <div id="current-images" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <?php
                $stmt = $pdo->prepare("SELECT * FROM vehicle_images WHERE vehicle_id = ? ORDER BY order_index ASC");
                $stmt->execute([$editVehicle['id']]);
                $currentImages = $stmt->fetchAll();
                
                foreach ($currentImages as $img):
                ?>
                <div class="relative group" data-image-id="<?php echo $img['id']; ?>">
                    <img src="<?php echo htmlspecialchars($img['image_url']); ?>" 
                         alt="<?php echo htmlspecialchars($img['alt_text']); ?>"
                         class="w-full h-32 object-cover rounded-lg">
                    <button type="button" onclick="deleteImage(<?php echo $img['id']; ?>)"
                            class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <?php endforeach; ?>
            </div>
            
            <div id="upload-progress" class="hidden mt-4">
                <div class="bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div id="progress-bar" class="bg-suloc-gold h-full transition-all duration-300" style="width: 0%"></div>
                </div>
                <p id="upload-status" class="text-sm text-gray-600 mt-2"></p>
            </div>
        </div>
        
        <script>
            const vehicleId = <?php echo $editVehicle['id']; ?>;
            const dropZone = document.getElementById('drop-zone');
            const imageInput = document.getElementById('image-input');
            const currentImagesDiv = document.getElementById('current-images');
            const uploadProgress = document.getElementById('upload-progress');
            const progressBar = document.getElementById('progress-bar');
            const uploadStatus = document.getElementById('upload-status');
            
            // Drag and drop handlers
            if (dropZone) {
                dropZone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dropZone.classList.add('border-suloc-gold', 'bg-yellow-50');
                });
                
                dropZone.addEventListener('dragleave', () => {
                    dropZone.classList.remove('border-suloc-gold', 'bg-yellow-50');
                });
                
                dropZone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropZone.classList.remove('border-suloc-gold', 'bg-yellow-50');
                    const files = e.dataTransfer.files;
                    handleFiles(files);
                });
            }
            
            if (imageInput) {
                imageInput.addEventListener('change', (e) => {
                    handleFiles(e.target.files);
                });
            }
            
            async function handleFiles(files) {
                if (files.length === 0) return;
                
                const formData = new FormData();
                formData.append('vehicle_id', vehicleId);
                
                for (let file of files) {
                    formData.append('images[]', file);
                }
                
                uploadProgress.classList.remove('hidden');
                progressBar.style.width = '0%';
                uploadStatus.textContent = 'Téléchargement en cours...';
                
                try {
                    const xhr = new XMLHttpRequest();
                    
                    xhr.upload.addEventListener('progress', (e) => {
                        if (e.lengthComputable) {
                            const percent = (e.loaded / e.total) * 100;
                            progressBar.style.width = percent + '%';
                        }
                    });
                    
                    xhr.addEventListener('load', () => {
                        if (xhr.status === 200) {
                            try {
                                const response = JSON.parse(xhr.responseText);
                                if (response.success) {
                                    uploadStatus.textContent = response.message;
                                    progressBar.style.width = '100%';
                                    setTimeout(() => {
                                        location.reload();
                                    }, 1000);
                                } else {
                                    uploadStatus.textContent = 'Erreur: ' + response.message;
                                    progressBar.classList.add('bg-red-600');
                                }
                            } catch (e) {
                                uploadStatus.textContent = 'Erreur de réponse serveur';
                            }
                        }
                    });
                    
                    xhr.open('POST', 'upload-vehicle-images.php');
                    xhr.send(formData);
                    
                } catch (error) {
                    uploadStatus.textContent = 'Erreur de téléchargement';
                    progressBar.classList.add('bg-red-600');
                }
            }
            
            async function deleteImage(imageId) {
                if (!confirm('Êtes-vous sûr de vouloir supprimer cette image?')) {
                    return;
                }
                
                try {
                    const response = await fetch('delete-vehicle-image.php', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        body: 'image_id=' + imageId
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        document.querySelector(`[data-image-id="${imageId}"]`).remove();
                    } else {
                        alert('Erreur: ' + result.message);
                    }
                } catch (error) {
                    alert('Erreur de suppression');
                }
            }
        </script>
        <?php endif; ?>
        
        
        <!-- Vehicles List -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <table class="w-full">
                <thead class="bg-suloc-navy text-white">
                    <tr>
                        <th class="px-6 py-4 text-left">Marque & Modèle</th>
                        <th class="px-6 py-4 text-left">Prix</th>
                        <th class="px-6 py-4 text-center">Année</th>
                        <th class="px-6 py-4 text-center">Statut</th>
                        <th class="px-6 py-4 text-center">Visibilité</th>
                        <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($vehicles)): ?>
                    <tr>
                        <td colspan="5" class="px-6 py-8 text-center text-gray-600">Aucun véhicule trouvé</td>
                    </tr>
                    <?php else: ?>
                    <?php foreach ($vehicles as $vehicle): ?>
                    <tr class="border-b border-gray-200 hover:bg-gray-50">
                        <td class="px-6 py-4 font-semibold"><?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?></td>
                        <td class="px-6 py-4"><?php echo htmlspecialchars(number_format($vehicle['price'], 2) . ' ' . $vehicle['currency']); ?></td>
                        <td class="px-6 py-4 text-center"><?php echo $vehicle['year']; ?></td>
                        <td class="px-6 py-4 text-center">
                            <?php
                            $statusLabel = 'Disponible';
                            $statusClass = 'bg-green-100 text-green-700';
                            if ($vehicle['status'] === 'negotiating') {
                                $statusLabel = 'En négociation';
                                $statusClass = 'bg-orange-100 text-orange-700';
                            } elseif ($vehicle['status'] === 'sold') {
                                $statusLabel = 'Vendu';
                                $statusClass = 'bg-red-100 text-red-700';
                            }
                            ?>
                            <span class="px-3 py-1 rounded-full text-xs font-bold <?php echo $statusClass; ?>">
                                <?php echo $statusLabel; ?>
                            </span>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <span class="px-3 py-1 rounded-full text-xs <?php echo $vehicle['is_active'] ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'; ?>">
                                <?php echo $vehicle['is_active'] ? 'Actif' : 'Inactif'; ?>
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right">
                             <a href="<?php echo $isFrozen ? '#' : '?edit=' . $vehicle['id']; ?>" class="text-blue-600 hover:text-blue-800 mr-3 <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>">
                                <i class="fas fa-edit"></i>
                            </a>
                            <form method="POST" action="" class="inline" onsubmit="return <?php echo $isFrozen ? 'false' : "confirm('Êtes-vous sûr de vouloir supprimer ce véhicule?')"; ?>;">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="<?php echo $vehicle['id']; ?>">
                                <button type="submit" <?php echo $isFrozen ? 'disabled' : ''; ?> class="text-red-600 hover:text-red-800 <?php echo $isFrozen ? 'opacity-50 cursor-not-allowed' : ''; ?>">
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