<?php
/**
 * SULOC - Main Homepage
 * Dynamic homepage that loads content from database
 */

require_once __DIR__ . '/config/config.php';

$pageTitle = 'SULOC | Logistique, Visa et Services Administratifs';
$pageDescription = 'SULOC : Facilitation logistique, assistance visa et services administratifs fiables.';

// Load services from database
$pdo = getDBConnection();
$services = [];
$projects = [];
$teamMembers = [];
$contactInfo = [];

// Load active services
try {
    $stmt = $pdo->query("SELECT * FROM services WHERE is_active = 1 ORDER BY order_index ASC");
    $services = $stmt->fetchAll();
} catch (Exception $e) { error_log("Services load error: " . $e->getMessage()); }

// Load active projects
try {
    $stmt = $pdo->query("SELECT * FROM projects WHERE is_active = 1 ORDER BY order_index ASC LIMIT 6");
    $projects = $stmt->fetchAll();
} catch (Exception $e) { error_log("Projects load error: " . $e->getMessage()); }

// Load team members
try {
    $stmt = $pdo->query("SELECT * FROM team_members WHERE is_active = 1 ORDER BY order_index ASC");
    $teamMembers = $stmt->fetchAll();
} catch (Exception $e) { error_log("Team load error: " . $e->getMessage()); }

// Load contact info
try {
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('phone', 'email', 'address', 'representative', 'phone2', 'email2', 'nif', 'authorization_date')");
    while ($row = $stmt->fetch()) {
        $contactInfo[$row['setting_key']] = $row['setting_value'];
    }
} catch (Exception $e) { error_log("Contact info load error: " . $e->getMessage()); }

// Load dynamic homepage content
try {
    $homeContent = [];
    $stmt = $pdo->query("SELECT content_key, content_value FROM site_content");
    while ($row = $stmt->fetch()) {
        $homeContent[$row['content_key']] = $row['content_value'];
    }
} catch (Exception $e) { error_log("Home content load error: " . $e->getMessage()); }

// Set defaults for home content if database is empty
$heroHeadline = $homeContent['hero_headline'] ?? __('home_hero_title');
$heroTagline = $homeContent['hero_tagline'] ?? __('home_hero_tagline');
$heroCta1Text = $homeContent['hero_cta1_text'] ?? __('btn_request_quote');
$heroCta1Link = $homeContent['hero_cta1_link'] ?? '#contact';
$heroCta2Text = $homeContent['hero_cta2_text'] ?? __('btn_discover_services');
$heroCta2Link = $homeContent['hero_cta2_link'] ?? '#services';


// Set defaults if database is empty
$phone = $contactInfo['phone'] ?? '+257 79 496 117';
$phone2 = $contactInfo['phone2'] ?? '+257 69 826 865';
$email = $contactInfo['email'] ?? 'ndayiprud@gmail.com';
$email2 = $contactInfo['email2'] ?? 'ciceseentreprise@gmail.com';
$address = $contactInfo['address'] ?? 'Bujumbura-Rohero I-Avenu de l\'ONU N°3, Galerie d\'Innovation Bureau B1, BURUNDI.';
$representative = $contactInfo['representative'] ?? 'NDAYIZAMBA Prudence';
$nif = $contactInfo['nif'] ?? '4000781700';
$authDate = $contactInfo['authorization_date'] ?? '2 janvier 2017';

include __DIR__ . '/includes/header.php';
?>


