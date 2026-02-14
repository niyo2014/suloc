<?php
/**
 * SULOC - Money Transfer Platform (v2.0)
 * Transitioned from Exchange to Remittance Model
 */
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/includes/payment-helpers.php';

$pageTitle = 'SULOC Money Transfer | Remittance Sécurisée';
$pageDescription = 'Envoyez de l\'argent vers la RDC, le Burundi et l\'international. Frais transparents et retrait sécurisé par code secret.';

$pdo = getDBConnection();

// Fetch settings (Fees and Phone)
$stmt = $pdo->prepare("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('transfer_fee_percentage', 'phone_whatsapp')");
$stmt->execute();
$settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
$feePercent = floatval($settings['transfer_fee_percentage'] ?? 5.97);
$phoneWhatsApp = $settings['phone_whatsapp'] ?? '25762400920';

$operators = [];
try {
    $stmt = $pdo->query("SELECT * FROM payment_services WHERE is_active = 1 ORDER BY order_index ASC");
    $operators = $stmt->fetchAll();
} catch (Exception $e) { $operators = []; }

include __DIR__ . '/includes/header.php';
?>

<style>
    :root { --suloc-navy: #0a2342; --suloc-gold: #d4af37; }
    .hero-v2 { background: linear-gradient(135deg, var(--suloc-navy) 0%, #16365a 100%); position: relative; }
    .hero-v2::before { content: ''; position: absolute; inset: 0; background: url('https://www.transparenttextures.com/patterns/carbon-fibre.png'); opacity: 0.05; }
    .card-v2 { background: white; border-radius: 2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.05); }
    .btn-suloc { background: var(--suloc-gold); color: var(--suloc-navy); font-weight: 800; border-radius: 1rem; transition: all 0.3s; }
    .btn-suloc:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3); }
    .btn-navy { background: var(--suloc-navy); color: white; }
    .input-v2 { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 1rem; transition: all 0.3s; }
    .input-v2:focus { border-color: var(--suloc-gold); background: white; outline: none; }
    .status-badge { font-weight: 900; letter-spacing: -0.025em; text-transform: uppercase; font-size: 0.7rem; padding: 0.25rem 0.75rem; border-radius: 9999px; }
</style>

<!-- Mobile Money Operators Grid -->
<section class="py-12 bg-slate-50 border-b border-slate-200">
    <div class="container mx-auto px-6">
        <div class="text-center mb-10">
            <h2 class="text-3xl font-black text-navy mb-4" style="color: var(--suloc-navy);">Nos Opérateurs & Tarifs</h2>
            <p class="text-gray-500 max-w-2xl mx-auto">Consultez les taux de change et les tarifs de nos partenaires en temps réel.</p>
        </div>
        
        <?php if (empty($operators)): ?>
            <div class="text-center py-10 bg-white rounded-2xl shadow-sm border border-slate-100">
                <p class="text-gray-500">Aucun opérateur disponible pour le moment.</p>
            </div>
        <?php else: ?>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <?php foreach ($operators as $op): ?>
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition duration-300 group">
                        <div class="h-16 flex items-center mb-4">
                            <?php if (!empty($op['operator_logo'])): ?>
                                <img src="<?php echo htmlspecialchars($op['operator_logo']); ?>" alt="<?php echo htmlspecialchars($op['operator_name']); ?>" class="max-h-full max-w-full object-contain">
                            <?php else: ?>
                                <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold">
                                    <?php echo strtoupper(substr($op['operator_name'], 0, 1)); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                        
                        <h3 class="font-bold text-lg text-navy mb-2" style="color: var(--suloc-navy);"><?php echo htmlspecialchars($op['operator_name']); ?></h3>
                        
                        <?php if (!empty($op['exchange_rate'])): ?>
                            <div class="bg-blue-50 rounded-lg p-3 mb-3">
                                <div class="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Taux du Jour</div>
                                <div class="font-black text-blue-900">
                                    1 USD = <?php echo floatval($op['exchange_rate']); ?> <?php echo htmlspecialchars(explode('/', $op['currency_pair'])[1] ?? ''); ?>
                                </div>
                            </div>
                        <?php else: ?>
                            <div class="bg-gray-50 rounded-lg p-3 mb-3">
                                <div class="text-xs text-gray-500 font-bold uppercase tracking-wider">Tarif Standard</div>
                            </div>
                        <?php endif; ?>
                        
                        <div class="flex items-center justify-between text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                            <span><i class="fas fa-check-circle text-green-500 mr-1"></i> Disponible</span>
                            <i class="fas fa-arrow-right group-hover:translate-x-1 transition text-gold" style="color: var(--suloc-gold);"></i>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- Hero Section -->
