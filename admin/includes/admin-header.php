<?php
/**
 * Admin Header Navigation
 * Updated for RBAC (Creator/Super Admin/Admin)
 */

$userRole = $_SESSION['admin_role'] ?? 'admin';
$headerClass = 'bg-gray-800'; // Default
$subHeaderClass = 'bg-gray-700';
$roleLabel = 'Administrateur';
$roleColor = 'text-gray-300';
$borderColor = '';

if ($userRole === 'creator') {
    $headerClass = 'bg-red-900';
    $subHeaderClass = 'bg-red-800';
    $roleLabel = 'CREATOR MODE';
    $roleColor = 'text-red-200 font-bold';
    $borderColor = 'border-b-4 border-red-500';
} elseif ($userRole === 'super_admin') {
    $headerClass = 'bg-blue-900';
    $subHeaderClass = 'bg-blue-800';
    $roleLabel = 'Super Admin';
    $roleColor = 'text-blue-200';
    $borderColor = '';
}
?>
<nav class="<?php echo $headerClass; ?> text-white shadow-lg <?php echo $borderColor; ?>">
    <div class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
            <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold mr-3">
                    <?php echo strtoupper(substr($userRole, 0, 1)); ?>
                </div>
                <div>
                    <h1 class="text-xl font-bold">SULOC Admin</h1>
                    <p class="text-xs uppercase tracking-wider <?php echo $roleColor; ?>"><?php echo $roleLabel; ?></p>
                </div>
            </div>
            
            <div class="flex items-center space-x-6">
                <a href="<?php echo SITE_URL; ?>/index.php" target="_blank" class="text-white/70 hover:text-white transition">
                    <i class="fas fa-external-link-alt mr-2"></i>Voir le site
                </a>
                <div class="flex items-center space-x-3">
                    <i class="fas fa-user-circle text-2xl"></i>
                    <span><?php echo htmlspecialchars($_SESSION['admin_name'] ?? $_SESSION['admin_username']); ?></span>
                </div>
                <a href="logout.php" class="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition">
                    <i class="fas fa-sign-out-alt mr-2"></i>Déconnexion
                </a>
            </div>
        </div>
    </div>
    
    <div class="<?php echo $subHeaderClass; ?>">
        <div class="container mx-auto px-6">
            <div class="flex flex-wrap">
                <?php
                // Helper to render menu item
                function renderMenuItem($url, $icon, $label, $permission = null) {
                    // Creator/Super Admin see everything unless logic changes
                    // Admin checks permission
                    if ($permission && !hasPermission($permission)) {
                        return;
                    }
                    
                    $isActive = (basename($_SERVER['PHP_SELF']) == basename($url));
                    // Handle sub-pages
                    if ($url === 'requests/import-requests.php' && strpos($_SERVER['REQUEST_URI'], '/requests/') !== false) $isActive = true;
                    
                    $activeClass = $isActive ? 'bg-white/20' : '';
                    
                    echo '<a href="'.ADMIN_URL.'/'.$url.'" class="px-4 py-3 hover:bg-white/10 transition flex items-center '.$activeClass.'">
                            <i class="fas '.$icon.' mr-2"></i>'.$label.'
                          </a>';
                }

                renderMenuItem('index.php', 'fa-home', 'Tableau de bord');
                
                // Content Management
                if (hasPermission('manage_content') || $userRole !== 'admin') {
                    renderMenuItem('home.php', 'fa-file-alt', 'Home Content');
                    renderMenuItem('about.php', 'fa-info-circle', 'À Propos');
                    renderMenuItem('services.php', 'fa-cogs', 'Services');
                    renderMenuItem('projects.php', 'fa-project-diagram', 'Projets');
                    renderMenuItem('team.php', 'fa-users', 'Équipe');
                }

                // Business Logic (Permissions Required for Admins)
                renderMenuItem('visa-services.php', 'fa-passport', 'Services Visa', 'manage_visa');
                renderMenuItem('visa-assistance-requests.php', 'fa-hands-helping', 'Assistance Visa', 'manage_visa');
                renderMenuItem('requests/import-requests.php', 'fa-clipboard-list', 'Logistique', 'manage_logistics');
                
                // Financials (Sensitive)
                renderMenuItem('payment-services.php', 'fa-money-bill-wave', 'Paiements', 'manage_payments');
                renderMenuItem('payment-requests.php', 'fa-file-invoice-dollar', 'Transferts', 'manage_payments');
                
                // Vehicles
                renderMenuItem('vehicles.php', 'fa-car', 'Véhicules', 'manage_vehicles');
                
                // Interaction
                renderMenuItem('submissions.php', 'fa-envelope', 'Demandes');
                
                // System - Restricted
                if ($userRole === 'creator' || $userRole === 'super_admin') {
                    renderMenuItem('users.php', 'fa-users-cog', 'Utilisateurs');
                    renderMenuItem('settings.php', 'fa-cog', 'Paramètres');
                }
                
                // Creator Only
                if ($userRole === 'creator') {
                    renderMenuItem('system-status.php', 'fa-server', 'Système');
                }
                ?>
            </div>
        </div>
    </div>
</nav>
