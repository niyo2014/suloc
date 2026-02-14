<?php
/**
 * Default Projects - Fallback when database is empty
 */
$defaultProjects = [
    [
        'title' => 'Importation de Flotte Véhicules',
        'location' => 'Burundi',
        'description' => 'Coordination complète de l\'importation de 20 véhicules utilitaires pour une ONG locale.',
        'image' => 'https://images.unsplash.com/photo-1519003722824-192d99a0785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    [
        'title' => 'Assistance Visa Groupé',
        'location' => 'Zone EAC',
        'description' => 'Facilitation de visas pour une délégation de 15 personnes en un temps record.',
        'image' => 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    [
        'title' => 'Optimisation de Transit Maritime',
        'location' => 'Port de Dar es Salaam',
        'description' => 'Réduction des délais de dédouanement de 30% pour un client importateur régulier.',
        'image' => 'https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
];

foreach ($defaultProjects as $project): 
    $projectSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $project['title'])));
?>
<div class="project-card bg-white rounded-xl shadow-xl overflow-hidden group transition duration-500 transform hover:-translate-y-2 cursor-pointer"
     data-project-url="project.php?slug=<?php echo $projectSlug; ?>"
     data-project-slug="<?php echo $projectSlug; ?>">
    <div class="h-64 overflow-hidden relative">
        <img src="<?php echo $project['image']; ?>" 
             alt="<?php echo htmlspecialchars($project['title']); ?>" 
             class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
        <div class="absolute inset-0 bg-blue-900/50 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
            <span class="text-white text-xl font-bold border-2 border-white px-4 py-2 rounded-full hover:bg-white hover:text-blue-900 transition">Voir les détails</span>
        </div>
    </div>
    <div class="p-6">
        <span class="text-sm font-semibold text-green-600 uppercase tracking-wider"><?php echo $project['location']; ?></span>
        <h3 class="text-2xl font-bold text-blue-900 mt-1 mb-2"><?php echo htmlspecialchars($project['title']); ?></h3>
        <p class="text-gray-600 text-sm"><?php echo htmlspecialchars($project['description']); ?></p>
        <div class="mt-4 flex items-center text-blue-600 font-semibold">
            <span>Détails</span>
            <i class="fas fa-arrow-right ml-2"></i>
        </div>
    </div>
</div>
<?php endforeach; ?>
