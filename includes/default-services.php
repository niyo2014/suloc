<?php
/**
 * Default Services - Fallback when database is empty
 */
$defaultServices = [
    [
        'title' => 'Assistance Visa & Immigration',
        'icon' => 'fas fa-passport',
        'border' => 'border-green-600',
        'iconBg' => 'bg-green-100 text-green-700',
        'checkColor' => 'text-green-500',
        'features' => [
            'Orientation sur les types de visa',
            'Vérification de conformité documentaire',
            'Préparation des dossiers de demande',
            'Suivi des procédures administratives'
        ],
        'slug' => 'assistance-visa',
        'url' => 'visa.php'
    ],
    [
        'title' => 'Logistique & Transit',
        'icon' => 'fas fa-ship',
        'border' => 'border-blue-600',
        'iconBg' => 'bg-blue-100 text-blue-700',
        'checkColor' => 'text-blue-500',
        'features' => [
            'Organisation du fret international',
            'Coordination avec les transitaires',
            'Suivi des expéditions en temps réel',
            'Conseils en optimisation logistique'
        ],
        'slug' => 'logistique-transit',
        'url' => 'logistics.php'
    ],
    [
        'title' => 'Conseil Administratif',
        'icon' => 'fas fa-file-invoice',
        'border' => 'border-green-600',
        'iconBg' => 'bg-green-100 text-green-700',
        'checkColor' => 'text-green-500',
        'features' => [
            'Assistance aux démarches locales',
            'Rédaction de correspondances officielles',
            'Gestion documentaire et archivage',
            'Orientation juridique de premier niveau'
        ],
        'slug' => 'conseil-administratif',
        'url' => 'index.php#contact'
    ],
    [
        'title' => 'Importation de Véhicules',
        'icon' => 'fas fa-car',
        'border' => 'border-blue-600',
        'iconBg' => 'bg-blue-100 text-blue-700',
        'checkColor' => 'text-blue-500',
        'features' => [
            'Sélection de véhicules certifiés',
            'Inspection technique à la source',
            'Gestion du transport et du dédouanement',
            'Livraison clé en main à destination'
        ],
        'slug' => 'importation-vehicules',
        'url' => 'vehicles.php'
    ],
    [
        'title' => 'Solutions de Paiement',
        'icon' => 'fas fa-exchange-alt',
        'border' => 'border-green-600',
        'iconBg' => 'bg-green-100 text-green-700',
        'checkColor' => 'text-green-500',
        'features' => [
            'Transferts de fonds sécurisés',
            'Paiement de factures fournisseurs',
            'Change de devises compétitif',
            'Reporting financier transparent'
        ],
        'slug' => 'solutions-paiement',
        'url' => 'payments.php'
    ],
    [
        'title' => 'Représentation Commerciale',
        'icon' => 'fas fa-briefcase',
        'border' => 'border-blue-600',
        'iconBg' => 'bg-blue-100 text-blue-700',
        'checkColor' => 'text-blue-500',
        'features' => [
            'Intermédiation commerciale',
            'Prospection de marchés locaux',
            'Négociation contractuelle',
            'Suivi de clientèle et SAV'
        ],
        'slug' => 'representation-commerciale',
        'url' => 'index.php#contact'
    ]
];

foreach ($defaultServices as $service): 
    $serviceUrl = $service['url'] ?? 'service.php?slug=' . htmlspecialchars($service['slug']);
?>
<div class="bg-gray-50 rounded-xl shadow-lg p-8 border-t-4 <?php echo $service['border']; ?> service-card"
     data-service-url="<?php echo $serviceUrl; ?>"
     data-service-slug="<?php echo htmlspecialchars($service['slug']); ?>">
    <div class="h-16 w-16 rounded-lg <?php echo $service['iconBg']; ?> flex items-center justify-center mb-6 shadow-md">
        <i class="<?php echo $service['icon']; ?> text-3xl"></i>
    </div>
    <h3 class="text-2xl font-bold text-blue-900 mb-3"><?php echo $service['title']; ?></h3>
    <ul class="text-gray-600 leading-relaxed space-y-2">
        <?php foreach ($service['features'] as $feature): ?>
        <li class="flex items-start">
            <i class="fas fa-check <?php echo $service['checkColor']; ?> mt-1 mr-2 text-sm"></i>
            <span><?php echo $feature; ?></span>
        </li>
        <?php endforeach; ?>
    </ul>
</div>
<?php endforeach; ?>