<section id="services-slideshow" class="services-slideshow">
    <div class="slide active" data-service="visa">
        <div class="slide-bg" style="background-image: url('img/slides/visa.jpg');"></div>
        <div class="slide-overlay"></div>
        <div class="slide-content">
            <div class="slide-icon"><i class="fas fa-passport"></i></div>
            <h2><?php echo __('slide_visa_title'); ?></h2>
            <p><?php echo __('slide_visa_desc'); ?></p>
            <div class="slide-buttons">
                <a href="visa.php" class="btn-gold"><?php echo __('btn_discover'); ?></a>
                <a href="#" class="btn-whatsapp" data-whatsapp-message="Bonjour SULOC, je souhaite des informations sur l'assistance visa.">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
            </div>
        </div>
    </div>
    <div class="slide" data-service="logistics">
        <div class="slide-bg" style="background-image: url('img/slides/logistics.jpg');"></div>
        <div class="slide-overlay"></div>
        <div class="slide-content">
            <div class="slide-icon"><i class="fas fa-ship"></i></div>
            <h2><?php echo __('slide_logistics_title'); ?></h2>
            <p><?php echo __('slide_logistics_desc'); ?></p>
            <div class="slide-buttons">
                <a href="logistics.php" class="btn-gold"><?php echo __('btn_view_services'); ?></a>
                <a href="#" class="btn-whatsapp" data-whatsapp-message="Bonjour SULOC, je souhaite des informations sur la logistique & transport.">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
            </div>
        </div>
    </div>
    <div class="slide" data-service="admin">
        <div class="slide-bg" style="background-image: url('img/slides/admin.jpg');"></div>
        <div class="slide-overlay"></div>
        <div class="slide-content">
            <div class="slide-icon"><i class="fas fa-file-alt"></i></div>
            <h2><?php echo __('slide_admin_title'); ?></h2>
            <p><?php echo __('slide_admin_desc'); ?></p>
            <div class="slide-buttons">
                <a href="consulting.php" class="btn-gold"><?php echo __('btn_ask_advice'); ?></a>
                <a href="#" class="btn-whatsapp" data-whatsapp-message="Bonjour SULOC, je souhaite un conseil administratif.">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
            </div>
        </div>
    </div>
    <div class="slide" data-service="vehicles">
        <div class="slide-bg" style="background-image: url('img/slides/vehicles.jpg');"></div>
        <div class="slide-overlay"></div>
        <div class="slide-content">
            <div class="slide-icon"><i class="fas fa-car"></i></div>
            <h2><?php echo __('slide_vehicles_title'); ?></h2>
            <p><?php echo __('slide_vehicles_desc'); ?></p>
            <div class="slide-buttons">
                <a href="vehicles.php" class="btn-gold"><?php echo __('btn_view_catalog'); ?></a>
                <a href="#" class="btn-whatsapp" data-whatsapp-message="Bonjour SULOC, je souhaite importer un véhicule.">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
            </div>
        </div>
    </div>
    <button class="slideshow-arrow prev" aria-label="Previous slide"><i class="fas fa-chevron-left"></i></button>
    <button class="slideshow-arrow next" aria-label="Next slide"><i class="fas fa-chevron-right"></i></button>
    <div class="slideshow-dots">
        <button class="dot active" data-slide="0" aria-label="Go to slide 1"></button>
        <button class="dot" data-slide="1" aria-label="Go to slide 2"></button>
        <button class="dot" data-slide="2" aria-label="Go to slide 3"></button>
        <button class="dot" data-slide="3" aria-label="Go to slide 4"></button>
    </div>
</section>


