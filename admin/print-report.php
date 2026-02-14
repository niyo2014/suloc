<?php
/**
 * SULOC Financial - PDF/Print Report Generator
 */
require_once __DIR__ . '/../config/config.php';
requireLogin();

$pdo = getDBConnection();

$startDate = $_GET['start_date'] ?? date('Y-m-01');
$endDate = $_GET['end_date'] ?? date('Y-m-t');
$year = $_GET['year'] ?? '';

// Build Query
$queryParts = ["payout_status = 'Paid'"];
$params = [];

if (!empty($year)) {
    $queryParts[] = "YEAR(created_at) = ?";
    $params[] = $year;
    $periodLabel = "Année $year";
} else {
    $queryParts[] = "DATE(created_at) BETWEEN ? AND ?";
    $params[] = $startDate;
    $params[] = $endDate;
    $periodLabel = "Période du " . date('d/m/Y', strtotime($startDate)) . " au " . date('d/m/Y', strtotime($endDate));
}

$whereClause = implode(" AND ", $queryParts);

try {
    // Fetch Data
    $stmt = $pdo->prepare("SELECT 
        DATE(created_at) as report_date, 
        SUM(amount) as day_total, 
        SUM(transfer_fee_amount) as day_fees, 
        currency,
        COUNT(*) as trans_count
        FROM payment_requests 
        WHERE $whereClause 
        GROUP BY report_date, currency 
        ORDER BY report_date ASC");
    $stmt->execute($params);
    $data = $stmt->fetchAll();

    // Calculate Grand Totals by Currency
    $totals = [];
    foreach ($data as $row) {
        $curr = $row['currency'];
        if (!isset($totals[$curr])) {
            $totals[$curr] = ['amount' => 0, 'fees' => 0];
        }
        $totals[$curr]['amount'] += $row['day_total'];
        $totals[$curr]['fees'] += $row['day_fees'];
    }
} catch (Exception $e) { $error = $e->getMessage(); }
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport SULOC - <?php echo $periodLabel; ?></title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 40px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid #0a2342; padding-bottom: 20px; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: 900; color: #0a2342; }
        .logo span { color: #d4af37; }
        .report-title { text-align: right; }
        .report-title h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
        .report-title p { margin: 5px 0 0; color: #64748b; font-weight: bold; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f8fafc; text-align: left; padding: 15px; border-bottom: 2px solid #e2e8f0; font-size: 12px; text-transform: uppercase; color: #64748b; }
        td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        
        .row-total { background: #0a2342; color: white; font-weight: 900; }
        .row-total td { border: none; font-size: 16px; }
        .text-gold { color: #d4af37; }
        
        .summary-grid { display: grid; grid-template-cols: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 50px; }
        .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; rounded: 15px; }
        .stat-card h4 { margin: 0 0 10px; font-size: 10px; text-transform: uppercase; color: #64748b; }
        .stat-card .val { font-size: 20px; font-weight: 900; color: #0a2342; }
        
        .footer { margin-top: 100px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        
        @media print {
            .no-print { display: none; }
            body { padding: 0; }
        }
    </style>
</head>
<body>

    <div class="no-print" style="margin-bottom: 20px; text-align: center;">
        <button onclick="window.print()" style="background: #0a2342; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-weight: bold; cursor: pointer;">
            🖨️ IMPRIMER / ENREGISTRER PDF
        </button>
    </div>

    <div class="header">
        <div class="logo">SULOC<span>.</span></div>
        <div class="report-title">
            <h1>Rapport de Remittance</h1>
            <p><?php echo $periodLabel; ?></p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Nombre</th>
                <th>Transferts Payés</th>
                <th>Frais Récoltés</th>
                <th>Devise</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data as $row): ?>
            <tr>
                <td><?php echo date('d/m/Y', strtotime($row['report_date'])); ?></td>
                <td><?php echo $row['trans_count']; ?> txn(s)</td>
                <td><?php echo number_format($row['day_total'], 2); ?></td>
                <td><?php echo number_format($row['day_fees'], 2); ?></td>
                <td style="font-weight: bold;"><?php echo $row['currency']; ?></td>
            </tr>
            <?php endforeach; ?>
            
            <?php foreach ($totals as $curr => $val): ?>
            <tr class="row-total">
                <td colspan="2" style="text-align: right;">TOTAL <?php echo $curr; ?></td>
                <td><?php echo number_format($val['amount'], 2); ?></td>
                <td class="text-gold"><?php echo number_format($val['fees'], 2); ?></td>
                <td><?php echo $curr; ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <div class="summary-grid">
        <?php foreach ($totals as $curr => $val): ?>
        <div class="stat-card">
            <h4>Bénéfice Récolté (<?php echo $curr; ?>)</h4>
            <div class="val text-gold"><?php echo number_format($val['fees'], 2); ?> <?php echo $curr; ?></div>
        </div>
        <div class="stat-card">
            <h4>Volume Transigé (<?php echo $curr; ?>)</h4>
            <div class="val"><?php echo number_format($val['amount'] + $val['fees'], 2); ?> <?php echo $curr; ?></div>
        </div>
        <?php endforeach; ?>
    </div>

    <div class="footer">
        Document généré le <?php echo date('d/m/Y H:i'); ?> par SULOC Administrative Intelligence.
        <br>Ce document est une pièce comptable officielle.
    </div>

</body>
</html>
