<?php
// Fetch about content from the database
$aboutContent = [];
try {
    $pdo = getDBConnection();
    $stmt = $pdo->query("SELECT section_key, section_value FROM about_content");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $aboutContent[$row['section_key']] = $row['section_value'];
    }
} catch (Exception $e) {
    $aboutContent = [];
}

function get_content($key, $default = '') {
    global $aboutContent;
    return isset($aboutContent[$key]) ? $aboutContent[$key] : $default;
}

function get_list_items($key, $defaults = []) {
    global $aboutContent;
    if (isset($aboutContent[$key])) {
        $items = json_decode($aboutContent[$key], true);
        return is_array($items) ? $items : $defaults;
    }
    return $defaults;
}
?>
<section id="apropos" class="py-24 bg-gray-100">
    <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row items-start gap-12">
            <div class="md:w-1/2">
                <p class="text-green-600 font-bold uppercase mb-2"><?php echo htmlspecialchars(get_content('subtitle', __('about_subtitle'))); ?></p>
                <h2 class="text-4xl font-extrabold text-blue-900 mb-6"><?php echo htmlspecialchars(get_content('title', __('about_title'))); ?></h2>
                <div class="text-xl text-gray-700 mb-8 leading-relaxed border-l-4 border-green-500 pl-4 bg-white p-4 rounded-lg shadow-inner">
                    <?php echo get_content('main_text', __('about_main_text')); ?>
                </div>
                
                <h3 class="text-2xl font-bold text-blue-900 mt-10 mb-4"><?php echo htmlspecialchars(get_content('intervention_title', __('about_intervention_title'))); ?></h3>
                <ul class="space-y-3 text-gray-600 text-lg">
                    <?php 
                    $defaultIntervention = [
                        __('about_intervention_1'),
                        __('about_intervention_2'),
                        __('about_intervention_3'),
                        __('about_intervention_4'),
                        __('about_intervention_5')
                    ];
                    foreach (get_list_items('intervention_items', $defaultIntervention) as $item): 
                    ?>
                    <li class="flex items-start">
                        <i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                        <span><?php echo htmlspecialchars($item); ?></span>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            
            <div class="md:w-1/2 md:pl-8 pt-12 md:pt-0">
                <p class="text-green-600 font-bold uppercase mb-2"><?php echo htmlspecialchars(get_content('methodology_subtitle', __('about_commitment_subtitle'))); ?></p>
                <h3 class="text-3xl font-extrabold text-blue-900 mb-6"><?php echo htmlspecialchars(get_content('methodology_title', __('about_commitment_title'))); ?></h3>
                <div class="space-y-6">
                    <div class="bg-white rounded-xl p-6 shadow-xl border-l-4 border-blue-700 transform hover:-translate-y-1 transition duration-300">
                        <h4 class="text-xl font-bold text-blue-900 mb-2"><?php echo __('about_step1_title'); ?></h4>
                        <p class="text-gray-600">
                            <?php echo __('about_step1_desc'); ?>
                        </p>
                    </div>
                    <div class="bg-white rounded-xl p-6 shadow-xl border-l-4 border-green-700 transform hover:-translate-y-1 transition duration-300">
                        <h4 class="text-xl font-bold text-blue-900 mb-2"><?php echo __('about_step2_title'); ?></h4>
                        <p class="text-gray-600">
                            <?php echo __('about_step2_desc'); ?>
                        </p>
                    </div>
                    <div class="bg-white rounded-xl p-6 shadow-xl border-l-4 border-blue-700 transform hover:-translate-y-1 transition duration-300">
                        <h4 class="text-xl font-bold text-blue-900 mb-2"><?php echo __('about_step3_title'); ?></h4>
                        <p class="text-gray-600">
                            <?php echo __('about_step3_desc'); ?>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>