<section id="services" class="py-20 bg-white">
    <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-blue-900 mb-4"><?php echo __('section_services_title'); ?></h2>
        <p class="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            <?php echo __('section_services_desc'); ?>
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php if (empty($services)): ?>
                <!-- Default services if database is empty -->
                <?php include __DIR__ . '/includes/default-services.php'; ?>
            <?php else: ?>
                <?php foreach ($services as $service): 
                    $features = json_decode($service['features'] ?? '[]', true);
                    $borderColor = ($service['order_index'] % 2 == 0) ? 'border-gold' : 'border-blue-900';
                    $iconBg = ($service['order_index'] % 2 == 0) ? 'bg-yellow-50 text-gold-dark' : 'bg-blue-50 text-blue-900';
                    $checkColor = ($service['order_index'] % 2 == 0) ? 'text-gold' : 'text-blue-500';
                    
                    // Service URL mapping
                    $serviceTitle = trim($service['title']);
                    $redirects = [
                        'Assistance Visa & Immigration' => 'visa.php',
                        'Logistique & Transit' => 'logistics.php',
                        'Conseil Administratif' => 'index.php#contact',
                        'Importation de Véhicules' => 'vehicles.php',
                        'Solutions de Paiement' => 'payments.php',
                        'Représentation Commerciale' => 'index.php#contact'
                    ];
                    $serviceUrl = $redirects[$serviceTitle] ?? 'service.php?slug=' . htmlspecialchars($service['slug']);
                ?>
                <div class="bg-gray-50 rounded-xl shadow-lg p-8 border-t-4 <?php echo $borderColor; ?> service-card"
                     data-service-url="<?php echo $serviceUrl; ?>"
                     data-service-slug="<?php echo htmlspecialchars($service['slug']); ?>">
                    <div class="h-16 w-16 rounded-lg <?php echo $iconBg; ?> flex items-center justify-center mb-6 shadow-md">
                        <i class="<?php echo htmlspecialchars($service['icon'] ?? 'fas fa-cog'); ?> text-3xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-blue-900 mb-3"><?php echo htmlspecialchars($service['title']); ?></h3>
                    <?php if (!empty($features)): ?>
                    <ul class="text-gray-600 leading-relaxed space-y-2">
                        <?php foreach ($features as $feature): ?>
                        <li class="flex items-start">
                            <i class="fas fa-check <?php echo $checkColor; ?> mt-1 mr-2 text-sm"></i>
                            <span><?php echo htmlspecialchars($feature); ?></span>
                        </li>
                        <?php endforeach; ?>
                    </ul>
                    <?php endif; ?>
                </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</section>

<?php include __DIR__ . '/includes/about-section.php'; ?>

<section id="equipe" class="py-20 bg-white">
    <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-blue-900 mb-4"><?php echo __('section_team_title'); ?></h2>
        <p class="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            <?php echo __('section_team_desc'); ?>
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php if (empty($teamMembers)): ?>
                <?php include __DIR__ . '/includes/default-team.php'; ?>
            <?php else: ?>
                <?php foreach ($teamMembers as $member): 
                    $iconBg = ($member['order_index'] % 2 == 0) ? 'bg-yellow-50 text-gold-dark' : 'bg-blue-50 text-blue-900';
                ?>
                <div class="bg-gray-50 rounded-xl p-6 shadow-lg border border-gray-200">
                    <div class="h-16 w-16 rounded-full <?php echo $iconBg; ?> flex items-center justify-center mb-4">
                        <i class="<?php echo htmlspecialchars($member['icon'] ?? 'fas fa-user'); ?> text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-blue-900 mb-2"><?php echo htmlspecialchars($member['name']); ?></h3>
                    <?php if ($member['role']): ?>
                    <p class="text-sm text-gold font-semibold mb-2"><?php echo htmlspecialchars($member['role']); ?></p>
                    <?php endif; ?>
                    <p class="text-gray-600"><?php echo htmlspecialchars($member['description']); ?></p>
                </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</section>


