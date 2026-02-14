<?php
require_once __DIR__ . '/Translator.php';

// Handle Language Change
if (isset($_GET['lang'])) {
    $lang = $_GET['lang'] === 'en' ? 'en' : 'fr';
    Translator::getInstance()->setLanguage($lang);
    $url = strtok($_SERVER['REQUEST_URI'], '?');
    header("Location: $url");
    exit;
}

$pageTitle = isset($pageTitle) ? $pageTitle : 'SULOC | Logistique, Visa et Services Administratifs';
$pageDescription = isset($pageDescription) ? $pageDescription : 'SULOC : Facilitation logistique, assistance visa et services administratifs fiables.';
?>
<!DOCTYPE html>
<html lang="fr" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($pageDescription); ?>">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        blue: {
                            900: '#003060', // Primary Blue
                            800: '#002850', // Secondary Blue
                            700: '#002850', // Tweaked for gradients
                        },
                        gold: {
                            DEFAULT: '#D0A040', // Primary Gold
                            dark: '#C08020', // Dark Gold
                            light: '#E0B050', // Light Gold
                        },
                        white: '#F0F0F0',
                    }
                }
            }
        }
    </script>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?php echo SITE_URL; ?>/css/main.css">
    <link rel="stylesheet" href="<?php echo SITE_URL; ?>/css/responsive.css">
    
    <!-- Lazy Loading Script -->
    <script src="<?php echo SITE_URL; ?>/js/lazy-loading.js" defer></script>
    
    <!-- Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('<?php echo SITE_URL; ?>/sw.js')
                    .then(reg => console.log('Service Worker registered'))
                    .catch(err => console.log('Service Worker registration failed'));
            });
        }
    </script>
