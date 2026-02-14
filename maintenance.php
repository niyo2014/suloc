<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maintenance - SULOC</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @keyframes pulse-slow {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
    </style>
</head>
<body class="bg-slate-900 text-white min-h-screen flex items-center justify-center p-6 text-center">
    <div class="max-w-2xl">
        <div class="mb-8 animate-pulse-slow text-red-500">
            <i class="fas fa-tools text-8xl"></i>
        </div>
        <h1 class="text-5xl font-black mb-6 tracking-tight">TRAVAUX DE MAINTENANCE</h1>
        <p class="text-xl text-gray-400 mb-8 leading-relaxed">
            Notre plateforme SULOC subit actuellement une mise à jour de sécurité critique. 
            Le système sera de retour en ligne sous peu. Merci de votre patience.
        </p>
        <div class="inline-block px-8 py-4 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
            <div class="text-sm uppercase tracking-widest text-gray-500 font-bold mb-2">Statut Système</div>
            <div class="flex items-center text-red-400 font-bold text-lg justify-center">
                <span class="h-3 w-3 rounded-full bg-red-500 mr-3 animate-pulse"></span>
                OFFLINE - ARRÊT D'URGENCE ACTIF
            </div>
        </div>
        
        <div class="mt-12 text-sm text-gray-600">
            &copy; <?php echo date('Y'); ?> SULOC. Tous droits réservés.
        </div>
    </div>
</body>
</html>