<section id="contact" class="py-24 bg-white">
    <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-blue-900 mb-4"><?php echo __('form_quote_title'); ?></h2>
        <p class="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            <?php echo __('form_quote_subtitle'); ?>
        </p>
        
        <div class="flex flex-col md:flex-row gap-12">
            <div class="md:w-2/3">
                <form id="contact-form" action="<?php echo SITE_URL; ?>/includes/submit-contact.php" method="POST" class="bg-gray-50 rounded-xl shadow-2xl p-10 border-t-8 border-gold">
                    <h3 class="text-3xl font-bold text-blue-900 mb-6"><?php echo __('form_project_info_title'); ?></h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="col-span-1">
                            <label class="block text-gray-700 font-semibold mb-2" for="name"><?php echo __('form_label_name'); ?></label>
                            <input type="text" id="name" name="name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        </div>
                        <div class="col-span-1">
                            <label class="block text-gray-700 font-semibold mb-2" for="email"><?php echo __('form_label_email'); ?></label>
                            <input type="email" id="email" name="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        </div>
                        <div class="col-span-1">
                            <label class="block text-gray-700 font-semibold mb-2" for="phone"><?php echo __('form_label_phone'); ?></label>
                            <input type="tel" id="phone" name="phone" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                        </div>
                        <div class="col-span-1">
                            <label class="block text-gray-700 font-semibold mb-2" for="service_type"><?php echo __('form_label_service_type'); ?></label>
                            <select id="service_type" name="service_type" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                                <option value=""><?php echo __('form_select_service_default'); ?></option>
                                <?php 
                                // Ensure we have services to display
                                $displayServices = $services;
                                if (empty($displayServices)) {
                                    $displayServices = [
                                        ['title' => 'Assistance Visa & Immigration'],
                                        ['title' => 'Logistique & Transit'],
                                        ['title' => 'Conseil Administratif'],
                                        ['title' => 'Importation de Véhicules'],
                                        ['title' => 'Solutions de Paiement'],
                                        ['title' => 'Représentation Commerciale']
                                    ];
                                }
                                ?>
                                <?php foreach ($displayServices as $service): ?>
                                <option value="<?php echo htmlspecialchars($service['title']); ?>"><?php echo htmlspecialchars($service['title']); ?></option>
                                <?php endforeach; ?>
                                <option value="Autre"><?php echo __('form_select_other'); ?></option>
                            </select>
                        </div>
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold mb-2" for="message"><?php echo __('form_label_message'); ?></label>
                            <textarea id="message" name="message" rows="6" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"></textarea>
                        </div>
                    </div>
                    <button type="submit" class="w-full mt-8 bg-gold text-white py-4 rounded-lg font-bold text-xl hover:bg-gold-dark transition duration-300 shadow-lg transform hover:scale-[1.02]">
                        <?php echo __('btn_send_request'); ?>
                    </button>
                </form>
            </div>
            
            <div class="md:w-1/3">
                <div class="bg-blue-900 text-white rounded-xl shadow-2xl p-8 h-full">
                    <h3 class="text-3xl font-bold mb-8 border-b-2 border-gold pb-3"><?php echo __('contact_info_title'); ?></h3>
                    
                    <div class="mb-8 flex items-start">
                        <i class="fas fa-map-marker-alt text-2xl text-gold mr-4 mt-1"></i>
                        <div>
                            <h4 class="font-bold text-lg"><?php echo __('contact_headquarters'); ?></h4>
                            <p class="text-blue-200"><?php echo nl2br(htmlspecialchars($address)); ?></p>
                        </div>
                    </div>
                    
                    <div class="mb-8 flex items-start">
                        <i class="fas fa-phone-alt text-2xl text-gold mr-4 mt-1"></i>
                        <div>
                            <h4 class="font-bold text-lg"><?php echo __('contact_phone'); ?></h4>
                            <p class="text-blue-200"><?php echo htmlspecialchars($phone); ?></p>
                            <?php if ($phone2): ?>
                            <p class="text-blue-200"><?php echo htmlspecialchars($phone2); ?></p>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <div class="mb-8 flex items-start">
                        <i class="fas fa-envelope text-2xl text-gold mr-4 mt-1"></i>
                        <div>
                            <h4 class="font-bold text-lg"><?php echo __('form_label_email'); ?></h4>
                            <p class="text-blue-200"><?php echo htmlspecialchars($email); ?></p>
                            <?php if ($email2): ?>
                            <p class="text-blue-200"><?php echo htmlspecialchars($email2); ?></p>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="mb-8 flex items-start">
                        <i class="fas fa-id-card text-2xl text-gold mr-4 mt-1"></i>
                        <div>
                            <h4 class="font-bold text-lg"><?php echo __('contact_representative'); ?></h4>
                            <p class="text-blue-200"><?php echo htmlspecialchars($representative); ?></p>
                            <p class="text-blue-200 text-sm"><?php echo __('contact_dg'); ?></p>
                        </div>
                    </div>

                    <div class="mt-10 pt-6 border-t border-blue-700">
                        <h4 class="font-bold text-lg mb-4"><?php echo __('contact_legal_id'); ?></h4>
                        <div class="text-blue-200 text-sm">
                            <p><strong>NIF:</strong> <?php echo htmlspecialchars($nif); ?></p>
                            <p><strong><?php echo __('contact_country'); ?>:</strong> Burundi</p>
                            <p><strong><?php echo __('contact_auth_date'); ?>:</strong> <?php echo htmlspecialchars($authDate); ?></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>
