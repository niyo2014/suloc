<?php
// admin/home.php
require_once __DIR__ . '/../config/config.php';
requireLogin(); // Use the consistent authentication function

// Establish database connection using the function from config.php
$pdo = getDBConnection();

// Fetch content from the database
$content = [];
$stmt = $pdo->query("SELECT content_key, content_value FROM site_content");
if ($stmt) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $content[$row['content_key']] = $row['content_value'];
    }
}

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Home Content - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">

<?php include_once 'includes/admin-header.php'; ?>

<div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-blue-900 mb-6">Edit Home Page Content</h1>

    <?php if (isset($_GET['status']) && $_GET['status'] == 'success'): ?>
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong class="font-bold">Success!</strong>
            <span class="block sm:inline">Content updated successfully.</span>
        </div>
    <?php endif; ?>

    <form action="update-home-content.php" method="POST" class="bg-white rounded-xl shadow-lg p-8 mb-4">

        <!-- Hero Section -->
        <fieldset class="mb-8 border-t-4 border-blue-600 pt-6">
            <legend class="text-2xl font-bold text-blue-900 mb-4">Hero Banner</legend>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="hero_headline">
                    Main Headline
                </label>
                <input class="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="hero_headline" name="hero_headline" type="text" placeholder="Main Headline" value="<?php echo htmlspecialchars($content['hero_headline'] ?? ''); ?>">
            </div>

            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="hero_tagline">
                    Tagline
                </label>
                <textarea class="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="hero_tagline" name="hero_tagline" rows="3" placeholder="Enter tagline here..."><?php echo htmlspecialchars($content['hero_tagline'] ?? ''); ?></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg border">
                    <h3 class="font-semibold text-gray-800 mb-2">CTA Button 1</h3>
                    <label class="block text-gray-700 text-xs font-bold mb-1" for="hero_cta1_text">
                        Button Text
                    </label>
                    <input class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="hero_cta1_text" name="hero_cta1_text" type="text" placeholder="Button Text" value="<?php echo htmlspecialchars($content['hero_cta1_text'] ?? ''); ?>">
                    <label class="block text-gray-700 text-xs font-bold mb-1" for="hero_cta1_link">
                        Button Link
                    </label>
                    <input class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="hero_cta1_link" name="hero_cta1_link" type="text" placeholder="/contact.php" value="<?php echo htmlspecialchars($content['hero_cta1_link'] ?? ''); ?>">
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border">
                    <h3 class="font-semibold text-gray-800 mb-2">CTA Button 2</h3>
                    <label class="block text-gray-700 text-xs font-bold mb-1" for="hero_cta2_text">
                        Button Text
                    </label>
                    <input class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="hero_cta2_text" name="hero_cta2_text" type="text" placeholder="Button Text" value="<?php echo htmlspecialchars($content['hero_cta2_text'] ?? ''); ?>">
                    <label class="block text-gray-700 text-xs font-bold mb-1" for="hero_cta2_link">
                        Button Link
                    </label>
                    <input class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="hero_cta2_link" name="hero_cta2_link" type="text" placeholder="/projects.php" value="<?php echo htmlspecialchars($content['hero_cta2_link'] ?? ''); ?>">
                </div>
            </div>
        </fieldset>

        <!-- Statistics Section -->
        <fieldset class="mb-6 border-t-4 border-green-600 pt-6">
            <legend class="text-2xl font-bold text-green-800 mb-4">Statistics Section</legend>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <?php for ($i = 1; $i <= 4; $i++): ?>
                    <div class="bg-gray-50 p-4 rounded-lg border">
                        <h3 class="font-semibold text-gray-800 mb-2">Stat #<?php echo $i; ?></h3>
                        <div class="mb-2">
                            <label class="block text-gray-700 text-xs font-bold mb-1" for="stat<?php echo $i; ?>_value">
                                Value (e.g., 2010, 60+)
                            </label>
                            <input class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500" id="stat<?php echo $i; ?>_value" name="stat<?php echo $i; ?>_value" type="text" value="<?php echo htmlspecialchars($content['stat' . $i . '_value'] ?? ''); ?>">
                        </div>
                        <div>
                            <label class="block text-gray-700 text-xs font-bold mb-1" for="stat<?php echo $i; ?>_label">
                                Label
                            </label>
                            <input class="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500" id="stat<?php echo $i; ?>_label" name="stat<?php echo $i; ?>_label" type="text" value="<?php echo htmlspecialchars($content['stat' . $i . '_label'] ?? ''); ?>">
                        </div>
                    </div>
                <?php endfor; ?>
            </div>
        </fieldset>

        <div class="flex items-center justify-end mt-8">
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105" type="submit">
                <i class="fas fa-save mr-2"></i>
                Save Changes
            </button>
        </div>
    </form>
</div>

</body>
</html>