<section class="hero-v2 pt-32 pb-48 text-white text-center md:text-left overflow-hidden">
    <div class="container mx-auto px-6 relative z-10">
        <div class="flex flex-col md:flex-row items-center gap-16">
            <div class="md:w-3/5">
                <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                    <span class="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                    <span class="text-xs font-bold tracking-widest uppercase">Remittance Platform v2.0 Live</span>
                </div>
                <h1 class="text-5xl md:text-7xl font-black mb-8 leading-tight"><?php echo __('remittance_hero_title'); ?></h1>
                <p class="text-xl md:text-2xl opacity-80 max-w-2xl mb-12"><?php echo __('remittance_hero_subtitle'); ?></p>
                <div class="flex flex-wrap justify-center md:justify-start gap-4">
                    <a href="#calc" class="btn-suloc px-10 py-5 text-lg shadow-xl"><?php echo __('remittance_btn_simulate'); ?></a>
                    <a href="#status" class="bg-white/5 hover:bg-white/10 px-10 py-5 rounded-2xl border border-white/20 backdrop-blur transition font-bold"><?php echo __('remittance_btn_track'); ?></a>
                </div>
            </div>
            <div class="md:w-2/5 w-full">
                <div class="card-v2 p-10 text-navy relative" style="color: var(--suloc-navy);">
                    <div class="absolute -top-6 -right-6 w-24 h-24 bg-gold rounded-full flex items-center justify-center shadow-xl rotate-12" style="background: var(--suloc-gold);">
                        <span class="text-center font-black text-xs leading-none">Frais Fixes<br><span class="text-2xl"><?php echo $feePercent; ?>%</span></span>
                    </div>
                    <label class="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4"><?php echo __('remittance_calc_title'); ?></label>
                    <div class="space-y-6">
                        <div>
                            <div class="flex justify-between text-xs font-bold mb-2"><span><?php echo __('remittance_calc_send_label'); ?></span> <span class="text-gold" style="color: var(--suloc-gold);"><?php echo __('remittance_calc_total_secure'); ?></span></div>
                            <div class="relative">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                                <input type="number" id="send-amt" placeholder="0.00" class="input-v2 w-full pl-10 pr-6 py-5 text-3xl font-black" oninput="runCalc()">
                            </div>
                        </div>
                        <div class="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <div class="flex justify-between items-center mb-4">
                                <span class="text-sm font-bold text-gray-500"><?php echo __('remittance_calc_fees_label'); ?> (<?php echo $feePercent; ?>%)</span>
                                <span id="fee-amt" class="text-lg font-black text-red-500">0.00 $</span>
                            </div>
                            <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <span class="text-sm font-black text-navy"><?php echo __('remittance_calc_total_pay'); ?></span>
                                <span id="total-pay" class="text-xl font-black text-navy" style="color: var(--suloc-navy);">0.00 $</span>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-xs font-black text-gray-400 uppercase mb-1"><?php echo __('remittance_calc_receive_label'); ?></div>
                            <div id="recv-amt" class="text-4xl font-black text-green-600">0.00 $</div>
                        </div>
                        <button onclick="sendToWA()" class="w-full btn-suloc py-5 text-xl flex items-center justify-center gap-3">
                            <i class="fab fa-whatsapp text-2xl"></i> <?php echo __('remittance_btn_whatsapp'); ?>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Tracking Section -->
<section id="status" class="py-24 bg-white relative z-20 -mt-20">
    <div class="container mx-auto px-6">
        <div class="card-v2 p-8 md:p-16 border-blue-50">
            <div class="max-w-3xl mx-auto text-center mb-12">
                <h2 class="text-3xl md:text-5xl font-black text-navy mb-4" style="color: var(--suloc-navy);"><?php echo __('remittance_track_title'); ?></h2>
                <p class="text-lg text-gray-500"><?php echo __('remittance_track_subtitle'); ?></p>
            </div>
            
            <div class="max-w-xl mx-auto">
                <div class="relative group">
                    <input type="text" id="su-code" placeholder="<?php echo __('remittance_track_placeholder'); ?>" class="input-v2 w-full px-8 py-6 text-2xl font-mono text-center uppercase tracking-[0.5em] focus:scale-105 transform transition duration-500">
                    <div class="absolute inset-0 rounded-2xl pointer-events-none group-focus-within:ring-4 group-focus-within:ring-gold/20 transition duration-500"></div>
                </div>
                <button id="track-su" class="w-full mt-6 btn-navy py-6 rounded-2xl font-black text-xl hover:bg-gold transition-all duration-500 flex items-center justify-center gap-4" style="background: var(--suloc-navy);">
                    <i class="fas fa-fingerprint"></i> <?php echo __('remittance_btn_verify_status'); ?>
                </button>
                
                <div id="su-result" class="mt-8 hidden animate-slide-up">
                    <!-- Result Card -->
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Workflows Section -->
<section class="py-24 bg-slate-50">
    <div class="container mx-auto px-6">
        <h2 class="text-4xl font-black text-center text-navy mb-20" style="color: var(--suloc-navy);"><?php echo __('remittance_eco_title'); ?></h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="p-8 bg-white rounded-3xl shadow-lg border-b-8 border-blue-500">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-2xl"><i class="fas fa-university"></i></div>
                <h3 class="text-xl font-bold mb-4"><?php echo __('remittance_eco_step1_title'); ?></h3>
                <p class="text-gray-500 text-sm"><?php echo __('remittance_eco_step1_desc'); ?></p>
            </div>
            <div class="p-8 bg-white rounded-3xl shadow-lg border-b-8 border-yellow-500">
                <div class="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 text-2xl"><i class="fas fa-camera"></i></div>
                <h3 class="text-xl font-bold mb-4"><?php echo __('remittance_eco_step2_title'); ?></h3>
                <p class="text-gray-500 text-sm"><?php echo __('remittance_eco_step2_desc'); ?></p>
            </div>
            <div class="p-8 bg-white rounded-3xl shadow-lg border-b-8 border-indigo-500">
                <div class="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 text-2xl"><i class="fas fa-key"></i></div>
                <h3 class="text-xl font-bold mb-4"><?php echo __('remittance_eco_step3_title'); ?></h3>
                <p class="text-gray-500 text-sm"><?php echo __('remittance_eco_step3_desc'); ?></p>
            </div>
            <div class="p-8 bg-white rounded-3xl shadow-lg border-b-8 border-green-500">
                <div class="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 text-2xl"><i class="fas fa-id-badge"></i></div>
                <h3 class="text-xl font-bold mb-4"><?php echo __('remittance_eco_step4_title'); ?></h3>
                <p class="text-gray-500 text-sm"><?php echo __('remittance_eco_step4_desc'); ?></p>
            </div>
        </div>
    </div>
