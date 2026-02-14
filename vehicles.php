<?php
/**
 * SULOC - Vehicles Module
 * Handles both the vehicle catalog (list) and valid detail pages.
 */

require_once __DIR__ . '/config/config.php';

// Get vehicle slug from URL
$slug = $_GET['slug'] ?? '';
$isDetailView = !empty($slug);
$vehicle = null;
$galleryImages = [];

$pdo = getDBConnection();

// Handle Detail View
if ($isDetailView) {
    try {
        // Fetch vehicle details
        $stmt = $pdo->prepare("SELECT * FROM vehicles WHERE slug = ? AND is_active = 1");
        $stmt->execute([$slug]);
        $vehicle = $stmt->fetch();

        if ($vehicle) {
            // Fetch vehicle images
            $stmt = $pdo->prepare("SELECT image_url, alt_text FROM vehicle_images WHERE vehicle_id = ? ORDER BY order_index ASC");
            $stmt->execute([$vehicle['id']]);
            $galleryImages = $stmt->fetchAll();
        } else {
            // Vehicle not found, redirect to catalog
            header("Location: vehicles.php");
            exit;
        }
    } catch (Exception $e) {
        error_log("Vehicle DB Error: " . $e->getMessage());
        $vehicle = null;
    }
}

// Handle Catalog View (if no slug or fallback)
if (!$isDetailView || !$vehicle) {
    $pageTitle = __('nav_vehicles') . ' | SULOC';
    $pageDescription = __('veh_catalog_subtitle');
    
    // 1. Get Distinct values for filters
    $brands = [];
    $years = [];
    try {
        $brands = $pdo->query("SELECT DISTINCT brand FROM vehicles WHERE is_active = 1 ORDER BY brand ASC")->fetchAll(PDO::FETCH_COLUMN);
        $years = $pdo->query("SELECT DISTINCT year FROM vehicles WHERE is_active = 1 ORDER BY year DESC")->fetchAll(PDO::FETCH_COLUMN);
    } catch (Exception $e) {
        error_log("Filter Data Error: " . $e->getMessage());
    }

    // 2. Build Query based on filters
    $where = ["is_active = 1"];
    $params = [];

    // Filter parameters
    $f_brand = sanitizeInput($_GET['brand'] ?? '');
    $f_model = sanitizeInput($_GET['model'] ?? '');
    $f_year = sanitizeInput($_GET['year'] ?? '');
    $f_price_min = floatval($_GET['price_min'] ?? 0);
    $f_price_max = floatval($_GET['price_max'] ?? 0);
    $f_transmission = sanitizeInput($_GET['transmission'] ?? '');
    $f_fuel = sanitizeInput($_GET['fuel_type'] ?? '');
    $f_condition = sanitizeInput($_GET['condition'] ?? '');
    $f_status = sanitizeInput($_GET['status'] ?? '');

    // Check if any filter is active (to change default behavior)
    $anyFilter = !empty($f_brand) || !empty($f_model) || !empty($f_year) || $f_price_min > 0 || $f_price_max > 0 || !empty($f_transmission) || !empty($f_fuel) || !empty($f_condition) || !empty($f_status);

    // Apply Recommended Default: Only Available if no filter set
    if (!$anyFilter && !isset($_GET['status'])) {
        $f_status = 'available';
    }

    if ($f_brand) { $where[] = "brand = ?"; $params[] = $f_brand; }
    if ($f_model) { $where[] = "model LIKE ?"; $params[] = "%$f_model%"; }
    if ($f_year) { $where[] = "year = ?"; $params[] = $f_year; }
    if ($f_price_min > 0) { $where[] = "price >= ?"; $params[] = $f_price_min; }
    if ($f_price_max > 0) { $where[] = "price <= ?"; $params[] = $f_price_max; }
    if ($f_transmission) { $where[] = "transmission = ?"; $params[] = $f_transmission; }
    if ($f_fuel) { $where[] = "fuel_type = ?"; $params[] = $f_fuel; }
    if ($f_condition) { $where[] = "vehicle_condition = ?"; $params[] = $f_condition; }
    
    if ($f_status) { 
        $where[] = "status = ?"; 
        $params[] = $f_status; 
    } elseif (!$anyFilter) {
        // Default View: Prefer Available/Negotiating over Sold for initial impact
        // But for SULOC specifically, maybe show all but prioritize available?
        // Let's stick to showing ALL active by default unless explicitly filtered, 
        // but the user suggested a "Default to Available" option.
        // Let's implement: show all active, but if no filters, maybe we can hide Sold or show them last.
    }

    $sql = "SELECT * FROM vehicles WHERE " . implode(" AND ", $where) . " ORDER BY CASE WHEN status = 'available' THEN 0 WHEN status = 'negotiating' THEN 1 ELSE 2 END ASC, order_index ASC, created_at DESC";
    
    $vehicles = [];
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $vehicles = $stmt->fetchAll();
    } catch (Exception $e) {
        error_log("Vehicles Filter DB Error: " . $e->getMessage());
    }
} else {
    // Set Detail View metadata
    $pageTitle = htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']) . ' | SULOC';
    $pageDescription = 'Véhicule à vendre : ' . htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model'] . ' ' . $vehicle['year']);
}

