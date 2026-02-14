<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../lib/src/Exception.php';
require_once __DIR__ . '/../lib/src/PHPMailer.php';
require_once __DIR__ . '/../lib/src/SMTP.php';
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();
$submission = null;
$message = '';
$messageType = '';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $pdo->prepare("SELECT * FROM contact_submissions WHERE id = ?");
    $stmt->execute([$id]);
    $submission = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['send_reply'])) {
    $id = intval($_POST['id']);
    $recipient = filter_var($_POST['recipient'], FILTER_SANITIZE_EMAIL);
    $subject = sanitizeInput($_POST['subject']);
    $replyMessage = sanitizeInput($_POST['message']);

    // Basic validation
    if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        $message = 'Invalid email format.';
        $messageType = 'error';
    } elseif (empty($subject) || empty($replyMessage)) {
        $message = 'Subject and message are required.';
        $messageType = 'error';
    } else {
        $mail = new PHPMailer(true);
        try {
            //Server settings
            $mail->isSMTP();
            $mail->Host       = SMTP_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = SMTP_USER;
            $mail->Password   = SMTP_PASS;
            $mail->SMTPSecure = SMTP_SECURE;
            $mail->Port       = SMTP_PORT;

            //Recipients
            $mail->setFrom(SMTP_USER, SITE_NAME);
            $mail->addAddress($recipient);
            $mail->addReplyTo(SMTP_USER, SITE_NAME);

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = nl2br($replyMessage);
            $mail->AltBody = $replyMessage;

            $mail->send();

            $stmt = $pdo->prepare("UPDATE contact_submissions SET status = 'replied' WHERE id = ?");
            $stmt->execute([$id]);
            
            // Redirect to submissions page
            header("Location: submissions.php?filter=replied");
            exit;
        } catch (Exception $e) {
            $message = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            $messageType = 'error';
        }
    }
}

if (!$submission) {
    header("Location: submissions.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Répondre au Message - SULOC Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-100">
    <?php include __DIR__ . '/includes/admin-header.php'; ?>

    <div class="container mx-auto px-6 py-8">
        <h1 class="text-3xl font-bold text-blue-900 mb-8">Répondre au Message</h1>

        <?php if ($message): ?>
        <div class="mb-4 p-4 rounded-lg <?php echo $messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'; ?>">
            <?php echo $message; ?>
        </div>
        <?php endif; ?>

        <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="mb-6 border-b pb-4">
                <h3 class="text-xl font-semibold text-gray-800">Message Original</h3>
                <p class="text-sm text-gray-500">De: <?php echo htmlspecialchars($submission['name']); ?> (<?php echo htmlspecialchars($submission['email']); ?>)</p>
                <p class="text-sm text-gray-500">Reçu le: <?php echo formatDate($submission['created_at']); ?></p>
                <p class="mt-4 text-gray-700"><?php echo nl2br(htmlspecialchars($submission['message'])); ?></p>
            </div>

            <form method="POST">
                <input type="hidden" name="id" value="<?php echo $submission['id']; ?>">
                <div class="mb-4">
                    <label for="recipient" class="block text-gray-700 font-bold mb-2">À:</label>
                    <input type="email" id="recipient" name="recipient" value="<?php echo htmlspecialchars($submission['email']); ?>"
                           class="w-full px-3 py-2 border rounded-lg bg-gray-100" readonly>
                </div>
                <div class="mb-4">
                    <label for="subject" class="block text-gray-700 font-bold mb-2">Sujet:</label>
                    <input type="text" id="subject" name="subject" 
                           value="Re: <?php echo htmlspecialchars($submission['service_type'] ?? 'Contact'); ?>"
                           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="mb-6">
                    <label for="message" class="block text-gray-700 font-bold mb-2">Message:</label>
                    <textarea id="message" name="message" rows="10"
                              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <div class="flex justify-end">
                    <a href="submissions.php" class="px-6 py-2 mr-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800">
                        Annuler
                    </a>
                    <button type="submit" name="send_reply"
                            class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold">
                        <i class="fas fa-paper-plane mr-2"></i>Envoyer
                    </button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
