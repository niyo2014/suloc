<?php
/**
 * Default Team Members - Fallback when database is empty
 */
$defaultTeam = [
    ['name' => 'Expert en Logistique', 'icon' => 'fas fa-truck-moving', 'iconBg' => 'bg-blue-100 text-blue-700', 'desc' => 'Spécialiste en gestion de la chaîne d\'approvisionnement et transport international'],
    ['name' => 'Conseiller en Immigration', 'icon' => 'fas fa-passport', 'iconBg' => 'bg-green-100 text-green-700', 'desc' => 'Expert en procédures de visa et facilitation administrative'],
    ['name' => 'Chargé de Clientèle', 'icon' => 'fas fa-user-friends', 'iconBg' => 'bg-blue-100 text-blue-700', 'desc' => 'Dédié au suivi de vos dossiers et à la satisfaction client'],
    ['name' => 'Responsable Administratif', 'icon' => 'fas fa-file-signature', 'iconBg' => 'bg-green-100 text-green-700', 'desc' => 'Gestionnaire des correspondances et de la conformité réglementaire']
];

foreach ($defaultTeam as $member): ?>
<div class="bg-gray-50 rounded-xl p-6 shadow-lg border border-gray-200 text-center">
    <div class="h-16 w-16 rounded-full <?php echo $member['iconBg']; ?> flex items-center justify-center mb-4 mx-auto">
        <i class="<?php echo $member['icon']; ?> text-2xl"></i>
    </div>
    <h3 class="text-xl font-bold text-blue-900 mb-2"><?php echo $member['name']; ?></h3>
    <p class="text-gray-600 text-sm"><?php echo $member['desc']; ?></p>
</div>
<?php endforeach; ?>
