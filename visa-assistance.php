<?php
/**
 * SULOC - Visa Assistance Page
 */
require_once __DIR__ . '/config/config.php';

$pageTitle = 'Assistance Visa | SULOC - Facilitation Expert';
$pageDescription = 'Demandez votre assistance visa professionnelle avec SULOC. Accompagnement complet pour tous types de visas et destinations.';

include __DIR__ . '/includes/header.php';
?>

<!-- Hero Section -->
<section class="bg-blue-900 text-white py-20 relative overflow-hidden">
    <div class="absolute inset-0 opacity-10">
        <img src="img/bg-visa.jpg" alt="" class="w-full h-full object-cover">
    </div>
    <div class="container mx-auto px-6 relative z-10 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">Assistance Visa Professionnelle</h1>
        <p class="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
            Nous vous accompagnons dans chaque étape de votre demande de visa pour maximiser vos chances de succès.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
            <a href="#request-form" class="bg-gold text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gold-dark transition shadow-xl">
                Demander une assistance
            </a>
            <a href="visa.php" class="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl">
                Consulter les tarifs
            </a>
        </div>
    </div>
</section>

<!-- Service Description -->
<section class="py-20 bg-white">
    <div class="container mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 class="text-3xl font-bold text-blue-900 mb-6">Notre expertise à votre service</h2>
                <p class="text-gray-700 text-lg mb-6">
                    SULOC propose un service d'assistance complet pour la préparation de vos dossiers de visa. Notre rôle est de vous guider, de vérifier vos documents et de vous conseiller sur les meilleures pratiques pour votre destination.
                </p>
                <div class="space-y-4">
                    <div class="flex items-start">
                        <div class="bg-gold-light p-2 rounded-lg mr-4 mt-1">
                            <i class="fas fa-check text-white"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-blue-900">Préparation documentaire</h4>
                            <p class="text-gray-600">Liste exhaustive et vérification de conformité de chaque pièce du dossier.</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="bg-gold-light p-2 rounded-lg mr-4 mt-1">
                            <i class="fas fa-check text-white"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-blue-900">Vérification & Correction</h4>
                            <p class="text-gray-600">Relecture minutieuse pour éviter les erreurs administratives courantes.</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="bg-gold-light p-2 rounded-lg mr-4 mt-1">
                            <i class="fas fa-check text-white"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-blue-900">Accompagnement personnalisé</h4>
                            <p class="text-gray-600">Suivi étape par étape jusqu'au dépôt de votre demande.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 p-8 rounded-3xl shadow-inner border border-gray-100">
                <h3 class="text-2xl font-bold text-blue-900 mb-6">Processus en 5 étapes</h3>
                <div class="space-y-8">
                    <div class="flex relative">
                        <div class="h-full w-0.5 bg-blue-100 absolute left-4 top-8 -bottom-8"></div>
                        <div class="z-10 bg-blue-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0">1</div>
                        <div>
                            <h5 class="font-bold text-blue-900">Soumission de la demande</h5>
                            <p class="text-sm text-gray-600">Remplissez le formulaire en ligne avec vos informations de base.</p>
                        </div>
                    </div>
                    <div class="flex relative">
                        <div class="h-full w-0.5 bg-blue-100 absolute left-4 top-8 -bottom-8"></div>
                        <div class="z-10 bg-blue-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0">2</div>
                        <div>
                            <h5 class="font-bold text-blue-900">Analyse du profil</h5>
                            <p class="text-sm text-gray-600">Un agent analyse votre situation selon le type de visa demandé.</p>
                        </div>
                    </div>
                    <div class="flex relative">
                        <div class="h-full w-0.5 bg-blue-100 absolute left-4 top-8 -bottom-8"></div>
                        <div class="z-10 bg-blue-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0">3</div>
                        <div>
                            <h5 class="font-bold text-blue-900">Constitution du dossier</h5>
                            <p class="text-sm text-gray-600">Nous vous fournissons la liste des documents et vérifions leur validité.</p>
                        </div>
                    </div>
                    <div class="flex relative">
                        <div class="h-full w-0.5 bg-blue-100 absolute left-4 top-8 -bottom-8"></div>
                        <div class="z-10 bg-blue-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0">4</div>
                        <div>
                            <h5 class="font-bold text-blue-900">Dépôt & Suivi</h5>
                            <p class="text-sm text-gray-600">Accompagnement pour le rendez-vous et suivi de l'avancement.</p>
                        </div>
                    </div>
                    <div class="flex">
                        <div class="z-10 bg-blue-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0">5</div>
                        <div>
                            <h5 class="font-bold text-blue-900">Réponse de l'Ambassade</h5>
                            <p class="text-sm text-gray-600">Communication du résultat final (Acceptation ou Refus).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Form Section -->
