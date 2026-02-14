<?php
/**
 * SULOC - Visa Services Hub (Tariffs & Requirements)
 */
require_once __DIR__ . '/config/config.php';

// Detect Language
$lang = $translator->getCurrentLanguage();
$isEn = ($lang === 'en');

$pageTitle = __('visa_page_title') . ' | SULOC';
$pageDescription = __('visa_page_subtitle');

$pdo = getDBConnection();
$visaServices = [];
try {
    // Correct query as per requirements
    $stmt = $pdo->query("SELECT * FROM visa_services WHERE is_active = 1 ORDER BY country_name_fr ASC");
    $visaServices = $stmt->fetchAll();
} catch (Exception $e) {
    $visaServices = [];
}

include __DIR__ . '/includes/header.php';
?>

<style>
    :root {
        --primary-navy: #0a2342;
        --accent-gold: #d4af37;
    }

    .visa-header {
        background: linear-gradient(rgba(10, 35, 66, 0.9), rgba(10, 35, 66, 0.9)), url('img/visa-bg.jpg');
        background-size: cover;
        background-position: center;
    }

    .search-container {
        max-width: 600px;
        margin: -30px auto 40px;
        position: relative;
        z-index: 10;
    }

    .search-input {
        width: 100%;
        padding: 18px 25px 18px 55px;
        border-radius: 50px;
        border: none;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        font-size: 1.1rem;
        outline: none;
        transition: all 0.3s ease;
    }

    .search-input:focus {
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
        transform: translateY(-2px);
    }

    .search-icon {
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--accent-gold);
        font-size: 1.2rem;
    }

    .visa-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 25px;
    }

    .visa-card {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid #f0f0f0;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
    }

    .visa-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.05);
    }

    .card-header {
        background: var(--primary-navy);
        padding: 20px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .card-header h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0;
    }

    .tariff-badge {
        background: var(--accent-gold);
        color: white;
        padding: 5px 15px;
        border-radius: 30px;
        font-weight: 800;
        font-size: 0.9rem;
        white-space: nowrap;
    }

    .card-body {
        padding: 20px;
        flex-grow: 1;
    }

    .info-section {
        margin-bottom: 20px;
    }

    .info-label {
        color: var(--primary-navy);
        font-weight: 700;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
    }

    .info-label i {
        margin-right: 8px;
        color: var(--accent-gold);
    }

    .info-content {
        font-size: 0.95rem;
        color: #555;
        line-height: 1.6;
        position: relative;
        max-height: 80px;
        overflow: hidden;
        transition: max-height 0.5s ease;
    }

    .info-content.expanded {
        max-height: 1000px;
    }

    .toggle-btn {
        color: var(--accent-gold);
        background: transparent;
        border: none;
        font-weight: 700;
        font-size: 0.85rem;
        padding: 0;
        cursor: pointer;
        margin-top: 5px;
        display: flex;
        align-items: center;
    }

    .toggle-btn:hover {
        text-decoration: underline;
    }

    .card-footer {
        padding: 20px;
        border-top: 1px solid #f5f5f5;
    }

    .btn-whatsapp {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #25D366;
        color: white;
        padding: 12px;
        border-radius: 12px;
        font-weight: 700;
        text-decoration: none;
        transition: background 0.3s;
    }

    .btn-whatsapp:hover {
        background: #128C7E;
    }

    .btn-whatsapp i {
        margin-right: 10px;
        font-size: 1.2rem;
    }

    @media (max-width: 640px) {
        .visa-grid {
            grid-template-columns: 1fr;
        }
    }
</style>

<section class="visa-header text-white py-24">
    <div class="container mx-auto px-6 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
            <?php echo __('visa_page_title'); ?>
        </h1>
        <p class="text-xl opacity-90 max-w-2xl mx-auto">
            <?php echo __('visa_page_subtitle'); ?>
        </p>
    </div>
</section>

