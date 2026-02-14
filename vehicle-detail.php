<?php
/**
 * SULOC - Vehicle Detail Page
 * Displays individual vehicle with image gallery and inquiry form
 */

require_once __DIR__ . '/config/config.php';

// Get vehicle slug from URL
$slug = $_GET['slug'] ?? '';

if (empty($slug)) {
    header("Location: vehicles.php");
    exit;
}

// Load vehicle from database
$pdo = getDBConnection();
$stmt = $pdo->prepare("SELECT * FROM vehicles WHERE slug = ? AND is_active = 1");
$stmt->execute([$slug]);
$vehicle = $stmt->fetch();

if (!$vehicle) {
    header("HTTP/1.0 404 Not Found");
    $pageTitle = 'Véhicule Non Trouvé | SULOC';
    include __DIR__ . '/includes/header.php';
    echo '<section class="py-24 bg-white"><div class="container mx-auto px-6 text-center">';
    echo '<h1 class="text-4xl font-bold text-blue-900 mb-4">Véhicule Non Trouvé</h1>';
    echo '<p class="text-xl text-gray-600 mb-4">Le véhicule demandé n\'existe pas ou n\'est plus disponible.</p>';
    echo '<a href="vehicles.php" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Retour au Catalogue</a>';
    echo '</div></section>';
    include __DIR__ . '/includes/footer.php';
    exit;
}

// Get vehicle images
$stmt = $pdo->prepare("SELECT * FROM vehicle_images WHERE vehicle_id = ? ORDER BY order_index ASC");
$stmt->execute([$vehicle['id']]);
$images = $stmt->fetchAll();

// If no images in vehicle_images table, use main_image
if (empty($images) && !empty($vehicle['main_image'])) {
    $images = [['image_url' => $vehicle['main_image'], 'alt_text' => $vehicle['brand'] . ' ' . $vehicle['model']]];
}

$pageTitle = htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model'] . ' ' . $vehicle['year']) . ' | SULOC';
$pageDescription = htmlspecialchars($vehicle['description'] ?? 'Véhicule disponible chez SULOC');

include __DIR__ . '/includes/header.php';
?>

<style>
    .vehicle-detail-hero {
        background: linear-gradient(135deg, #003060 0%, #002850 100%);
    }
    
    .gallery-main {
        position: relative;
        width: 100%;
        height: 500px;
        background: #f3f4f6;
        border-radius: 1rem;
        overflow: hidden;
    }
    
    .gallery-main img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        cursor: zoom-in;
    }
    
    .gallery-thumbnails {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 0.75rem;
        margin-top: 1rem;
    }
    
    .gallery-thumbnail {
        position: relative;
        width: 100%;
        height: 80px;
        border-radius: 0.5rem;
        overflow: hidden;
        cursor: pointer;
        border: 3px solid transparent;
        transition: all 0.3s;
    }
    
    .gallery-thumbnail:hover,
    .gallery-thumbnail.active {
        border-color: #D0A040;
        transform: scale(1.05);
    }
    
    .gallery-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .spec-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 1rem;
        background: #f3f4f6;
        border-radius: 0.5rem;
        margin: 0.25rem;
    }
    
    .spec-badge i {
        margin-right: 0.5rem;
        color: #D0A040;
    }
    
    .price-tag {
        font-size: 2.5rem;
        font-weight: 800;
        color: #D0A040;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    
    .inquiry-form {
        background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
        border: 2px solid #D0A040;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .whatsapp-btn {
        background: #25D366;
        color: white;
        display: inline-flex;
        align-items: center;
        padding: 1rem 2rem;
        border-radius: 9999px;
        font-weight: bold;
        transition: all 0.3s;
        text-decoration: none;
    }
    
    .whatsapp-btn:hover {
        background: #128C7E;
        transform: scale(1.05);
        box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3);
    }
    
    .whatsapp-btn i {
        margin-right: 0.5rem;
        font-size: 1.5rem;
    }
    
    /* Lightbox styles */
    .lightbox {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 9999;
        align-items: center;
        justify-content: center;
    }
    
    .lightbox.active {
        display: flex;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .lightbox-img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
    }
    
    .lightbox-close {
        position: absolute;
        top: 20px;
        right: 20px;
        color: white;
        font-size: 3rem;
        cursor: pointer;
        z-index: 10000;
        background: rgba(0,0,0,0.5);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
    }
    
    .lightbox-close:hover {
        background: rgba(208, 160, 64, 0.8);
        transform: rotate(90deg);
    }
    
    .lightbox-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        font-size: 2rem;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.3s;
        border-radius: 0.5rem;
    }
    
    .lightbox-nav:hover {
        background: rgba(208, 160, 64, 0.8);
    }
    
    .lightbox-prev {
        left: 20px;
    }
    
    .lightbox-next {
        right: 20px;
    }