</section>

<script>
    const feePct = <?php echo $feePercent; ?>;
    
    function runCalc() {
        const amt = parseFloat(document.getElementById('send-amt').value) || 0;
        const fee = (amt * feePct) / 100;
        const total = amt + fee;
        
        document.getElementById('fee-amt').innerText = fee.toFixed(2) + ' $';
        document.getElementById('total-pay').innerText = total.toFixed(2) + ' $';
        document.getElementById('recv-amt').innerText = amt.toFixed(2) + ' $';
    }

    function sendToWA() {
        const amt = document.getElementById('send-amt').value || 0;
        const phone = "<?php echo preg_replace('/[^0-9]/', '', $phoneWhatsApp); ?>";
        const msg = `Bonjour SULOC, je souhaite effectuer un transfert de ${amt} USD. J'ai vu vos frais de ${feePct}%.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    }

    // Status Tracker Logic
    const btnTrack = document.getElementById('track-su');
    const inputCode = document.getElementById('su-code');
    const resultBox = document.getElementById('su-result');

    btnTrack.addEventListener('click', async () => {
        const code = inputCode.value.trim();
        if(!code) return;
        
        btnTrack.innerHTML = '<i class="fas fa-cog fa-spin"></i> <?php echo __('track_verifying'); ?>';
        btnTrack.disabled = true;

        try {
            const res = await fetch(`handlers/payment-status.php?code=${encodeURIComponent(code)}`);
            const data = await res.json();
            
            resultBox.classList.remove('hidden');
            if (data.found) {
                resultBox.innerHTML = `
                    <div class="p-8 bg-blue-50 border border-blue-100 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6">
                        <div class="flex items-center gap-6">
                            <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                <i class="fas fa-check-circle text-3xl"></i>
                            </div>
                            <div class="text-left">
                                <div class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1"><?php echo __('track_result_title'); ?></div>
                                <div class="text-xl font-black" style="color: ${data.color}">${data.label}</div>
                                <div class="text-sm font-bold text-gray-400"><?php echo __('track_result_date', ['date' => '${data.date}']); ?></div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-[10px] font-black uppercase text-gray-400"><?php echo __('track_result_total'); ?></div>
                            <div class="text-3xl font-black text-navy" style="color: var(--suloc-navy);">${data.amount} ${data.currency}</div>
                        </div>
                    </div>
                `;
            } else {
                resultBox.innerHTML = `
                    <div class="p-8 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-6">
                        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
                            <i class="fas fa-exclamation-triangle text-3xl"></i>
                        </div>
                        <div class="text-left">
                            <div class="text-xl font-black text-red-600 uppercase"><?php echo __('track_err_title'); ?></div>
                            <p class="text-red-500/60 font-medium"><?php echo __('track_err_desc'); ?></p>
                        </div>
                    </div>
                `;
            }
        } catch(e) { console.error(e); }
        finally {
            btnTrack.innerHTML = '<i class="fas fa-fingerprint"></i> VÉRIFIER LE STATUT';
            btnTrack.disabled = false;
        }
    });

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
    `;
    document.head.appendChild(style);
</script>

<?php include __DIR__ . '/includes/footer.php'; ?>