include __DIR__ . '/includes/header.php';
?>

<?php if ($isDetailView && $vehicle): ?>
    <!-- ==================== DETAIL VIEW ==================== -->
    
    <!-- Breadcrumb -->
    <section class="bg-gray-50 py-4 border-b">
        <div class="container mx-auto px-6">
            <nav class="flex space-x-2 text-sm text-gray-600">
                <a href="index.php" class="hover:text-gold"><?php echo __('nav_home'); ?></a>
                <span>&gt;</span>
                <a href="vehicles.php" class="hover:text-gold"><?php echo __('nav_vehicles'); ?></a>
                <span>&gt;</span>
                <span class="text-gold font-semibold"><?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?></span>
            </nav>
        </div>
    </section>

    <section class="py-12 bg-white">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                <!-- Main Content (Images + Description) -->
                <div class="lg:col-span-2">
                <h1 class="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                    <?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?>
                    <?php
                    if ($vehicle['status'] === 'negotiating') {
                        echo '<span class="ml-3 text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full align-middle uppercase tracking-wider font-bold">'.__('veh_status_negotiating').'</span>';
                    } elseif ($vehicle['status'] === 'sold') {
                        echo '<span class="ml-3 text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full align-middle uppercase tracking-wider font-bold">'.__('veh_status_sold').'</span>';
                    } else {
                        echo '<span class="ml-3 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full align-middle uppercase tracking-wider font-bold">'.__('veh_status_available').'</span>';
                    }
                    ?>
                </h1>
                <p class="text-gray-500 text-lg mb-6"><?php echo htmlspecialchars($vehicle['year']); ?> • <?php echo htmlspecialchars(ucfirst($vehicle['vehicle_condition'])); ?></p>
                    
                    <!-- Main Image / Gallery -->
                    <div class="mb-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 relative group cursor-zoom-in" id="main-image-container" onclick="openLightbox(0)">
                        <?php if (!empty($vehicle['main_image'])): ?>
                            <img src="<?php echo htmlspecialchars($vehicle['main_image']); ?>" id="main-display-image" alt="<?php echo htmlspecialchars($vehicle['brand']); ?>" class="w-full h-auto object-cover transition duration-300 group-hover:scale-105">
                            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                                <i class="fas fa-search-plus text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
                            </div>
                            
                            <?php if ($vehicle['status'] === 'sold'): ?>
                                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[5] pointer-events-none">
                                    <span class="border-8 border-white text-white font-black text-6xl px-12 py-4 uppercase transform -rotate-12 select-none">VENDU</span>
                                </div>
                            <?php endif; ?>
                        <?php else: ?>
                            <div class="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400">
                                <i class="fas fa-car text-6xl"></i>
                            </div>
                        <?php endif; ?>
                    </div>
                    
                    <!-- Gallery Thumbnails -->
                    <?php 
                    // Prepare all images for JS
                    $allImages = [];
                    if (!empty($vehicle['main_image'])) {
                        $allImages[] = ['url' => $vehicle['main_image'], 'alt' => $vehicle['brand']];
                    }
                    foreach ($galleryImages as $img) {
                        $allImages[] = ['url' => $img['image_url'], 'alt' => $img['alt_text']];
                    }
                    ?>
                    
                    <?php if (count($allImages) > 1): ?>
                    <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 mb-8">
                        <?php foreach ($allImages as $index => $imgData): ?>
                        <div class="gallery-thumb rounded-lg overflow-hidden border-2 <?php echo $index === 0 ? 'border-gold' : 'border-gray-200'; ?> cursor-pointer hover:border-gold transition aspect-square" 
                             onclick="updateMainImage('<?php echo htmlspecialchars($imgData['url']); ?>', <?php echo $index; ?>, this)">
                            <img src="<?php echo htmlspecialchars($imgData['url']); ?>" alt="<?php echo htmlspecialchars($imgData['alt']); ?>" class="w-full h-full object-cover">
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>

                    <!-- Vehicle Specs -->
                    <div class="bg-gray-50 rounded-xl p-8 mb-8">
                        <h2 class="text-xl font-bold text-blue-900 mb-6 border-b border-gray-200 pb-2"><?php echo __('veh_specs_title'); ?></h2>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <span class="block text-gray-500 text-sm"><?php echo __('veh_mileage'); ?></span>
                                <span class="font-semibold text-gray-800"><?php echo number_format($vehicle['mileage']); ?> km</span>
                            </div>
                            <div>
                                <span class="block text-gray-500 text-sm"><?php echo __('veh_filter_fuel'); ?></span>
                                <span class="font-semibold text-gray-800"><?php echo ucfirst($vehicle['fuel_type']); ?></span>
                            </div>
                            <div>
                                <span class="block text-gray-500 text-sm"><?php echo __('veh_filter_transmission'); ?></span>
                                <span class="font-semibold text-gray-800"><?php echo ucfirst($vehicle['transmission']); ?></span>
                            </div>
                            <div>
                                <span class="block text-gray-500 text-sm"><?php echo __('veh_engine'); ?></span>
                                <span class="font-semibold text-gray-800"><?php echo htmlspecialchars($vehicle['engine_size']); ?></span>
                            </div>
                            <div>
                                <span class="block text-gray-500 text-sm"><?php echo __('veh_color'); ?></span>
                                <span class="font-semibold text-gray-800"><?php echo htmlspecialchars($vehicle['color']); ?></span>
                            </div>
                            <div>
                                <span class="block text-gray-500 text-sm"><?php echo __('veh_doors_seats'); ?></span>
                                <span class="font-semibold text-gray-800"><?php echo $vehicle['doors']; ?> / <?php echo $vehicle['seats']; ?></span>
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="prose max-w-none text-gray-700">
                        <h2 class="text-2xl font-bold text-blue-900 mb-4">Description</h2>
                        <?php echo nl2br(htmlspecialchars($vehicle['description'])); ?>
                    </div>
                </div>

                <!-- Lightbox Overlay -->
                <div id="vehicle-lightbox" class="fixed inset-0 bg-black bg-opacity-95 z-[999] hidden flex-col items-center justify-center p-4 md:p-10 transition-all duration-300">
                    <!-- Close Button -->
                    <button onclick="closeLightbox()" class="absolute top-6 right-6 text-white text-3xl hover:text-gold transition z-[1001]">
                        <i class="fas fa-times"></i>
                    </button>

                    <!-- Navigation Arrows -->
                    <button onclick="navigateLightbox(-1)" class="absolute left-4 top-1/2 -ms-3 text-white text-4xl hover:text-gold transition z-[1001] p-4">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button onclick="navigateLightbox(1)" class="absolute right-4 top-1/2 -ms-3 text-white text-4xl hover:text-gold transition z-[1001] p-4">
                        <i class="fas fa-chevron-right"></i>
                    </button>

                    <!-- Main Lightbox Image -->
                    <div class="relative w-full h-full flex items-center justify-center">
                        <img id="lightbox-image" src="" alt="Zoom" class="max-w-full max-h-full object-contain shadow-2xl animate-fade-in">
                    </div>

                    <!-- Counter -->
                    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-semibold bg-black bg-opacity-50 px-4 py-2 rounded-full border border-gray-700">
                        <span id="lightbox-counter">1 / 1</span>
                    </div>
                </div>

                <style>
                    @keyframes fade-in {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.3s ease-out forwards;
                    }
                    #vehicle-lightbox.active {
                        display: flex;
                    }
                </style>

                <script>
                    const vehicleImages = <?php echo json_encode($allImages); ?>;
                    let currentLightboxIndex = 0;

                    function updateMainImage(url, index, thumb) {
                        // Update main display
                        const mainImg = document.getElementById('main-display-image');
                        if (mainImg) {
                            mainImg.classList.add('opacity-50');
                            setTimeout(() => {
                                mainImg.src = url;
                                mainImg.classList.remove('opacity-50');
                            }, 150);
                        }
                        
                        // Update container onclick index
                        document.getElementById('main-image-container').setAttribute('onclick', `openLightbox(${index})`);
                        
                        // Update active thumb styling
                        document.querySelectorAll('.gallery-thumb').forEach(t => {
                            t.classList.remove('border-gold');
                            t.classList.add('border-gray-200');
                        });
                        thumb.classList.add('border-gold');
                        thumb.classList.remove('border-gray-200');
                    }

                    function openLightbox(index) {
                        currentLightboxIndex = index;
                        const lightbox = document.getElementById('vehicle-lightbox');
                        const img = document.getElementById('lightbox-image');
                        const counter = document.getElementById('lightbox-counter');
                        
                        img.src = vehicleImages[index].url;
                        counter.innerText = `${index + 1} / ${vehicleImages.length}`;
                        
                        lightbox.classList.add('active');
                        lightbox.classList.remove('hidden');
                        document.body.style.overflow = 'hidden';
                    }

                    function closeLightbox() {
                        const lightbox = document.getElementById('vehicle-lightbox');
                        lightbox.classList.remove('active');
                        lightbox.classList.add('hidden');
                        document.body.style.overflow = 'auto';
                    }

                    function navigateLightbox(direction) {
                        currentLightboxIndex = (currentLightboxIndex + direction + vehicleImages.length) % vehicleImages.length;
                        const img = document.getElementById('lightbox-image');
                        const counter = document.getElementById('lightbox-counter');
                        
                        // Simple cross-fade effect
                        img.classList.remove('animate-fade-in');
                        void img.offsetWidth; // Trigger reflow
                        img.classList.add('animate-fade-in');
                        
                        img.src = vehicleImages[currentLightboxIndex].url;
                        counter.innerText = `${currentLightboxIndex + 1} / ${vehicleImages.length}`;
                    }

                    // Keyboard support
                    document.addEventListener('keydown', (e) => {
                        const lightbox = document.getElementById('vehicle-lightbox');
                        if (lightbox && !lightbox.classList.contains('hidden')) {
                            if (e.key === 'Escape') closeLightbox();
                            if (e.key === 'ArrowLeft') navigateLightbox(-1);
                            if (e.key === 'ArrowRight') navigateLightbox(1);
                        }
                    });
                </script>

                <!-- Sidebar (CTA) -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-xl border border-gray-100 p-8 sticky top-24">
                        <div class="mb-6">
                            <span class="block text-gray-500 mb-1"><?php echo __('veh_filter_price_min'); ?></span>
                            <div class="text-4xl font-bold text-gold">
                                <?php echo number_format($vehicle['price']); ?> <span class="text-xl"><?php echo htmlspecialchars($vehicle['currency']); ?></span>
                            </div>
                        </div>

                                                <!-- Status Specific Messages and Logic -->
                        <?php if ($vehicle['status'] === 'sold'): ?>
                            <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-info-circle text-red-500"></i>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm text-red-700 font-bold">
                                            <?php echo __('veh_sold_notice'); ?>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-4 opacity-50 pointer-events-none">
                                <div class="block w-full text-center bg-gray-400 text-white font-bold py-4 rounded-lg uppercase">
                                    <?php echo __('veh_status_sold'); ?>
                                </div>
                            </div>
                        <?php elseif ($vehicle['status'] === 'negotiating'): ?>
                            <div class="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-history text-orange-500"></i>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm text-orange-700 font-bold">
                                            <?php echo __('veh_negotiating_notice'); ?>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <a href="https://wa.me/25779496117?text=<?php echo urlencode("Bonjour SULOC, je souhaite des informations sur le véhicule en négociation : " . $vehicle['brand'] . ' ' . $vehicle['model']); ?>" 
                                   target="_blank"
                                   class="block w-full text-center bg-green-500 text-white font-bold py-4 rounded-lg hover:bg-green-600 transition shadow-lg transform hover:scale-[1.02]">
                                    <i class="fab fa-whatsapp mr-2"></i> <?php echo __('veh_btn_whatsapp_info'); ?>
                                </a>
                                
                                <a href="index.php?service_type=Importation%20de%20Véhicules#contact" 
                                   class="block w-full text-center bg-blue-900 text-white font-bold py-4 rounded-lg hover:bg-blue-800 transition shadow-lg">
                                    <i class="fas fa-envelope mr-2"></i> <?php echo __('veh_btn_counter_offer'); ?>
                                </a>
                            </div>
                        <?php else: ?>
                            <div class="space-y-4">
                                <a href="https://wa.me/25779496117?text=<?php echo urlencode("Bonjour SULOC, je suis intéressé par le véhicule : " . $vehicle['brand'] . ' ' . $vehicle['model']); ?>" 
                                   target="_blank"
                                   class="block w-full text-center bg-green-500 text-white font-bold py-4 rounded-lg hover:bg-green-600 transition shadow-lg transform hover:scale-[1.02]">
                                    <i class="fab fa-whatsapp mr-2"></i> Discuter sur WhatsApp
                                </a>
                                
                                <a href="index.php?service_type=Importation%20de%20Véhicules#contact" 
                                   class="block w-full text-center bg-blue-900 text-white font-bold py-4 rounded-lg hover:bg-blue-800 transition shadow-lg">
                                    <i class="fas fa-envelope mr-2"></i> <?php echo __('veh_btn_request_offer'); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        </div>
                        
                        <div class="mt-8 pt-6 border-t border-gray-100">
                            <h3 class="font-bold text-blue-900 mb-2">Besoin d'aide ?</h3>
                            <p class="text-gray-600 text-sm mb-2">Appelez nos experts pour plus d'infos :</p>
                            <a href="tel:+25779496117" class="text-blue-600 font-bold hover:underline">+257 79 496 117</a>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </section>