</style>

<!-- Breadcrumb -->
<section class="bg-gray-50 py-4 border-b">
    <div class="container mx-auto px-6">
        <nav class="flex space-x-2 text-sm text-gray-600">
            <a href="<?php echo SITE_URL; ?>/index.php" class="hover:text-gold">Accueil</a>
            <span>></span>
            <a href="vehicles.php" class="hover:text-gold">Véhicules</a>
            <span>></span>
            <span class="text-gold"><?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?></span>
        </nav>
    </div>
</section>

<!-- Vehicle Hero -->
<section class="vehicle-detail-hero text-white py-12">
    <div class="container mx-auto px-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-4xl md:text-5xl font-bold mb-2">
                    <?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model']); ?>
                </h1>
                <p class="text-xl opacity-90">Année <?php echo $vehicle['year']; ?></p>
            </div>
                <div class="text-right">
                    <div class="price-tag">
                        <?php echo number_format($vehicle['price'], 0, ',', ' '); ?> <?php echo htmlspecialchars($vehicle['currency']); ?>
                    </div>
                    <div class="mt-2">
                        <?php if ($vehicle['status'] === 'negotiating'): ?>
                            <span class="inline-block bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-bold uppercase">En Négociation</span>
                        <?php elseif ($vehicle['status'] === 'sold'): ?>
                            <span class="inline-block bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-bold uppercase">Vendu</span>
                        <?php else: ?>
                            <span class="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold uppercase">Disponible</span>
                        <?php endif; ?>
                        
                        <?php if ($vehicle['is_featured']): ?>
                        <span class="inline-block bg-gold text-white px-4 py-1 rounded-full text-sm font-semibold ml-2">
                            <i class="fas fa-star mr-1"></i> En Vedette
                        </span>
                        <?php endif; ?>
                    </div>
                </div>
        </div>
    </div>
</section>