</head>
<body class="font-sans text-gray-800">

    <!-- Loading Screen -->
    <div id="loading-screen" class="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center" style="transition: opacity 0.3s ease;">
        <div class="mb-4">
                <div class="h-20 w-20 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-2xl">
                    S
                </div>
            </div>
        <div class="text-blue-900 text-xl font-bold mb-2">SULOC</div>
        <div class="loading-bar w-32"></div>
    </div>

    <!-- Floating Action Buttons -->
    <div class="fixed bottom-8 right-8 z-[100] flex flex-col space-y-4">
        <a href="#contact" class="bg-blue-700 text-white rounded-full p-4 text-xl shadow-2xl hover:bg-blue-800 transition transform hover:scale-110 tooltip floating-btn" data-tooltip="<?php echo __('header_quote_request'); ?>">
            <i class="fas fa-calculator"></i>
        </a>
    </div>

    <!-- Floating WhatsApp Button -->
    <div class="whatsapp-float">
        <a href="#" class="whatsapp-btn" id="whatsapp-float-btn" aria-label="Contact WhatsApp">
            <i class="fab fa-whatsapp"></i>
            <span class="whatsapp-tooltip"><?php echo __('header_chat_with_us'); ?></span>
        </a>
    </div>

    <!-- Chat Widget removed (replaced by WhatsApp) -->

    <header class="bg-white shadow-lg sticky top-0 z-50 transition-all duration-300" id="main-header">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            
            <div class="flex items-center">
                <div class="h-20 w-20 rounded-full bg-white flex items-center justify-center mr-3">
                    <img src="<?php echo SITE_URL; ?>/img/logo.jpg" alt="SULOC Logo" class="h-18 w-18 object-contain">
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-blue-900"><?php echo SITE_NAME; ?></h1>
                    <p class="text-sm text-gold"><?php echo SITE_TAGLINE; ?></p>
                </div>
            </div>
            
            <nav class="hidden md:flex space-x-10 text-lg font-semibold">
                <a href="<?php echo SITE_URL; ?>/index.php" class="text-blue-900 hover:text-gold transition duration-200 relative group">
                    <?php echo __('nav_home'); ?>
                    <span class="absolute bottom-0 left-0 w-0 h-1 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="<?php echo SITE_URL; ?>/vehicles.php" class="text-blue-900 hover:text-gold transition duration-200 relative group">
                    <?php echo __('nav_vehicles'); ?>
                    <span class="absolute bottom-0 left-0 w-0 h-1 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="<?php echo SITE_URL; ?>/visa-assistance.php" class="text-blue-900 hover:text-gold transition duration-200 relative group">
                    <?php echo __('nav_visas'); ?>
                    <span class="absolute bottom-0 left-0 w-0 h-1 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="<?php echo SITE_URL; ?>/logistics.php" class="text-blue-900 hover:text-gold transition duration-200 relative group">
                    <?php echo __('nav_logistics'); ?>
                    <span class="absolute bottom-0 left-0 w-0 h-1 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="<?php echo SITE_URL; ?>/payments.php" class="text-blue-900 hover:text-gold transition duration-200 relative group">
                    <?php echo __('nav_payments'); ?>
                    <span class="absolute bottom-0 left-0 w-0 h-1 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="<?php echo SITE_URL; ?>/index.php#contact" class="text-blue-900 hover:text-gold transition duration-200 relative group">
                    <?php echo __('nav_contact'); ?>
                    <span class="absolute bottom-0 left-0 w-0 h-1 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="<?php echo SITE_URL; ?>/index.php#contact" class="bg-gold text-white px-5 py-2 rounded-full hover:bg-gold-dark transition shadow-md font-bold">
                    <?php echo __('nav_buy'); ?>
                </a>
            </nav>
            
            <!-- Language Switcher -->
            <div class="hidden md:block ml-4">
                <?php include __DIR__ . '/language-switcher.php'; ?>
            </div>
            
            <button class="md:hidden text-blue-900" id="mobile-menu-toggle">
                <i class="fas fa-bars text-3xl"></i>
            </button>
        </div>
        
        <nav id="mobile-menu" class="hidden md:hidden bg-white w-full absolute left-0 py-4 border-t border-gray-100 shadow-md z-40">
            <div class="flex flex-col space-y-4 px-6 text-lg">
                <a href="<?php echo SITE_URL; ?>/index.php" class="text-blue-900 hover:text-gold py-2 border-b border-gray-100 flex items-center">
                    <i class="fas fa-home mr-3 text-gold"></i> <?php echo __('nav_home'); ?>
                </a>
                <a href="<?php echo SITE_URL; ?>/vehicles.php" class="text-blue-900 hover:text-gold py-2 border-b border-gray-100 flex items-center">
                    <i class="fas fa-car mr-3 text-gold"></i> <?php echo __('nav_vehicles'); ?>
                </a>
                <a href="<?php echo SITE_URL; ?>/visa-assistance.php" class="text-blue-900 hover:text-gold py-2 border-b border-gray-100 flex items-center">
                    <i class="fas fa-passport mr-3 text-gold"></i> <?php echo __('nav_visas'); ?>
                </a>
                <a href="<?php echo SITE_URL; ?>/logistics.php" class="text-blue-900 hover:text-gold py-2 border-b border-gray-100 flex items-center">
                    <i class="fas fa-ship mr-3 text-gold"></i> <?php echo __('nav_logistics'); ?>
                </a>
                <a href="<?php echo SITE_URL; ?>/payments.php" class="text-blue-900 hover:text-gold py-2 border-b border-gray-100 flex items-center">
                    <i class="fas fa-money-bill-wave mr-3 text-gold"></i> <?php echo __('nav_payments'); ?>
                </a>
                <a href="<?php echo SITE_URL; ?>/index.php#contact" class="text-blue-900 hover:text-gold py-2 flex items-center">
                    <i class="fas fa-envelope mr-3 text-gold"></i> <?php echo __('nav_contact'); ?>
                </a>
                <div class="pt-4 border-t border-gray-100 flex justify-center">
                    <?php include __DIR__ . '/language-switcher.php'; ?>
                </div>
            </div>
        </nav>
    </header>