<section id="request-form" class="py-20 bg-gray-50">
    <div class="container mx-auto px-6 max-w-4xl">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div class="bg-blue-900 text-white p-8">
                <h2 class="text-3xl font-bold mb-2">Demander une assistance</h2>
                <p class="opacity-80">Remplissez le formulaire ci-dessous pour démarrer votre procédure.</p>
            </div>
            
            <form id="visa-form" action="handlers/visa-request-handler.php" method="POST" enctype="multipart/form-data" class="p-8 space-y-8">
                <!-- Personal Info -->
                <div>
                    <h3 class="text-xl font-bold text-blue-900 mb-6 flex items-center">
                        <i class="fas fa-user mr-3 text-gold"></i> Informations Personnelles
                    </h3>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Nom Complet *</label>
                            <input type="text" name="full_name" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                            <input type="email" name="email" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Téléphone (WhatsApp souhaité) *</label>
                            <input type="tel" name="phone" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition" placeholder="+257 ...">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Pays d'origine *</label>
                            <input type="text" name="origin_country" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition">
                        </div>
                    </div>
                </div>

                <hr class="border-gray-100">

                <!-- Visa Details -->
                <div>
                    <h3 class="text-xl font-bold text-blue-900 mb-6 flex items-center">
                        <i class="fas fa-passport mr-3 text-gold"></i> Détails du Voyage
                    </h3>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Pays de destination *</label>
                            <input type="text" name="destination_country" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Type de Visa *</label>
                            <select name="visa_type" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition">
                                <option value="tourist">Visa Touristique</option>
                                <option value="business">Visa d'Affaires</option>
                                <option value="student">Visa Étudiant</option>
                                <option value="work">Visa de Travail</option>
                                <option value="medical">Visa Médical</option>
                                <option value="transit">Visa de Transit</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Date prévue de départ</label>
                            <input type="date" name="departure_date" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Durée du séjour</label>
                            <input type="text" name="duration_stay" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition" placeholder="Ex: 15 jours, 3 mois...">
                        </div>
                    </div>
                    <div class="mt-6">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Objectif du voyage</label>
                        <textarea name="travel_purpose" rows="3" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition"></textarea>
                    </div>
                </div>

                <hr class="border-gray-100">

                <!-- Documents -->
                <div>
                    <h3 class="text-xl font-bold text-blue-900 mb-6 flex items-center">
                        <i class="fas fa-file-upload mr-3 text-gold"></i> Documents (Optionnel)
                    </h3>
                    <p class="text-sm text-gray-500 mb-4">Vous pouvez joindre des copies de vos documents (Passeport, Invitation, etc.) au format PDF ou JPG.</p>
                    <div class="flex items-center justify-center w-full">
                        <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                <p class="text-sm text-gray-500"><span class="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez</p>
                                <p class="text-xs text-gray-400">PDF, JPG (Max 5Mo)</p>
                            </div>
                            <input type="file" name="documents[]" multiple class="hidden" accept=".pdf,.jpg,.jpeg">
                        </label>
                    </div>
                    <div id="file-list" class="mt-4 flex flex-wrap gap-2"></div>
                </div>

                <!-- Disclaimer -->
                <div class="bg-blue-50 border-l-4 border-blue-900 p-6 rounded-xl">
                    <div class="flex">
                        <div class="shrink-0">
                            <i class="fas fa-info-circle text-blue-900 mt-1"></i>
                        </div>
                        <div class="ml-4">
                            <h5 class="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2">Avertissement Légal</h5>
                            <p class="text-sm text-blue-800 leading-relaxed">
                                SULOC fournit un service d'accompagnement et de préparation de dossier. Nous ne garantissons en aucun cas l'octroi du visa, car la décision finale appartient exclusivement aux autorités consulaires et aux ambassades concernées. Les frais de service perçus par SULOC sont distincts des frais de visa de l'ambassade et ne sont pas remboursables en cas de refus.
                            </p>
                        </div>
                    </div>
                </div>

                <div id="form-message" class="hidden p-4 rounded-xl"></div>

                <div class="flex justify-end">
                    <button type="submit" class="bg-blue-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition shadow-lg flex items-center">
                        <span>Demander une assistance visa</span>
                        <i class="fas fa-paper-plane ml-3"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('visa-form');
    const messageDiv = document.getElementById('form-message');
    const fileInput = form.querySelector('input[type="file"]');
    const fileList = document.getElementById('file-list');

    fileInput.addEventListener('change', function() {
        fileList.innerHTML = '';
        Array.from(this.files).forEach(file => {
            const span = document.createElement('span');
            span.className = 'px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center';
            span.innerHTML = `<i class="fas fa-file mr-2"></i>${file.name}`;
            fileList.appendChild(span);
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('span');
        const btnIcon = submitBtn.querySelector('i');
        
        submitBtn.disabled = true;
        btnText.textContent = 'Envoi en cours...';
        btnIcon.className = 'fas fa-spinner fa-spin ml-3';
        
        fetch(this.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'bg-green-100', 'text-green-800');
            if (data.success) {
                messageDiv.classList.add('bg-green-100', 'text-green-800');
                messageDiv.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${data.message}`;
                form.reset();
                fileList.innerHTML = '';
            } else {
                messageDiv.classList.add('bg-red-100', 'text-red-800');
                messageDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${data.message}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            messageDiv.classList.remove('hidden');
            messageDiv.classList.add('bg-red-100', 'text-red-800');
            messageDiv.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>Une erreur est survenue lors de l'envoi. Veuillez réessayer.`;
        })
        .finally(() => {
            submitBtn.disabled = false;
            btnText.textContent = 'Demander une assistance visa';
            btnIcon.className = 'fas fa-paper-plane ml-3';
        });
    });
});
</script>

<?php include __DIR__ . '/includes/footer.php'; ?>