<!-- Main Content -->
<section class="py-12 bg-white">
    <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column: Gallery & Details -->
            <div class="lg:col-span-2">
                <!-- Image Gallery -->
                <div class="mb-8">
                    <div class="gallery-main relative" id="gallery-main">
                        <?php if (!empty($images)): ?>
                        <img src="<?php echo htmlspecialchars($images[0]['image_url']); ?>" 
                             alt="<?php echo htmlspecialchars($images[0]['alt_text'] ?? $vehicle['brand'] . ' ' . $vehicle['model']); ?>"
                             id="main-image"
                             onclick="openLightbox(0)">
                        
                        <?php if ($vehicle['status'] === 'sold'): ?>
                            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center pointer-events-none z-10">
                                <span class="border-8 border-white text-white font-black text-5xl px-10 py-3 uppercase transform -rotate-12 select-none">VENDU</span>
                            </div>
                        <?php endif; ?>
                        <?php else: ?>
                        <div class="flex items-center justify-center h-full text-gray-400">
                            <i class="fas fa-car text-6xl"></i>
                        </div>
                        <?php endif; ?>
                    </div>
                    
                    <?php if (count($images) > 1): ?>
                    <div class="gallery-thumbnails">
                        <?php foreach ($images as $index => $image): ?>
                        <div class="gallery-thumbnail <?php echo $index === 0 ? 'active' : ''; ?>" 
                             onclick="changeImage(<?php echo $index; ?>)"
                             data-index="<?php echo $index; ?>">
                            <img src="<?php echo htmlspecialchars($image['image_url']); ?>" 
                                 alt="<?php echo htmlspecialchars($image['alt_text'] ?? 'Image ' . ($index + 1)); ?>">
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>
                </div>
                
                <!-- Specifications -->
                <div class="bg-gray-50 rounded-xl p-6 mb-8">
                    <h2 class="text-2xl font-bold text-blue-900 mb-4">Caractéristiques Techniques</h2>
                    <div class="flex flex-wrap -m-1">
                        <span class="spec-badge">
                            <i class="fas fa-calendar"></i>
                            <span><strong>Année:</strong> <?php echo $vehicle['year']; ?></span>
                        </span>
                        <span class="spec-badge">
                            <i class="fas fa-cogs"></i>
                            <span><strong>Transmission:</strong> <?php echo ucfirst($vehicle['transmission']); ?></span>
                        </span>
                        <span class="spec-badge">
                            <i class="fas fa-gas-pump"></i>
                            <span><strong>Carburant:</strong> <?php echo ucfirst($vehicle['fuel_type']); ?></span>
                        </span>
                        <?php if ($vehicle['mileage']): ?>
                        <span class="spec-badge">
                            <i class="fas fa-tachometer-alt"></i>
                            <span><strong>Kilométrage:</strong> <?php echo number_format($vehicle['mileage'], 0, ',', ' '); ?> km</span>
                        </span>
                        <?php endif; ?>
                        <?php if ($vehicle['color']): ?>
                        <span class="spec-badge">
                            <i class="fas fa-palette"></i>
                            <span><strong>Couleur:</strong> <?php echo htmlspecialchars($vehicle['color']); ?></span>
                        </span>
                        <?php endif; ?>
                        <?php if ($vehicle['engine_size']): ?>
                        <span class="spec-badge">
                            <i class="fas fa-engine"></i>
                            <span><strong>Moteur:</strong> <?php echo htmlspecialchars($vehicle['engine_size']); ?></span>
                        </span>
                        <?php endif; ?>
                        <span class="spec-badge">
                            <i class="fas fa-door-closed"></i>
                            <span><strong>Portes:</strong> <?php echo $vehicle['doors']; ?></span>
                        </span>
                        <span class="spec-badge">
                            <i class="fas fa-users"></i>
                            <span><strong>Places:</strong> <?php echo $vehicle['seats']; ?></span>
                        </span>
                        <span class="spec-badge">
                            <i class="fas fa-certificate"></i>
                            <span><strong>État:</strong> <?php echo ucfirst($vehicle['vehicle_condition']); ?></span>
                        </span>
                    </div>
                </div>
                
                <!-- Description -->
                <?php if ($vehicle['description']): ?>
                <div class="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 class="text-2xl font-bold text-blue-900 mb-4">Description</h2>
                    <p class="text-gray-700 leading-relaxed">
                        <?php echo nl2br(htmlspecialchars($vehicle['description'])); ?>
                    </p>
                </div>
                <?php endif; ?>
            </div>
            
            <!-- Right Column: Inquiry Form -->
            <div class="lg:col-span-1">
                <div class="inquiry-form sticky top-24">
                    <h3 class="text-2xl font-bold text-blue-900 mb-4">Demande d'Information</h3>
                    <p class="text-gray-600 mb-6">Remplissez ce formulaire pour obtenir plus d'informations sur ce véhicule.</p>
                    
                    <?php if ($vehicle['status'] === 'sold'): ?>
                        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
                            <i class="fas fa-info-circle text-red-500 text-2xl mb-2"></i>
                            <p class="text-red-800 font-bold">Ce véhicule a été vendu.</p>
                            <p class="text-red-600 text-sm">Il reste affiché pour information uniquement.</p>
                        </div>
                    <?php elseif ($vehicle['status'] === 'negotiating'): ?>
                        <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 text-center">
                            <i class="fas fa-history text-orange-500 text-2xl mb-2"></i>
                            <p class="text-orange-800 font-bold">En cours de négociation.</p>
                            <p class="text-orange-600 text-sm">Contactez-nous pour plus de détails.</p>
                        </div>
                    <?php endif; ?>

                    <form id="vehicle-inquiry-form" method="POST" action="<?php echo SITE_URL; ?>/includes/submit-vehicle-inquiry.php" <?php echo $vehicle['status'] === 'sold' ? 'class="hidden"' : ''; ?>>
                        <input type="hidden" name="vehicle_id" value="<?php echo $vehicle['id']; ?>">
                        <input type="hidden" name="vehicle_name" value="<?php echo htmlspecialchars($vehicle['brand'] . ' ' . $vehicle['model'] . ' ' . $vehicle['year']); ?>">
                        
                        <div class="mb-4">
                            <label class="block text-gray-700 font-semibold mb-2" for="client_name">Nom Complet *</label>
                            <input type="text" id="client_name" name="client_name" required 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        </div>
                        
                        <div class="mb-4">
                            <label class="block text-gray-700 font-semibold mb-2" for="client_email">Email</label>
                            <input type="email" id="client_email" name="client_email" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        </div>
                        
                        <div class="mb-4">
                            <label class="block text-gray-700 font-semibold mb-2" for="client_phone">Téléphone *</label>
                            <input type="tel" id="client_phone" name="client_phone" required 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        </div>
                        
                        <div class="mb-4">
                            <label class="block text-gray-700 font-semibold mb-2" for="client_whatsapp">WhatsApp</label>
                            <input type="tel" id="client_whatsapp" name="client_whatsapp" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        </div>
                        
                        <div class="mb-6">
                            <label class="block text-gray-700 font-semibold mb-2" for="message">Message</label>
                            <textarea id="message" name="message" rows="4" 
                                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                      placeholder="Questions ou demandes spécifiques..."></textarea>
                        </div>
                        
                        <button type="submit" class="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition mb-3">
                            <i class="fas fa-paper-plane mr-2"></i> Envoyer la Demande
                        </button>
                    </form>
                    
                    <div class="text-center mt-4">
                        <?php if ($vehicle['status'] !== 'sold'): ?>
                            <p class="text-gray-600 text-sm mb-3">Ou contactez-nous directement</p>
                            <a href="https://wa.me/25762400920?text=Bonjour SULOC, je suis intéressé par le <?php echo urlencode($vehicle['brand'] . ' ' . $vehicle['model'] . ' ' . $vehicle['year']); ?>" 
                               class="whatsapp-btn w-full justify-center" target="_blank">
                                <i class="fab fa-whatsapp"></i>
                                Contacter via WhatsApp
                            </a>
                        <?php else: ?>
                            <div class="bg-gray-100 text-gray-500 py-3 rounded-lg font-bold cursor-not-allowed">
                                <i class="fas fa-lock mr-2"></i> CONTACT INDISPONIBLE
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Lightbox -->
<div class="lightbox" id="lightbox">
    <span class="lightbox-close" onclick="closeLightbox()">
        <i class="fas fa-times"></i>
    </span>
    <?php if (count($images) > 1): ?>
    <button class="lightbox-nav lightbox-prev" onclick="navigateLightbox(-1)">
        <i class="fas fa-chevron-left"></i>
    </button>
    <button class="lightbox-nav lightbox-next" onclick="navigateLightbox(1)">
        <i class="fas fa-chevron-right"></i>
    </button>
    <?php endif; ?>
    <div class="lightbox-content">
        <img class="lightbox-img" id="lightbox-img" src="" alt="">
    </div>