<div class="container mx-auto px-6 mb-20">
    <!-- Search Bar -->
    <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input type="text" id="country-search" class="search-input" placeholder="<?php echo __('visa_search_placeholder'); ?>">
    </div>

    <!-- Grid -->
    <div class="visa-grid" id="visa-grid">
        <?php if (empty($visaServices)): ?>
            <div class="col-span-full py-20 text-center text-gray-500 bg-white rounded-3xl">
                <i class="fas fa-passport text-5xl mb-4 block opacity-20"></i>
                <p><?php echo __('visa_no_services'); ?></p>
            </div>
        <?php else: ?>
            <?php foreach ($visaServices as $service): ?>
                <?php
                $countryName = $isEn ? ($service['country_name_en'] ?: $service['country_name_fr']) : $service['country_name_fr'];
                $requirements = $isEn ? ($service['requirements_en'] ?: $service['requirements_fr']) : $service['requirements_fr'];
                $documents = $isEn ? ($service['documents_needed_en'] ?: $service['documents_needed_fr']) : $service['documents_needed_fr'];
                
                $fee = $service['service_fee'] !== null ? number_format((float)$service['service_fee'], 0) . ' ' . htmlspecialchars($service['currency'] ?? 'USD') : __('visa_on_request');
                
                $waMsg = urlencode($isEn ? "Hello SULOC, I would like information about the visa for {$countryName}." : "Bonjour SULOC, je souhaite des informations sur le visa pour {$countryName}.");
                ?>
                <div class="visa-card" data-country="<?php echo htmlspecialchars(strtolower($countryName)); ?>">
                    <div class="card-header">
                        <h3><?php echo htmlspecialchars($countryName); ?></h3>
                        <span class="tariff-badge"><?php echo $fee; ?></span>
                    </div>
                    
                    <div class="card-body">
                        <!-- Requirements -->
                        <div class="info-section">
                            <h4 class="info-label"><i class="fas fa-info-circle"></i> <?php echo __('visa_requirements_label'); ?></h4>
                            <div class="info-content" id="req-<?php echo $service['id']; ?>">
                                <?php echo nl2br(htmlspecialchars($requirements)); ?>
                            </div>
                            <button class="toggle-btn" onclick="toggleContent('req-<?php echo $service['id']; ?>', this)">
                                <span>+ <?php echo __('visa_show_more'); ?></span>
                            </button>
                        </div>

                        <!-- Documents -->
                        <div class="info-section">
                            <h4 class="info-label"><i class="fas fa-file-alt"></i> <?php echo __('visa_documents_label'); ?></h4>
                            <div class="info-content" id="doc-<?php echo $service['id']; ?>">
                                <?php echo nl2br(htmlspecialchars($documents)); ?>
                            </div>
                            <button class="toggle-btn" onclick="toggleContent('doc-<?php echo $service['id']; ?>', this)">
                                <span>+ <?php echo __('visa_show_more'); ?></span>
                            </button>
                        </div>
                    </div>

                    <div class="card-footer">
                        <a href="https://wa.me/<?php echo preg_replace('/[^0-9]/', '', getenv('PHONE_WHATSAPP') ?: '25762400920'); ?>?text=<?php echo $waMsg; ?>" target="_blank" class="btn-whatsapp">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>

<script>
    // Real-Time Search Logic
    const searchInput = document.getElementById('country-search');
    const visaGrid = document.getElementById('visa-grid');
    const cards = document.querySelectorAll('.visa-card');

    searchInput.addEventListener('keyup', function() {
        const query = this.value.toLowerCase().trim();
        let hasResults = false;

        cards.forEach(card => {
            const country = card.getAttribute('data-country');
            if (country.includes(query)) {
                card.style.display = 'flex';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Expand/Collapse Logic
    function toggleContent(id, btn) {
        const content = document.getElementById(id);
        const isEn = <?php echo json_encode($isEn); ?>;
        
        if (content.classList.contains('expanded')) {
            content.classList.remove('expanded');
            btn.querySelector('span').textContent = '+ ' + "<?php echo __('visa_show_more'); ?>";
        } else {
            content.classList.add('expanded');
            btn.querySelector('span').textContent = '- ' + "<?php echo __('visa_show_less'); ?>";
        }
    }
</script>

<?php include __DIR__ . '/includes/footer.php'; ?>
