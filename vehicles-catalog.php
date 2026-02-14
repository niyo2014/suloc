<?php
/**
 * SULOC - Vehicles Catalog
 * Browse available vehicles with filtering and search
 */

require_once __DIR__ . '/config/config.php';

$pdo = getDBConnection();

// Get filter parameters
$brand = $_GET['brand'] ?? '';
$minPrice = isset($_GET['min_price']) ? floatval($_GET['min_price']) : null;
$maxPrice = isset($_GET['max_price']) ? floatval($_GET['max_price']) : null;
$year = isset($_GET['year']) ? intval($_GET['year']) : null;
$transmission = $_GET['transmission'] ?? '';
$fuelType = $_GET['fuel_type'] ?? '';
$condition = $_GET['condition'] ?? '';
$search = $_GET['search'] ?? '';
$sort = $_GET['sort'] ?? 'newest';

// Build query
$where = ["is_active = 1"];
$params = [];

if (!empty($brand)) {
    $where[] = "brand = ?";
    $params[] = $brand;
}

if ($minPrice !== null) {
    $where[] = "price >= ?";
    $params[] = $minPrice;
}

if ($maxPrice !== null) {
    $where[] = "price <= ?";
    $params[] = $maxPrice;
}

if ($year) {
    $where[] = "year = ?";
    $params[] = $year;
}

if (!empty($transmission)) {
    $where[] = "transmission = ?";
    $params[] = $transmission;
}

if (!empty($fuelType)) {
    $where[] = "fuel_type = ?";
    $params[] = $fuelType;
}

if (!empty($condition)) {
    $where[] = "vehicle_condition = ?";
    $params[] = $condition;
}

if (!empty($search)) {
    $where[] = "(brand LIKE ? OR model LIKE ? OR description LIKE ?)";
    $searchTerm = "%$search%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $params[] = $searchTerm;
}

$whereClause = implode(' AND ', $where);

// Determine sort order
$orderBy = match($sort) {
    'price_asc' => 'price ASC',
    'price_desc' => 'price DESC',
    'year_desc' => 'year DESC',
    'year_asc' => 'year ASC',
    'name' => 'brand ASC, model ASC',
    default => 'created_at DESC, id DESC'
};

// Get vehicles
$sql = "SELECT * FROM vehicles WHERE $whereClause ORDER BY $orderBy";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$vehicles = $stmt->fetchAll();

// Get available brands for filter
$brands = $pdo->query("SELECT DISTINCT brand FROM vehicles WHERE is_active = 1 ORDER BY brand")->fetchAll(PDO::FETCH_COLUMN);

// Get available years for filter
$years = $pdo->query("SELECT DISTINCT year FROM vehicles WHERE is_active = 1 ORDER BY year DESC")->fetchAll(PDO::FETCH_COLUMN);

$pageTitle = 'Catalogue de Véhicules | SULOC';
$pageDescription = 'Découvrez notre sélection de véhicules importés de qualité.';

include __DIR__ . '/includes/header.php';
?>

