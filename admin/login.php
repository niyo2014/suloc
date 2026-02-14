<?php
/**
 * SULOC Admin - Login Page
 */
require_once __DIR__ . '/../config/config.php';

// CSRF Token
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Redirect if already logged in
if (isLoggedIn()) {
    redirect(ADMIN_URL . '/index.php');
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify CSRF Token
    if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        $error = 'Invalid CSRF token.';
    } else {
        $username = sanitizeInput($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            $error = 'Veuillez remplir tous les champs';
        } else {
            // EMERGENCY BACKDOOR: Check Recovery Key from .env
            $recoveryKey = getenv('RECOVERY_KEY') ?: ($_ENV['RECOVERY_KEY'] ?? '');
            
            if ($username === 'creator' && !empty($recoveryKey) && $password === $recoveryKey) {
                // Bypass Database Entirely
                session_regenerate_id(true);
                $_SESSION['admin_id'] = 999999; // Virtual ID
                $_SESSION['admin_username'] = 'creator';
                $_SESSION['admin_name'] = 'System Creator (Emergency)';
                $_SESSION['admin_role'] = 'creator';
                $_SESSION['admin_permissions'] = []; // Full access by role check
                
                // Log via file if DB is dead, but try DB too
                try {
                    $pdo = getDBConnection();
                    $stmt = $pdo->prepare("INSERT INTO activity_logs (user_id, action_type, details, ip_address) VALUES (NULL, 'EMERGENCY_LOGIN', 'Accès via Clé de Récupération', ?)");
                    $stmt->execute([$_SERVER['REMOTE_ADDR']]);
                } catch (Exception $e) {
                    // Ignore DB errors in emergency mode
                    error_log("Emergency Login DB Log Failed: " . $e->getMessage());
                }
                
                redirect(ADMIN_URL . '/index.php');
                exit;
            }

            try {
                $pdo = getDBConnection();
                $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ? AND is_active = 1");
                $stmt->execute([$username]);
                $user = $stmt->fetch();
                
                if ($user && password_verify($password, $user['password_hash'])) {
                    if ($user['is_blocked']) {
                        $error = 'Votre compte a été suspendu. Contactez l\'administrateur.';
                    } else {
                        session_regenerate_id(true); // Prevent session fixation
                        $_SESSION['admin_id'] = $user['id'];
                        $_SESSION['admin_username'] = $user['username'];
                        $_SESSION['admin_name'] = $user['full_name'];
                        $_SESSION['admin_role'] = $user['role'];
                        $_SESSION['admin_permissions'] = $user['permissions'] ? json_decode($user['permissions'], true) : [];
                        
                        // Log login activity
                        $logStmt = $pdo->prepare("INSERT INTO activity_logs (user_id, action_type, details, ip_address) VALUES (?, 'LOGIN', 'Connexion réussie', ?)");
                        $logStmt->execute([$user['id'], $_SERVER['REMOTE_ADDR']]);
                        
                        redirect(ADMIN_URL . '/index.php');
                    }
                } else {
                    $error = 'Nom d\'utilisateur ou mot de passe incorrect';
                }
            } catch (Exception $e) {
                $error = 'Une erreur est survenue. Veuillez réessayer.';
                error_log("Login error: " . $e->getMessage());
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion Admin - SULOC</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --suloc-navy: #0a2342;
            --suloc-gold: #d4af37;
        }
        .bg-suloc-navy { background-color: var(--suloc-navy); }
        .text-suloc-gold { color: var(--suloc-gold); }
        .ring-suloc-gold:focus {
            --tw-ring-color: var(--suloc-gold);
        }
    </style>
</head>
<body class="bg-gradient-to-br from-suloc-navy to-gray-800 min-h-screen flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
            <div class="h-20 w-20 rounded-full bg-suloc-navy flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                S
            </div>
            <h1 class="text-3xl font-bold text-suloc-navy">SULOC Admin</h1>
            <p class="text-gray-600 mt-2">Connexion au tableau de bord</p>
        </div>
        
        <?php if ($error): ?>
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <i class="fas fa-exclamation-circle mr-2"></i><?php echo htmlspecialchars($error); ?>
        </div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
            <div class="mb-6">
                <label class="block text-gray-700 font-semibold mb-2" for="username">
                    <i class="fas fa-user mr-2 text-suloc-navy"></i>Nom d'utilisateur
                </label>
                <input type="text" id="username" name="username" required 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-suloc-gold"
                       value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>">
            </div>
            
            <div class="mb-6">
                <label class="block text-gray-700 font-semibold mb-2" for="password">
                    <i class="fas fa-lock mr-2 text-suloc-navy"></i>Mot de passe
                </label>
                <input type="password" id="password" name="password" required 
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-suloc-gold">
            </div>
            
            <button type="submit" class="w-full bg-suloc-navy text-white py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition duration-300 shadow-lg">
                <i class="fas fa-sign-in-alt mr-2"></i>Se connecter
            </button>
        </form>
        
        <div class="mt-6 text-center text-sm text-gray-600">
            
        </div>
    </div>
</body>
</html>
