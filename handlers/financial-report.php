<?php
/**
 * SULOC Financial Reporting Handler (v2.0)
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();

$action = $_GET['action'] ?? 'summary';
$startDate = $_GET['start_date'] ?? date('Y-m-01'); // Default to start of month
$endDate = $_GET['end_date'] ?? date('Y-m-t');     // Default to end of month
$year = $_GET['year'] ?? '';

// Build Query
$queryParts = ["payout_status = 'Paid'"];
$params = [];

if (!empty($year)) {
    $queryParts[] = "YEAR(created_at) = ?";
    $params[] = $year;
} else {
    $queryParts[] = "DATE(created_at) BETWEEN ? AND ?";
    $params[] = $startDate;
    $params[] = $endDate;
}

$whereClause = implode(" AND ", $queryParts);

// 1. SUMMARY ACTION (JSON)
if ($action === 'summary') {
    header('Content-Type: application/json');
    try {
        $stmt = $pdo->prepare("SELECT 
            currency, 
            SUM(amount) as total_transferred, 
            SUM(transfer_fee_amount) as total_fees,
            COUNT(*) as transaction_count
            FROM payment_requests 
            WHERE $whereClause 
            GROUP BY currency");
        $stmt->execute($params);
        $results = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'period' => (!empty($year)) ? "Année $year" : "Du $startDate au $endDate",
            'data' => $results
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// 2. EXPORT ACTION (CSV/EXCEL)
if ($action === 'export') {
    $filename = "SULOC_Report_" . ($year ?: $startDate . "_" . $endDate) . ".csv";
    
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=' . $filename);
    
    $output = fopen('php://output', 'w');
    
    // Header Row
    fputcsv($output, ['ID Transfert', 'Code Secret', 'Date', 'Expéditeur', 'Bénéficiaire', 'Montant', 'Devise', 'Frais (%)', 'Frais (Montant)', 'Total Payé', 'Méthode', 'Opérateur']);
    
    try {
        $stmt = $pdo->prepare("SELECT 
            r.id, r.verification_code, r.created_at, r.sender_name, r.receiver_name, 
            r.amount, r.currency, r.transfer_fee_percentage, r.transfer_fee_amount, 
            r.total_to_pay, r.payment_method, s.operator_name 
            FROM payment_requests r 
            LEFT JOIN payment_services s ON r.payment_service_id = s.id 
            WHERE $whereClause 
            ORDER BY r.created_at ASC");
        $stmt->execute($params);
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, [
                $row['id'],
                $row['verification_code'],
                date('d/m/Y H:i', strtotime($row['created_at'])),
                $row['sender_name'],
                $row['receiver_name'],
                $row['amount'],
                $row['currency'],
                $row['transfer_fee_percentage'] . '%',
                $row['transfer_fee_amount'],
                $row['total_to_pay'],
                strtoupper($row['payment_method']),
                $row['operator_name']
            ]);
        }
    } catch (Exception $e) {
        // Log error to file or handle it
    }
    
    fclose($output);
    exit;
}
