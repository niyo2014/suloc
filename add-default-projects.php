<?php
/**
 * Add Default Projects to Database
 * Run this once to populate the database with default projects
 */

require_once __DIR__ . '/config/config.php';

$pdo = getDBConnection();

$defaultProjects = [
    [
        'title' => 'Aménagements Hydroélectriques',
        'slug' => 'amenagements-hydroelectriques',
        'description' => 'Étude d\'impact environnemental et social pour un projet de barrage de 50MW en République Démocratique du Congo.',
        'location' => 'RDC',
        'status' => 'completed',
        'image_url' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
        'content' => 'Ce projet d\'aménagement hydroélectrique représente une étape importante dans le développement énergétique de la région. Notre équipe a réalisé une étude complète d\'impact environnemental et social, incluant des consultations publiques avec les communautés locales.',
        'order_index' => 1,
        'client' => 'Société Nationale d\'Électricité de la RDC',
        'duration' => '24 mois (2020-2022)',
        'budget' => '12 millions USD',
        'challenges' => [
            'Coordination avec les communautés locales dans des zones reculées',
            'Gestion des impacts environnementaux sur la faune aquatique',
            'Accès limité aux infrastructures routières'
        ],
        'solutions' => [
            'Mise en place d\'un plan d\'engagement communautaire',
            'Création de corridors écologiques pour la faune',
            'Logistique fluviale et utilisation d\'hélicoptères pour les matériaux'
        ],
        'key_features' => [
            'Études Bathymétriques - Analyse détaillée du lit de la rivière',
            'Monitoring Environnemental - Capteurs IoT pour le suivi de la qualité de l\'eau',
            'Modélisation 3D - Simulation complète de la retenue d\'eau'
        ],
        'statistics' => [
            '50 MW | Capacité installée',
            '1200 | Emplois locaux créés',
            '18 | Consultations publiques réalisées'
        ],
        'services_used' => [
            'Études d\'impact environnemental',
            'Supervision de chantier',
            'Ingénierie hydraulique avancée'
        ],
        'testimonial' => 'SULOC a démontré une expertise remarquable dans la coordination de projets complexes en milieu sensible.',
        'testimonial_author' => 'Jean-Pierre Kabuya',
        'testimonial_role' => 'Directeur de projet, SNEL',
        'impact_educational' => 'Programme de formation pour 60 techniciens locaux en maintenance d\'installations hydroélectriques.',
        'impact_environmental' => 'Plan de reforestation de 500 hectares autour du bassin versant.'
    ],
    [
        'title' => 'Infrastructures Scolaires Durables',
        'slug' => 'infrastructures-scolaires-durables',
        'description' => 'Construction et supervision de 15 écoles équipées de systèmes de collecte d\'eau pluviale au Burundi.',
        'location' => 'Burundi',
        'status' => 'in_progress',
        'image_url' => 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
        'content' => 'Ce projet vise à améliorer l\'accès à l\'éducation tout en intégrant des solutions durables pour la gestion de l\'eau. Chaque école est équipée d\'un système de collecte d\'eau pluviale et de panneaux solaires.',
        'order_index' => 2,
        'client' => 'Ministère de l\'Éducation du Burundi',
        'duration' => '18 mois (2021-2022)',
        'budget' => '2.5 millions USD',
        'challenges' => [
            'Contraintes budgétaires pour des matériaux de qualité',
            'Accès à l\'eau potable dans les zones rurales',
            'Besoin de maintenance locale durable'
        ],
        'solutions' => [
            'Utilisation de matériaux locaux renforcés et modulaires',
            'Installation de systèmes de collecte d\'eau et de filtration',
            'Formation des comités de gestion communautaires'
        ],
        'key_features' => [
            'Collecte d\'Eau Pluviale - Capacité de 15 000L par site',
            'Panneaux Solaires - Autonomie énergétique de 8h/jour',
            'Classes Modulaires - Extension possible en 2 semaines'
        ],
        'statistics' => [
            '15 | Écoles construites',
            '12 000 | Élèves bénéficiaires',
            '45 % | Augmentation du taux de fréquentation'
        ],
        'services_used' => [
            'Conception architecturale',
            'Gestion de projets',
            'Formation et renforcement des capacités'
        ],
        'testimonial' => 'Les solutions proposées par SULOC répondent parfaitement aux besoins spécifiques de nos provinces rurales.',
        'testimonial_author' => 'Marie-Louise Ndayizeye',
        'testimonial_role' => 'Directrice des infrastructures scolaires',
        'impact_educational' => 'Accroissement significatif du taux de scolarisation des filles (+35%) dans les provinces ciblées.',
        'impact_environmental' => 'Réduction de 40% de la consommation d\'eau souterraine grâce aux systèmes de récupération.'
    ],
    [
        'title' => 'Étude de Résilience Climatique',
        'slug' => 'etude-resilience-climatique',
        'description' => 'Plan d\'adaptation aux changements climatiques pour les communautés côtières en Tanzanie.',
        'location' => 'Tanzanie',
        'status' => 'completed',
        'image_url' => 'https://images.unsplash.com/photo-1569163139394-de44cb54d0ce?auto=format&fit=crop&w=1200&q=80',
        'content' => 'Cette étude a permis d\'identifier les vulnérabilités des communautés côtières face aux changements climatiques et de proposer des mesures d\'adaptation concrètes.',
        'order_index' => 3,
        'client' => 'Ministère de l\'Environnement de Tanzanie',
        'duration' => '12 mois (2022)',
        'budget' => '1.1 million USD',
        'challenges' => [
            'Érosion accélérée des zones côtières',
            'Pression démographique sur les ressources naturelles',
            'Accès limité aux données climatiques historiques'
        ],
        'solutions' => [
            'Cartographie LiDAR de précision des zones littorales',
            'Création de plans communautaires d\'adaptation',
            'Mise en place d\'un observatoire de données climatiques'
        ],
        'key_features' => [
            'Cartographie LiDAR - Résolution de 5 cm',
            'Systèmes d\'Alerte Précoce - Couverture de 3 districts',
            'Solutions Basées sur la Nature - Protection de 200 ha de mangroves'
        ],
        'statistics' => [
            '6 | Communautés accompagnées',
            '200 | Agents locaux formés',
            '30 % | Réduction projetée des pertes agricoles'
        ],
        'services_used' => [
            'Études climatiques',
            'Analyse des risques',
            'Ingénierie environnementale'
        ],
        'testimonial' => 'Les recommandations de SULOC orientent désormais nos politiques publiques en matière de résilience.',
        'testimonial_author' => 'Dr. Amina Hassan',
        'testimonial_role' => 'Secrétaire permanente, Ministère de l\'Environnement',
        'impact_educational' => 'Création de modules pédagogiques sur l\'adaptation pour 45 écoles côtières.',
        'impact_environmental' => 'Réhabilitation de 80 hectares de mangroves pour protéger le littoral.'
    ]
];