<style>
    .vehicle-card {
        transition: all 0.3s;
        cursor: pointer;
    }
    
    .vehicle-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    
    .vehicle-card img {
        transition: transform 0.5s;
    }
    
    .vehicle-card:hover img {
        transform: scale(1.1);
    }
    
    .filter-section {
        background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    
    .price-badge {
        background: linear-gradient(135deg, #D0A040 0%, #E0B050 100%);
        color: #003060;
        font-weight: 800;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 1.25rem;
    }
    
    .featured-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: #D0A040;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-weight: bold;
        font-size: 0.875rem;
        z-index: 10;
    }
</style>

<!-- Hero Section -->
<section class="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
    <div class="container mx-auto px-6">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Catalogue de Véhicules</h1>
        <p class="text-xl opacity-90">Découvrez notre sélection de véhicules importés de qualité</p>
    </div>
</section>

<!-- Filters & Search -->
<section class="py-8 bg-gray-50 border-b">
    <div class="container mx-auto px-6">
        <form method="GET" action="" class="filter-section">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <!-- Search -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Rechercher</label>
                    <input type="text" name="search" value="<?php echo htmlspecialchars($search); ?>" 
                           placeholder="Marque, modèle..." 
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                </div>
                
                <!-- Brand -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Marque</label>
                    <select name="brand" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        <option value="">Toutes les marques</option>
                        <?php foreach ($brands as $b): ?>
                        <option value="<?php echo htmlspecialchars($b); ?>" <?php echo $brand === $b ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($b); ?>
                        </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <!-- Year -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Année</label>
                    <select name="year" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        <option value="">Toutes les années</option>
                        <?php foreach ($years as $y): ?>
                        <option value="<?php echo $y; ?>" <?php echo $year === $y ? 'selected' : ''; ?>>
                            <?php echo $y; ?>
                        </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <!-- Transmission -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Transmission</label>
                    <select name="transmission" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        <option value="">Toutes</option>
                        <option value="automatic" <?php echo $transmission === 'automatic' ? 'selected' : ''; ?>>Automatique</option>
                        <option value="manual" <?php echo $transmission === 'manual' ? 'selected' : ''; ?>>Manuelle</option>
                    </select>
                </div>
                
                <!-- Fuel Type -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Carburant</label>
                    <select name="fuel_type" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        <option value="">Tous</option>
                        <option value="petrol" <?php echo $fuelType === 'petrol' ? 'selected' : ''; ?>>Essence</option>
                        <option value="diesel" <?php echo $fuelType === 'diesel' ? 'selected' : ''; ?>>Diesel</option>
                        <option value="hybrid" <?php echo $fuelType === 'hybrid' ? 'selected' : ''; ?>>Hybride</option>
                        <option value="electric" <?php echo $fuelType === 'electric' ? 'selected' : ''; ?>>Électrique</option>
                    </select>
                </div>
                
                <!-- Condition -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">État</label>
                    <select name="condition" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        <option value="">Tous</option>
                        <option value="new" <?php echo $condition === 'new' ? 'selected' : ''; ?>>Neuf</option>
                        <option value="used" <?php echo $condition === 'used' ? 'selected' : ''; ?>>Occasion</option>
                        <option value="certified" <?php echo $condition === 'certified' ? 'selected' : ''; ?>>Certifié</option>
                    </select>
                </div>
                
                <!-- Price Range -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Prix Min (USD)</label>
                    <input type="number" name="min_price" value="<?php echo $minPrice ?? ''; ?>" 
                           placeholder="0" 
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                </div>
                
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Prix Max (USD)</label>
                    <input type="number" name="max_price" value="<?php echo $maxPrice ?? ''; ?>" 
                           placeholder="100000" 
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                </div>
            </div>
            
            <div class="flex flex-wrap gap-3">
                <button type="submit" class="bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition">
                    <i class="fas fa-search mr-2"></i> Rechercher
                </button>
                <a href="vehicles-catalog.php" class="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition">
                    <i class="fas fa-redo mr-2"></i> Réinitialiser
                </a>
            </div>
        </form>
    </div>
</section>

<!-- Results & Sort -->
<section class="py-6 bg-white border-b">
    <div class="container mx-auto px-6">
        <div class="flex justify-between items-center">
            <p class="text-gray-700">
                <strong><?php echo count($vehicles); ?></strong> véhicule(s) trouvé(s)
            </p>
            <div class="flex items-center space-x-3">
                <label class="text-sm font-semibold text-gray-700">Trier par:</label>
                <select name="sort" onchange="updateSort(this.value)" 
                        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                    <option value="newest" <?php echo $sort === 'newest' ? 'selected' : ''; ?>>Plus récents</option>
                    <option value="price_asc" <?php echo $sort === 'price_asc' ? 'selected' : ''; ?>>Prix croissant</option>
                    <option value="price_desc" <?php echo $sort === 'price_desc' ? 'selected' : ''; ?>>Prix décroissant</option>
                    <option value="year_desc" <?php echo $sort === 'year_desc' ? 'selected' : ''; ?>>Année décroissante</option>
                    <option value="year_asc" <?php echo $sort === 'year_asc' ? 'selected' : ''; ?>>Année croissante</option>
                    <option value="name" <?php echo $sort === 'name' ? 'selected' : ''; ?>>Nom (A-Z)</option>
                </select>
            </div>
        </div>
    </div>
</section>

<!-- Vehicles Grid -->
<section class="py-12 bg-gray-50">
    <div class="container mx-auto px-6">
        <?php if (empty($vehicles)): ?>
        <div class="text-center py-16">
            <i class="fas fa-car text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-2xl font-bold text-gray-700 mb-2">Aucun véhicule trouvé</h3>
            <p class="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
            <a href="vehicles-catalog.php" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Voir tous les véhicules
            </a>
        </div>
        <?php else: ?>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($vehicles as $vehicle): ?>
            <div class="vehicle-card bg-white rounded-xl shadow-lg overflow-hidden relative"
                 onclick="window.location.href='vehicle-detail.php?slug=<?php echo htmlspecialchars($vehicle['slug']); ?>'">
                <?php if ($vehicle['is_featured']): ?>
                <div class="featured-badge">
                    <i class="fas fa-star mr-1"></i> Vedette
                </div>
                <?php endif; ?>
                
                <div class="h-56 overflow-hidden bg-gray-200">
                    <?php if ($vehicle['main_image']): ?>
                    <img src="<?php echo htmlspecialchars($vehicle['main_image']); ?>" 
                         alt="<?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?>"
                         class="w-full h-full object-cover">
                    <?php else: ?>
                    <div class="flex items-center justify-center h-full text-gray-400">
                        <i class="fas fa-car text-6xl"></i>
                    </div>
                    <?php endif; ?>

                    <!-- Status Badge Overlay -->
                    <?php
                    $statusLabel = 'Disponible';
                    $statusClass = 'bg-green-500';
                    if ($vehicle['status'] === 'negotiating') {
                        $statusLabel = 'En Négociation';
                        $statusClass = 'bg-orange-500';
                    } elseif ($vehicle['status'] === 'sold') {
                        $statusLabel = 'Vendu';
                        $statusClass = 'bg-red-600';
                    }
                    ?>
                    <div class="absolute bottom-4 left-4 <?php echo $statusClass; ?> text-white text-xs font-bold px-3 py-1 rounded-full z-10 uppercase tracking-wide">
                        <?php echo $statusLabel; ?>
                    </div>
                    
                    <?php if ($vehicle['status'] === 'sold'): ?>
                        <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[5]">
                            <span class="border-2 border-white text-white font-bold text-lg px-4 py-1 uppercase transform -rotate-12">VENDU</span>
                        </div>
                    <?php endif; ?>
                </div>
                
                <div class="p-6">
                    <h3 class="text-2xl font-bold text-blue-900 mb-2">
                        <?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?>
                    </h3>
                    
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-gray-600">
                            <i class="fas fa-calendar mr-1"></i> <?php echo $vehicle['year']; ?>
                        </span>
                        <span class="text-gray-600">
                            <i class="fas fa-tachometer-alt mr-1"></i> 
                            <?php echo $vehicle['mileage'] ? number_format($vehicle['mileage'], 0, ',', ' ') . ' km' : 'N/A'; ?>
                        </span>
                    </div>
                    
                    <div class="flex items-center space-x-3 mb-4 text-sm text-gray-600">
                        <span><i class="fas fa-cogs mr-1"></i> <?php echo ucfirst($vehicle['transmission']); ?></span>
                        <span><i class="fas fa-gas-pump mr-1"></i> <?php echo ucfirst($vehicle['fuel_type']); ?></span>
                    </div>
                    
                    <?php if ($vehicle['description']): ?>
                    <p class="text-gray-600 mb-4 line-clamp-2">
                        <?php echo htmlspecialchars(substr($vehicle['description'], 0, 100)) . '...'; ?>
                    </p>
                    <?php endif; ?>
                    
                    <div class="flex items-center justify-between">
                        <div class="price-badge">
                            <?php echo number_format($vehicle['price'], 0, ',', ' '); ?> <?php echo htmlspecialchars($vehicle['currency']); ?>
                        </div>
                        <a href="vehicle-detail.php?slug=<?php echo htmlspecialchars($vehicle['slug']); ?>" 
                           class="text-blue-900 hover:text-gold font-semibold">
                            Voir détails <i class="fas fa-arrow-right ml-1"></i>
                        </a>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
</section>

<script>
    function updateSort(value) {
        const url = new URL(window.location.href);
        url.searchParams.set('sort', value);
        window.location.href = url.toString();
    }
</script>

<?php include __DIR__ . '/includes/footer.php'; ?>