<?php else: ?>
    <!-- ==================== CATALOG VIEW ==================== -->
    
    <section class="bg-blue-900 text-white py-20 relative overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="container mx-auto px-6 relative z-10 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4"><?php echo __('veh_catalog_title'); ?></h1>
            <p class="text-xl text-blue-100 max-w-2xl mx-auto">
                <?php echo __('veh_catalog_subtitle'); ?>
            </p>
        </div>
    </section>

    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-6">
            
            <!-- Filter Bar -->
            <div class="bg-white p-6 rounded-xl shadow-md mb-12 border border-gray-100">
                <form action="vehicles.php" method="GET" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <!-- Brand -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1"><?php echo __('veh_filter_brand'); ?></label>
                        <select name="brand" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-50">
                            <option value=""><?php echo __('veh_filter_all_brands'); ?></option>
                            <?php foreach ($brands as $brand): ?>
                                <option value="<?php echo htmlspecialchars($brand); ?>" <?php echo $f_brand === $brand ? 'selected' : ''; ?>><?php echo htmlspecialchars($brand); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <!-- Model -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Modèle</label>
                        <input type="text" name="model" value="<?php echo htmlspecialchars($f_model); ?>" placeholder="Ex: RAV4" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-50">
                    </div>

                    <!-- Year -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Année</label>
                        <select name="year" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-50">
                            <option value="">Toutes les années</option>
                            <?php foreach ($years as $yr): ?>
                                <option value="<?php echo $yr; ?>" <?php echo (string)$f_year === (string)$yr ? 'selected' : ''; ?>><?php echo $yr; ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <!-- Transmission -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Transmission</label>
                        <select name="transmission" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-50">
                            <option value="">Toutes</option>
                            <option value="automatic" <?php echo $f_transmission === 'automatic' ? 'selected' : ''; ?>>Automatique</option>
                            <option value="manual" <?php echo $f_transmission === 'manual' ? 'selected' : ''; ?>>Manuelle</option>
                        </select>
                    </div>

                    <!-- Fuel -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Carburant</label>
                        <select name="fuel_type" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-50">
                            <option value="">Tous</option>
                            <option value="petrol" <?php echo $f_fuel === 'petrol' ? 'selected' : ''; ?>>Essence</option>
                            <option value="diesel" <?php echo $f_fuel === 'diesel' ? 'selected' : ''; ?>>Diesel</option>
                            <option value="hybrid" <?php echo $f_fuel === 'hybrid' ? 'selected' : ''; ?>>Hybride</option>
                            <option value="electric" <?php echo $f_fuel === 'electric' ? 'selected' : ''; ?>>Électrique</option>
                        </select>
                    </div>

                    <!-- Condition -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1"><?php echo __('veh_filter_condition'); ?></label>
                        <select name="condition" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-50">
                            <option value=""><?php echo __('veh_filter_all'); ?></option>
                            <option value="new" <?php echo $f_condition === 'new' ? 'selected' : ''; ?>><?php echo __('veh_condition_new'); ?></option>
                            <option value="used" <?php echo $f_condition === 'used' ? 'selected' : ''; ?>><?php echo __('veh_condition_used'); ?></option>
                            <option value="certified" <?php echo $f_condition === 'certified' ? 'selected' : ''; ?>><?php echo __('veh_condition_certified'); ?></option>
                        </select>
                    </div>

                    <!-- Status -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1"><?php echo __('veh_filter_status'); ?></label>
                        <select name="status" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-50">
                            <option value=""><?php echo __('veh_filter_all_status'); ?></option>
                            <option value="available" <?php echo $f_status === 'available' ? 'selected' : ''; ?>><?php echo __('veh_status_available'); ?></option>
                            <option value="negotiating" <?php echo $f_status === 'negotiating' ? 'selected' : ''; ?>><?php echo __('veh_status_negotiating'); ?></option>
                            <option value="sold" <?php echo $f_status === 'sold' ? 'selected' : ''; ?>><?php echo __('veh_status_sold'); ?></option>
                        </select>
                    </div>

                    <!-- Price Min -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Prix Min</label>
                        <input type="number" name="price_min" value="<?php echo $f_price_min > 0 ? $f_price_min : ''; ?>" placeholder="Min" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-50">
                    </div>

                    <!-- Price Max -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Prix Max</label>
                        <input type="number" name="price_max" value="<?php echo $f_price_max > 0 ? $f_price_max : ''; ?>" placeholder="Max" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-50">
                    </div>

                    <!-- Actions -->
                    <div class="md:col-span-3 lg:col-span-1 xl:col-span-1 flex items-end space-x-2">
                        <button type="submit" class="flex-1 bg-blue-900 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition">
                            <i class="fas fa-filter mr-2"></i> <?php echo __('veh_btn_filter'); ?>
                        </button>
                        <a href="vehicles.php" class="bg-gray-200 text-gray-700 font-bold py-2 px-3 rounded-lg hover:bg-gray-300 transition" title="Réinitialiser">
                            <i class="fas fa-sync-alt"></i>
                        </a>
                    </div>
                </form>
            </div>
            
            <?php if (empty($vehicles)): ?>
                <div class="text-center py-20">
                    <div class="inline-block p-6 rounded-full bg-blue-100 text-blue-900 mb-4">
                        <i class="fas fa-car-side text-4xl"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2"><?php echo __('veh_no_results_title'); ?></h2>
                    <p class="text-gray-600 mb-8"><?php echo __('veh_no_results_desc'); ?></p>
                    <a href="index.php?service_type=Importation%20de%20Véhicules#contact" class="bg-gold text-white px-8 py-3 rounded-lg font-bold hover:bg-gold-dark transition">
                        <?php echo __('veh_btn_contact_custom'); ?>
                    </a>
                </div>
            <?php else: ?>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <?php foreach ($vehicles as $vehicle): ?>
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition duration-300 border border-gray-100">
                        <!-- Image -->
                        <div class="relative h-64 overflow-hidden">
                            <?php if ($vehicle['is_featured']): ?>
                                <div class="absolute top-4 left-4 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full z-10 uppercase tracking-wide">
                                    En Vedette
                                </div>
                            <?php endif; ?>
                            
                            <a href="vehicles.php?slug=<?php echo htmlspecialchars($vehicle['slug']); ?>">
                                <?php if (!empty($vehicle['main_image'])): ?>
                                    <img src="<?php echo htmlspecialchars($vehicle['main_image']); ?>" 
                                         alt="<?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?>" 
                                         class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500">
                                <?php else: ?>
                                    <div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                        <i class="fas fa-car text-5xl"></i>
                                    </div>
                                <?php endif; ?>

                                <!-- Status Badge Overlay -->
                                <?php
                                $statusLabel = '';
                                $statusClass = '';
                                if ($vehicle['status'] === 'negotiating') {
                                    $statusLabel = 'En Négociation';
                                    $statusClass = 'bg-orange-500';
                                } elseif ($vehicle['status'] === 'sold') {
                                    $statusLabel = 'Vendu';
                                    $statusClass = 'bg-red-600';
                                } else {
                                    $statusLabel = 'Disponible';
                                    $statusClass = 'bg-green-500';
                                }
                                ?>
                                <div class="absolute bottom-4 left-4 <?php echo $statusClass; ?> text-white text-xs font-bold px-3 py-1 rounded-full z-10 uppercase tracking-wide shadow-lg">
                                    <?php echo $statusLabel; ?>
                                </div>
                                
                                <?php if ($vehicle['status'] === 'sold'): ?>
                                    <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[5]">
                                        <span class="border-4 border-white text-white font-black text-2xl px-6 py-2 uppercase transform -rotate-12">VENDU</span>
                                    </div>
                                <?php endif; ?>
                            </a>
                        </div>
                        
                        <!-- Content -->
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <div class="text-gray-500 text-sm font-medium mb-1"><?php echo htmlspecialchars($vehicle['year']); ?></div>
                                    <h3 class="text-xl font-bold text-blue-900 group-hover:text-gold transition">
                                        <a href="vehicles.php?slug=<?php echo htmlspecialchars($vehicle['slug']); ?>">
                                            <?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?>
                                        </a>
                                    </h3>
                                </div>
                                <div class="bg-blue-50 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                                    <?php echo htmlspecialchars(ucfirst($vehicle['vehicle_condition'])); ?>
                                </div>
                            </div>
                            
                            <!-- Key Specs -->
                            <div class="flex items-center space-x-4 my-4 text-sm text-gray-600 border-t border-b border-gray-100 py-3">
                                <div class="flex items-center" title="Transmission">
                                    <i class="fas fa-cogs mr-2 text-gold"></i> <?php echo ucfirst(substr($vehicle['transmission'], 0, 4)); ?>.
                                </div>
                                <div class="flex items-center" title="Carburant">
                                    <i class="fas fa-gas-pump mr-2 text-gold"></i> <?php echo ucfirst($vehicle['fuel_type']); ?>
                                </div>
                                <div class="flex items-center" title="Kilométrage">
                                    <i class="fas fa-tachometer-alt mr-2 text-gold"></i> <?php echo number_format($vehicle['mileage']); ?> km
                                </div>
                            </div>
                            
                            <div class="flex justify-between items-center mt-4">
                                <div class="text-2xl font-bold text-blue-900">
                                    <?php echo number_format($vehicle['price']); ?> <span class="text-sm font-normal text-gray-500"><?php echo htmlspecialchars($vehicle['currency']); ?></span>
                                </div>
                                <a href="vehicles.php?slug=<?php echo htmlspecialchars($vehicle['slug']); ?>" 
                                   class="inline-block border-2 border-blue-900 text-blue-900 px-4 py-2 rounded-lg font-bold hover:bg-blue-900 hover:text-white transition text-sm">
                                    <?php echo __('veh_btn_details'); ?>
                                </a>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            
        </div>
    </section>

<?php endif; ?>

<?php include __DIR__ . '/includes/footer.php'; ?>