</div>

<script>
    // Gallery data
    const images = <?php echo json_encode($images); ?>;
    let currentImageIndex = 0;
    
    // Change main image
    function changeImage(index) {
        currentImageIndex = index;
        const mainImg = document.getElementById('main-image');
        mainImg.src = images[index].image_url;
        mainImg.alt = images[index].alt_text || 'Vehicle image';
        
        // Update active thumbnail
        document.querySelectorAll('.gallery-thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
    
    // Lightbox functions
    function openLightbox(index) {
        currentImageIndex = index;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        lightboxImg.src = images[index].image_url;
        lightboxImg.alt = images[index].alt_text || 'Vehicle image';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function navigateLightbox(direction) {
        currentImageIndex += direction;
        if (currentImageIndex < 0) currentImageIndex = images.length - 1;
        if (currentImageIndex >= images.length) currentImageIndex = 0;
        
        const lightboxImg = document.getElementById('lightbox-img');
        lightboxImg.src = images[currentImageIndex].image_url;
        lightboxImg.alt = images[currentImageIndex].alt_text || 'Vehicle image';
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        }
    });
    
    // Close lightbox on background click
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') closeLightbox();
    });
    
    // Form submission
    document.getElementById('vehicle-inquiry-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Votre demande a été envoyée avec succès! Nous vous contacterons bientôt.');
                form.reset();
            } else {
                alert('Erreur: ' + (result.message || 'Une erreur est survenue'));
            }
        } catch (error) {
            alert('Erreur de connexion. Veuillez réessayer.');
        }
    });
</script>

<?php include __DIR__ . '/includes/footer.php'; ?>
