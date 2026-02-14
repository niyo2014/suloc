<?php
/**
 * SULOC - Dynamic Service Detail Page
 */
require_once __DIR__ . '/config/config.php';

$slug = $_GET['slug'] ?? '';

if (empty($slug)) {
    $requestUri = $_SERVER['REQUEST_URI'] ?? '';
    if (preg_match('/service-([^\.]+)\.(php|html)/', $requestUri, $matches)) {
        $slug = $matches[1];
    } elseif (preg_match('/service\?slug=([^&]+)/', $requestUri, $matches)) {
        $slug = $matches[1];
    }
}

if (empty($slug)) {
    header("HTTP/1.0 404 Not Found");
    die('Service not found');
}

$pdo = getDBConnection();
$service = null;

// Fallback redirects for known slugs
$slugRedirects = [
    'assistance-visa' => 'visa.php',
    'logistique-transit' => 'logistics.php',
    'conseil-administratif' => 'index.php#contact',
    'importation-vehicules' => 'vehicles.php',
    'solutions-paiement' => 'payments.php',
    'representation-commerciale' => 'index.php#contact'
];

try {
    $stmt = $pdo->prepare("SELECT * FROM services WHERE slug = ? AND is_active = 1");
    $stmt->execute([$slug]);
    $service = $stmt->fetch();
} catch (Exception $e) {
    // Table might not exist or connection failed
    error_log("Service page DB error: " . $e->getMessage());
}

if (!$service && isset($slugRedirects[$slug])) {
    header("Location: " . $slugRedirects[$slug]);
    exit;
}

if (!$service) {
    header("HTTP/1.0 404 Not Found");
    $pageTitle = 'Service Non Trouvé | SULOC';
    include __DIR__ . '/includes/header.php';
    echo '<section class="py-24 bg-white"><div class="container mx-auto px-6 text-center">';
    echo '<h1 class="text-4xl font-bold text-blue-900 mb-4">Service Non Trouvé</h1>';
    echo '<p class="text-lg text-gray-600 mb-8">Le service demandé n\'existe pas ou n\'est plus actif.</p>';
    echo '<a href="index.php#services" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Retour aux Services</a>';
    echo '</div></section>';
    include __DIR__ . '/includes/footer.php';
    exit;
}

$features = $service['features'] ? json_decode($service['features'], true) : [];
$contentBlocks = array_filter(array_map('trim', preg_split("/\n\s*\n/", $service['content'] ?? '')));

$pageTitle = htmlspecialchars($service['title']) . ' | SULOC';
$pageDescription = htmlspecialchars($service['description'] ?? '');

include __DIR__ . '/includes/header.php';
?>

<section class="bg-gradient-to-r from-blue-900 to-green-700 text-white py-20 service-hero">
    <div class="container mx-auto px-6">
        <div class="max-w-4xl">
            <p class="uppercase tracking-widest text-green-300 text-sm mb-4">Service SULOC</p>
            <h1 class="text-4xl md:text-5xl font-bold mb-4"><?php echo htmlspecialchars($service['title']); ?></h1>
            <?php if ($service['description']): ?>
                <p class="text-xl opacity-90 max-w-3xl"><?php echo htmlspecialchars($service['description']); ?></p>
            <?php endif; ?>
        </div>
    </div>
</section>

<section class="py-16 bg-white">
    <div class="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2">
            <?php if ($service['image_url']): ?>
                <div class="mb-8">
                    <img src="<?php echo htmlspecialchars($service['image_url']); ?>" alt="<?php echo htmlspecialchars($service['title']); ?>" class="rounded-2xl shadow-xl w-full object-cover max-h-[420px]">
                </div>
            <?php endif; ?>

            <?php if (!empty($contentBlocks)): ?>
                <?php foreach ($contentBlocks as $block): ?>
                    <p class="text-lg text-gray-700 leading-relaxed mb-6"><?php echo nl2br(htmlspecialchars($block)); ?></p>
                <?php endforeach; ?>
            <?php else: ?>
                <p class="text-lg text-gray-700 leading-relaxed"><?php echo nl2br(htmlspecialchars($service['content'] ?? $service['description'])); ?></p>
            <?php endif; ?>

            <?php if (!empty($features)): ?>
                <h2 class="text-3xl font-bold text-blue-900 mt-10 mb-6">Nos Interventions Clés</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <?php foreach ($features as $feature): ?>
                        <div class="p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition bg-gray-50">
                            <h3 class="text-xl font-semibold text-blue-900 mb-2"><?php echo htmlspecialchars($feature); ?></h3>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>

        <div>
            <div class="bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100">
                <div class="flex items-center space-x-3 mb-4">
                    <div class="h-14 w-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
                        <i class="<?php echo htmlspecialchars($service['icon'] ?? 'fas fa-cogs'); ?>"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-blue-900 mb-1">Pourquoi SULOC</h3>
                        <p class="text-gray-500 text-sm">Expertise locale & internationale</p>
                    </div>
                </div>

                <ul class="space-y-4">
                    <li class="flex items-start">
                        <i class="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                        <div>
                            <strong class="text-blue-900">Équipe pluridisciplinaire</strong>
                            <p class="text-sm text-gray-600">Ingénieurs, urbanistes, sociologues et experts environnementaux.</p>
                        </div>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                        <div>
                            <strong class="text-blue-900">Approche sur mesure</strong>
                            <p class="text-sm text-gray-600">Solutions adaptées aux réalités du terrain et aux contextes locaux.</p>
                        </div>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-check-circle text-green-600 mr-3 mt-1"></i>
                        <div>
                            <strong class="text-blue-900">Impact mesurable</strong>
                            <p class="text-sm text-gray-600">Projets suivis et évalués pour garantir la durabilité.</p>
                        </div>
                    </li>
                </ul>

                <a href="index.php#contact" class="block mt-8 text-center bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                    Discuter de Votre Projet
                </a>
            </div>
        </div>
    </div>
</section>

<section class="py-16 bg-gray-50">
    <div class="container mx-auto px-6 text-center">
        <p class="text-sm uppercase text-green-600 font-semibold tracking-widest mb-3">Prêt à passer à l'action ?</p>
        <h2 class="text-3xl font-bold text-blue-900 mb-4">Contactez notre équipe d'experts</h2>
        <p class="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">Nous accompagnons les institutions publiques, ONG et entreprises pour concevoir et exécuter des projets durables et à fort impact social.</p>
        <a href="index.php#contact" class="inline-flex items-center bg-blue-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-800 transition">
            <i class="fas fa-handshake mr-3"></i>
            Demander une consultation
        </a>
    </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>

