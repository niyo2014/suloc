<?php
/**
 * SULOC - Logistics & Import Services
 * Smart RFQ & Process Visualizer
 */
require_once __DIR__ . '/config/config.php';

$lang = $translator->getCurrentLanguage();
$isEn = ($lang === 'en');

$pageTitle = __('logistics_page_title') . ' | SULOC';
$pageDescription = __('logistics_page_desc');

$pdo = getDBConnection();
$services = [];
try {
    $stmt = $pdo->query("SELECT * FROM import_services WHERE is_active = 1 ORDER BY order_index ASC, service_name_fr ASC");
    $services = $stmt->fetchAll();
} catch (Exception $e) {
    $services = [];
}

include __DIR__ . '/includes/header.php';
?>

<style>
    :root {
        --primary-navy: #0a2342;
        --accent-gold: #d4af37;
        --mombasa-blue: #0056b3;
        --dar-green: #28a745;
    }

    .logistics-hero {
        background: linear-gradient(rgba(10, 35, 66, 0.85), rgba(10, 35, 66, 0.85)), url('img/logistics-bg.jpg');
        background-size: cover;
        background-position: center;
    }

    /* Process Visualizer (Timeline) */
    .timeline {
        position: relative;
        max-width: 800px;
        margin: 40px auto;
        padding-left: 40px;
    }

    .timeline::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: var(--primary-navy);
        opacity: 0.1;
    }

    .timeline-item {
        position: relative;
        margin-bottom: 40px;
    }

    .timeline-dot {
        position: absolute;
        left: -48px;
        top: 0;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--accent-gold);
        border: 4px solid white;
        box-shadow: 0 0 0 3px var(--primary-navy);
    }

    .timeline-content {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }

    .timeline-content h4 {
        color: var(--primary-navy);
        font-weight: 800;
        margin-bottom: 5px;
    }

    /* Multi-step Form */
    .rfq-card {
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        overflow: hidden;
    }

    .rfq-step {
        display: none;
        padding: 40px;
    }

    .rfq-step.active {
        display: block;
        animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .form-progress {
        display: flex;
        background: #f8f9fa;
    }

    .progress-segment {
        flex: 1;
        padding: 15px;
        text-align: center;
        font-size: 0.8rem;
        font-weight: 700;
        color: #adb5bd;
        border-bottom: 3px solid #e9ecef;
    }

    .progress-segment.active {
        color: var(--primary-navy);
        border-bottom-color: var(--accent-gold);
    }

    .radio-option {
        display: block;
        padding: 15px;
        border: 2px solid #e9ecef;
        border-radius: 12px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .radio-option:hover {
        border-color: var(--accent-gold);
        background: #fffcf5;
    }

    input[type="radio"]:checked + .radio-content {
        border-color: var(--primary-navy);
        background: #f0f4f8;
    }

    .info-box {
        background: #e7f1ff;
        color: #0c4128;
        padding: 12px;
        border-radius: 8px;
        font-size: 0.85rem;
        margin-top: 10px;
        border-left: 4px solid #0056b3;
    }
</style>

<section class="logistics-hero text-white py-24">
    <div class="container mx-auto px-6 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
            <?php echo __('logistics_page_title'); ?>
        </h1>
        <p class="text-xl opacity-90 max-w-2xl mx-auto">
            <?php echo __('logistics_page_desc'); ?>
        </p>
    </div>
</section>

<div class="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16">
    <!-- Left: Process Visualizer -->
    <div>
        <h2 class="text-3xl font-bold text-navy-900 mb-8">
            <i class="fas fa-route text-gold-500 mr-2"></i>
            <?php echo __('logistics_stages_title'); ?>
        </h2>
        
        <div class="timeline">
            <?php
            $stages = [
                ['logistics_stage1_title', 'logistics_stage1_desc'],
                ['logistics_stage2_title', 'logistics_stage2_desc'],
                ['logistics_stage3_title', 'logistics_stage3_desc'],
                ['logistics_stage4_title', 'logistics_stage4_desc'],
                ['logistics_stage5_title', 'logistics_stage5_desc']
            ];
            foreach ($stages as $stage):
            ?>
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4><?php echo __(htmlspecialchars($stage[0])); ?></h4>
                    <p class="text-gray-600 text-sm"><?php echo __(htmlspecialchars($stage[1])); ?></p>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Right: Smart RFQ Form -->
    <div id="rfq-container">
        <div class="rfq-card">
            <div class="form-progress">
                <div class="progress-segment active" id="seg-1">1. <?php echo __('nav_logistics'); ?></div>
                <div class="progress-segment" id="seg-2">2. Cargo</div>
                <div class="progress-segment" id="seg-3">3. Contact</div>
            </div>

            <form id="rfq-form" action="handlers/logistics-request-handler.php" method="POST">
                <!-- Step 1: Origin & Route -->
                <div class="rfq-step active" id="step-1">
                    <h3 class="text-xl font-bold mb-6 text-navy-900"><?php echo __('rfq_title_route'); ?></h3>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-2"><?php echo __('rfq_label_origin'); ?></label>
                        <select name="origin_country" class="w-full p-3 border rounded-lg" required>
                            <option value="China">China</option>
                            <option value="Europe">Europe</option>
                            <option value="UAE">UAE / Dubai</option>
                            <option value="Turkey">Turkey</option>
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-2"><?php echo __('rfq_label_transit_port'); ?></label>
                        <div class="grid grid-cols-2 gap-4">
                            <label class="radio-option">
                                <input type="radio" name="transit_port" value="Mombasa" class="hidden" checked>
                                <span>Mombasa</span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="transit_port" value="Dar es Salaam" class="hidden">
                                <span>Dar es Salaam</span>
                            </label>
                        </div>
                        <div class="info-box">
                            <i class="fas fa-info-circle mr-1"></i>
                            <?php echo __('rfq_port_info'); ?>
                        </div>
                    </div>

                    <button type="button" class="w-full text-white p-4 rounded-xl font-bold transition" style="background-color: var(--primary-navy);" onclick="nextStep(2)">
                        <?php echo __('rfq_btn_next'); ?> <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>

                <!-- Step 2: Cargo Details -->
                <div class="rfq-step" id="step-2">
                    <h3 class="text-xl font-bold mb-6 text-navy-900"><?php echo __('rfq_title_cargo'); ?></h3>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-2"><?php echo __('rfq_label_shipment_type'); ?></label>
                        <select name="container_size" class="w-full p-3 border rounded-lg">
                            <option value="20ft">20ft Container (FCL)</option>
                            <option value="40ft">40ft Container (FCL)</option>
                            <option value="LCL/Groupage">Groupage / LCL (Partiel)</option>
                        </select>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-2"><?php echo __('rfq_label_commodity'); ?></label>
                        <input type="text" name="commodity_type" class="w-full p-3 border rounded-lg" placeholder="<?php echo __('rfq_placeholder_commodity'); ?>">
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Incoterm</label>
                        <select name="incoterm" class="w-full p-3 border rounded-lg">
                            <option value="EXW">EXW (Ex-Works)</option>
                            <option value="FOB">FOB (Free on Board)</option>
                            <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                            <option value="DAP">DAP (Delivered at Place)</option>
                        </select>
                    </div>

                    <div class="flex space-x-4 mt-8">
                        <button type="button" class="flex-1 border p-4 rounded-xl font-bold" style="border-color: var(--primary-navy); color: var(--primary-navy);" onclick="nextStep(1)">
                            <i class="fas fa-arrow-left mr-2"></i> <?php echo __('rfq_btn_back'); ?>
                        </button>
                        <button type="button" class="flex-1 text-white p-4 rounded-xl font-bold" style="background-color: var(--primary-navy);" onclick="nextStep(3)">
                            <?php echo __('rfq_btn_final'); ?> <i class="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>

                <!-- Step 3: Contact & Submit -->
                <div class="rfq-step" id="step-3">
                    <h3 class="text-xl font-bold mb-6 text-navy-900"><?php echo __('rfq_title_finalize'); ?></h3>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-bold text-gray-700 mb-2"><?php echo __('rfq_label_fullname'); ?></label>
                        <input type="text" name="client_name" class="w-full p-3 border rounded-lg" required>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-bold text-gray-700 mb-2"><?php echo __('rfq_label_whatsapp'); ?></label>
                        <input type="tel" name="client_phone" class="w-full p-3 border rounded-lg" required placeholder="+257 ...">
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-bold text-gray-700 mb-2"><?php echo __('rfq_label_email'); ?></label>
                        <input type="email" name="client_email" class="w-full p-3 border rounded-lg">
                    </div>

                    <input type="hidden" name="destination_country" value="Burundi"> <!-- Default for Burundi based SULOC -->

                    <div class="flex space-x-4 mt-8">
                        <button type="button" class="flex-1 border p-4 rounded-xl font-bold" style="border-color: var(--primary-navy); color: var(--primary-navy);" onclick="nextStep(2)">
                            <i class="fas fa-arrow-left mr-2"></i> <?php echo __('rfq_btn_back'); ?>
                        </button>
                        <button type="submit" class="flex-1 text-white p-4 rounded-xl font-bold transform transition active:scale-95" style="background-color: var(--dar-green);">
                            <i class="fas fa-paper-plane mr-2"></i> <?php echo __('rfq_btn_submit'); ?>
                        </button>
                    </div>
                </div>
            </form>

            <div id="rfq-success" class="hidden p-12 text-center">
                <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    <i class="fas fa-check"></i>
                </div>
                <h3 class="text-2xl font-bold text-navy-900 mb-2"><?php echo __('rfq_success_title'); ?></h3>
                <p class="text-gray-600 mb-8"><?php echo __('rfq_success_desc'); ?></p>
                <a href="#" id="wa-continue" target="_blank" class="block w-full bg-green-500 text-white p-4 rounded-xl font-bold hover:bg-green-600 transition">
                    <i class="fab fa-whatsapp mr-2"></i> <?php echo __('rfq_btn_wa_continue'); ?>
                </a>
            </div>
        </div>
    </div>
</div>

<script>
    function nextStep(step) {
        document.querySelectorAll('.rfq-step').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.progress-segment').forEach(seg => seg.classList.remove('active'));
        
        document.getElementById('step-' + step).classList.add('active');
        for(let i=1; i<=step; i++) {
            document.getElementById('seg-' + i).classList.add('active');
        }
    }

    document.getElementById('rfq-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const form = this;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ...';

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.classList.add('hidden');
                document.querySelector('.form-progress').classList.add('hidden');
                document.getElementById('rfq-success').classList.remove('hidden');
                
                const waPhone = '<?php echo preg_replace('/[^0-9]/', '', getenv('PHONE_WHATSAPP') ?: '25762400920'); ?>';
                const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(data.wa_message)}`;
                document.getElementById('wa-continue').href = waUrl;
            } else {
                alert(data.message);
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Request Quote';
            }
        })
        .catch(err => {
            alert('Request failed. Please try again.');
            submitBtn.disabled = false;
        });
    });
</script>

<?php include __DIR__ . '/includes/footer.php'; ?>
