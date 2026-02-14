<?php
/**
 * SULOC - Footer Include
 * Reusable footer component
 */
require_once __DIR__ . '/../config/config.php';

// Get contact info from database if available
$pdo = getDBConnection();
$contactInfo = [];
try {
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('phone', 'email', 'address', 'representative')");
    while ($row = $stmt->fetch()) {
        $contactInfo[$row['setting_key']] = $row['setting_value'];
    }
} catch (Exception $e) {
    // Use defaults if database not available
}

$phone = $contactInfo['phone'] ?? '+257 79 496 117';
$email = $contactInfo['email'] ?? 'ndayiprud@gmail.com';
$address = $contactInfo['address'] ?? 'Bujumbura-Rohero I-Avenu de l\'ONU N°3, Galerie d\'Innovation Bureau B1, BURUNDI.';
$representative = $contactInfo['representative'] ?? 'NDAYIZAMBA Prudence';
?>

    <footer class="bg-blue-900 text-white py-12 border-t-8 border-gold">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
                
                <div class="col-span-1">
                    <div class="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mb-3">
                        S
                    </div>
                    <p class="text-gold font-bold mb-4 text-lg"><?php echo SITE_TAGLINE; ?></p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-white hover:text-gold transition transform hover:scale-110">
                            <i class="fab fa-facebook-f text-xl"></i>
                        </a>
                        <a href="#" class="text-white hover:text-gold transition transform hover:scale-110">
                            <i class="fab fa-linkedin-in text-xl"></i>
                        </a>
                        <a href="#" class="text-white hover:text-gold transition transform hover:scale-110">
                            <i class="fab fa-twitter text-xl"></i>
                        </a>
                    </div>
                </div>

                <div class="col-span-1">
                    <h4 class="text-xl font-bold mb-4 border-b border-blue-700 pb-2"><?php echo __('footer_quick_links'); ?></h4>
                    <ul class="space-y-2">
                        <li><a href="<?php echo SITE_URL; ?>/vehicles.php" class="text-blue-200 hover:text-gold transition">Nos Véhicules</a></li>
                        <li><a href="<?php echo SITE_URL; ?>/visa.php" class="text-blue-200 hover:text-gold transition">Visas</a></li>
                        <li><a href="<?php echo SITE_URL; ?>/logistics.php" class="text-blue-200 hover:text-gold transition">Import & Export</a></li>
                        <li><a href="<?php echo SITE_URL; ?>/payments.php" class="text-blue-200 hover:text-gold transition">Transfert d'argent</a></li>
                        <li><a href="<?php echo SITE_URL; ?>/index.php#contact" class="text-blue-200 hover:text-gold transition">Contact</a></li>
                    </ul>
                </div>

                <div class="col-span-1">
                    <h4 class="text-xl font-bold mb-4 border-b border-blue-700 pb-2"><?php echo __('footer_intervention_areas'); ?></h4>
                    <ul class="space-y-2 text-blue-200">
                        <li><?php echo __('footer_env_social'); ?></li>
                        <li><?php echo __('footer_civil_engineering'); ?></li>
                        <li><?php echo __('footer_climate_resilience'); ?></li>
                        <li><?php echo __('footer_technical_audit'); ?></li>
                    </ul>
                </div>

                <div class="col-span-1">
                    <h4 class="text-xl font-bold mb-4 border-b border-blue-700 pb-2"><?php echo __('footer_contact_us'); ?></h4>
                    <p class="text-blue-200 mb-2">Tél: <?php echo htmlspecialchars($phone); ?></p>
                    <p class="text-blue-200 mb-2">Email: <?php echo htmlspecialchars($email); ?></p>
                    <p class="text-blue-200">Personne Contact: <?php echo htmlspecialchars($representative); ?>, DG</p>
                </div>
            </div>

            <div class="border-t border-blue-700 mt-10 pt-6 text-center text-blue-300">
                <p>&copy; <?php echo date('Y'); ?> <?php echo SITE_NAME; ?> - Success Logistics Company. <?php echo __('footer_all_rights'); ?> | <a href="#" class="hover:text-gold transition"><?php echo __('footer_legal'); ?></a></p>
            </div>
        </div>
    </footer>

    <!-- JavaScript Files -->
    <script src="<?php echo SITE_URL; ?>/js/main.js"></script>
    <script src="<?php echo SITE_URL; ?>/js/animations.js"></script>
    <script src="<?php echo SITE_URL; ?>/js/forms.js"></script>
    
    <!-- WhatsApp Floating Widget -->
    <?php include __DIR__ . '/whatsapp-widget.php'; ?>
</body>
</html>