echo "<!DOCTYPE html>
<html>
<head>
    <title>Add Default Projects</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .error { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .info { background: #d1ecf1; color: #0c5460; padding: 10px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Add Default Projects to Database</h1>";

try {
    $added = 0;
    $skipped = 0;
    
    foreach ($defaultProjects as $project) {
        // Check if project already exists
        $stmt = $pdo->prepare("SELECT id FROM projects WHERE slug = ?");
        $stmt->execute([$project['slug']]);
        
        if ($stmt->fetch()) {
            echo "<div class='info'>Project '{$project['title']}' already exists. Skipping.</div>";
            $skipped++;
            continue;
        }
        
        // Insert project with extended details
        $stmt = $pdo->prepare("INSERT INTO projects (
            slug, title, description, location, status, image_url, content, order_index, is_active,
            client, duration, budget, challenges, solutions, key_features, statistics, services_used,
            testimonial, testimonial_author, testimonial_role, impact_educational, impact_environmental
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $project['slug'],
            $project['title'],
            $project['description'],
            $project['location'],
            $project['status'],
            $project['image_url'],
            $project['content'],
            $project['order_index'],
            $project['client'],
            $project['duration'],
            $project['budget'],
            json_encode($project['challenges']),
            json_encode($project['solutions']),
            json_encode($project['key_features']),
            json_encode($project['statistics']),
            json_encode($project['services_used']),
            $project['testimonial'],
            $project['testimonial_author'],
            $project['testimonial_role'],
            $project['impact_educational'],
            $project['impact_environmental']
        ]);
        
        echo "<div class='success'>✓ Added project: {$project['title']}</div>";
        $added++;
    }
    
    echo "<div class='success'><strong>Complete!</strong> Added $added project(s), skipped $skipped existing project(s).</div>";
    echo "<p><a href='index.php'>Go to Homepage</a> | <a href='admin/projects.php'>View in Admin</a></p>";
    
} catch (Exception $e) {
    echo "<div class='error'>Error: " . htmlspecialchars($e->getMessage()) . "</div>";
}

echo "</body></html>";
?>

