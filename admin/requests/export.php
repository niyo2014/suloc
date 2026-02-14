<?php
/**
 * SULOC Admin - Export Requests to CSV/Excel
 * Exports filtered requests to downloadable file
 */

require_once __DIR__ . '/../../config/config.php';
requireLogin();

$pdo = getDBConnection();

// Get filter parameters
$type = $_GET['type'] ?? 'all';
$status = $_GET['status'] ?? 'all';
$format = $_GET['format'] ?? 'csv'; // csv or excel

// Build queries for each request type
$requests = [];

// Vehicle Requests
if ($type === 'all' || $type === 'vehicle') {
    $where = ["1=1"];
    $params = [];
    
    if ($status !== 'all') {
        $where[] = "status = ?";
        $params[] = $status;
    }
    
    $whereClause = implode(' AND ', $where);
    $stmt = $pdo->prepare("
        SELECT 'Véhicule' as type, vr.id, vr.client_name, vr.client_email, vr.client_phone, 
               vr.client_whatsapp, vr.message, vr.status, vr.created_at, vr.admin_notes,
               CONCAT(v.brand, ' ', v.model, ' ', v.year) as subject
        FROM vehicle_requests vr
        LEFT JOIN vehicles v ON vr.vehicle_id = v.id
        WHERE $whereClause
    ");
    $stmt->execute($params);
    $requests = array_merge($requests, $stmt->fetchAll());
}

// Visa Requests
if ($type === 'all' || $type === 'visa') {
    $where = ["1=1"];
    $params = [];
    
    if ($status !== 'all') {
        $where[] = "status = ?";
        $params[] = $status;
    }
    
    $whereClause = implode(' AND ', $where);
    $stmt = $pdo->prepare("
        SELECT 'Visa' as type, vr.id, vr.client_name, vr.client_email, vr.client_phone,
               vr.client_whatsapp, vr.additional_info as message, vr.status, vr.created_at, vr.admin_notes,
               CONCAT('Visa pour ', vr.destination_country, ' - ', vr.visa_type) as subject
        FROM visa_requests vr
        WHERE $whereClause
    ");
    $stmt->execute($params);
    $requests = array_merge($requests, $stmt->fetchAll());
}

// Import Requests
if ($type === 'all' || $type === 'import') {
    $where = ["1=1"];
    $params = [];
    
    if ($status !== 'all') {
        $where[] = "status = ?";
        $params[] = $status;
    }
    
    $whereClause = implode(' AND ', $where);
    $stmt = $pdo->prepare("
        SELECT 'Import/Logistique' as type, ir.id, ir.client_name, ir.client_email, ir.client_phone,
               ir.client_whatsapp, ir.cargo_description as message, ir.status, ir.created_at, ir.admin_notes,
               ir.origin_country, ir.destination_country, ir.transit_port, ir.incoterm, ir.container_size, ir.estimated_weight,
               CONCAT('Import: ', ir.origin_country, ' → ', ir.destination_country, ' (', ir.cargo_type, ')') as subject
        FROM import_requests ir
        WHERE $whereClause
    ");
    $stmt->execute($params);
    $requests = array_merge($requests, $stmt->fetchAll());
}

// Payment Requests
if ($type === 'all' || $type === 'payment') {
    $where = ["1=1"];
    $params = [];
    
    if ($status !== 'all') {
        $where[] = "status = ?";
        $params[] = $status;
    }
    
    $whereClause = implode(' AND ', $where);
    $stmt = $pdo->prepare("
        SELECT 'Paiement' as type, pr.id, pr.client_name, NULL as client_email, pr.client_phone,
               pr.client_whatsapp, '' as message, pr.status, pr.created_at, pr.admin_notes,
               CONCAT(pr.operator, ' - ', pr.amount, ' ', pr.currency, ' (', pr.transaction_type, ')') as subject
        FROM payment_requests pr
        WHERE $whereClause
    ");
    $stmt->execute($params);
    $requests = array_merge($requests, $stmt->fetchAll());
}

// Sort by created_at DESC
usort($requests, function($a, $b) {
    return strtotime($b['created_at']) - strtotime($a['created_at']);
});

// Status labels in French
$statusLabels = [
    'new' => 'Nouvelle',
    'in_progress' => 'En Cours',
    'completed' => 'Complétée',
    'cancelled' => 'Annulée',
];

if ($format === 'csv') {
    // CSV Export
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="demandes_suloc_' . date('Y-m-d_His') . '.csv"');
    
    // Output UTF-8 BOM for Excel compatibility
    echo "\xEF\xBB\xBF";
    
    $output = fopen('php://output', 'w');
    
    // Headers
    fputcsv($output, [
        'ID',
        'Type',
        'Date',
        'Statut',
        'Client',
        'Email',
        'Téléphone',
        'WhatsApp',
        'Sujet',
        'Message',
        'Port/Route',
        'Incoterm/Détails',
        'Notes Admin'
    ]);
    
    // Data rows
    foreach ($requests as $request) {
        $logisticsInfo = '';
        $extraDetails = '';
        if ($request['type'] === 'Import/Logistique') {
            $logisticsInfo = ($request['transit_port'] ?? 'N/A') . ' (' . ($request['origin_country'] ?? '') . ' -> ' . ($request['destination_country'] ?? '') . ')';
            $extraDetails = ($request['incoterm'] ?? 'N/A') . ' | ' . ($request['container_size'] ?? 'N/A') . ' | ' . ($request['estimated_weight'] ?? '0') . 'kg';
        }

        fputcsv($output, [
            $request['id'],
            $request['type'],
            date('d/m/Y H:i', strtotime($request['created_at'])),
            $statusLabels[$request['status']] ?? $request['status'],
            $request['client_name'],
            $request['client_email'] ?? '',
            $request['client_phone'],
            $request['client_whatsapp'] ?? '',
            $request['subject'],
            $request['message'] ?? '',
            $logisticsInfo,
            $extraDetails,
            $request['admin_notes'] ?? ''
        ]);
    }
    
    fclose($output);
    exit;
    
} else {
    // Excel Export using simple HTML table (opens in Excel)
    header('Content-Type: application/vnd.ms-excel; charset=utf-8');
    header('Content-Disposition: attachment; filename="demandes_suloc_' . date('Y-m-d_His') . '.xls"');
    
    echo "\xEF\xBB\xBF"; // UTF-8 BOM
    
    echo '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    echo '<head>';
    echo '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
    echo '<style>';
    echo 'table { border-collapse: collapse; width: 100%; }';
    echo 'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }';
    echo 'th { background-color: #0a2342; color: white; font-weight: bold; }';
    echo 'tr:nth-child(even) { background-color: #f2f2f2; }';
    echo '.status-new { background-color: #fed7aa; }';
    echo '.status-progress { background-color: #fef3c7; }';
    echo '.status-completed { background-color: #d1fae5; }';
    echo '.status-cancelled { background-color: #fecaca; }';
    echo '</style>';
    echo '</head>';
    echo '<body>';
    
    echo '<h1>Demandes SULOC - Export du ' . date('d/m/Y à H:i') . '</h1>';
    echo '<p><strong>Filtres appliqués:</strong> Type: ' . ($type === 'all' ? 'Tous' : ucfirst($type)) . ', Statut: ' . ($status === 'all' ? 'Tous' : $statusLabels[$status] ?? $status) . '</p>';
    echo '<p><strong>Total:</strong> ' . count($requests) . ' demande(s)</p>';
    
    echo '<table>';
    echo '<thead>';
    echo '<tr>';
    echo '<th>ID</th>';
    echo '<th>Type</th>';
    echo '<th>Date</th>';
    echo '<th>Statut</th>';
    echo '<th>Client</th>';
    echo '<th>Email</th>';
    echo '<th>Téléphone</th>';
    echo '<th>WhatsApp</th>';
    echo '<th>Sujet</th>';
    echo '<th>Message</th>';
    echo '<th>Port/Route</th>';
    echo '<th>Incoterm/Détails</th>';
    echo '<th>Notes Admin</th>';
    echo '</tr>';
    echo '</thead>';
    echo '<tbody>';
    
    foreach ($requests as $request) {
        $statusClass = 'status-' . str_replace('_', '-', $request['status']);
        $logisticsInfo = '';
        $extraDetails = '';
        if ($request['type'] === 'Import/Logistique') {
            $logisticsInfo = ($request['transit_port'] ?? 'N/A') . ' (' . ($request['origin_country'] ?? '') . ' -> ' . ($request['destination_country'] ?? '') . ')';
            $extraDetails = ($request['incoterm'] ?? 'N/A') . ' | ' . ($request['container_size'] ?? 'N/A') . ' | ' . ($request['estimated_weight'] ?? '0') . 'kg';
        }

        echo '<tr>';
        echo '<td>' . htmlspecialchars($request['id']) . '</td>';
        echo '<td>' . htmlspecialchars($request['type']) . '</td>';
        echo '<td>' . date('d/m/Y H:i', strtotime($request['created_at'])) . '</td>';
        echo '<td class="' . $statusClass . '">' . htmlspecialchars($statusLabels[$request['status']] ?? $request['status']) . '</td>';
        echo '<td>' . htmlspecialchars($request['client_name']) . '</td>';
        echo '<td>' . htmlspecialchars($request['client_email'] ?? '') . '</td>';
        echo '<td>' . htmlspecialchars($request['client_phone']) . '</td>';
        echo '<td>' . htmlspecialchars($request['client_whatsapp'] ?? '') . '</td>';
        echo '<td>' . htmlspecialchars($request['subject']) . '</td>';
        echo '<td>' . htmlspecialchars($request['message'] ?? '') . '</td>';
        echo '<td>' . htmlspecialchars($logisticsInfo) . '</td>';
        echo '<td>' . htmlspecialchars($extraDetails) . '</td>';
        echo '<td>' . htmlspecialchars($request['admin_notes'] ?? '') . '</td>';
        echo '</tr>';
    }
    
    echo '</tbody>';
    echo '</table>';
    echo '</body>';
    echo '</html>';
    exit;
}
