<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') sendError('Method not allowed.', 405);
requireAuth();
$pdo = getConnection();

$type     = $_GET['event_type'] ?? 'all';
$dateFrom = $_GET['date_from']  ?? '';
$dateTo   = $_GET['date_to']    ?? '';
$kebele   = $_GET['kebele']     ?? '';
$woreda   = $_GET['woreda']     ?? '';

function buildConditions($dateField, $dateFrom, $dateTo, $kebele, $woreda) {
    $where = []; $params = [];
    if ($dateFrom) { $where[] = "$dateField >= ?"; $params[] = $dateFrom; }
    if ($dateTo)   { $where[] = "$dateField <= ?"; $params[] = $dateTo; }
    if ($kebele)   { $where[] = 'kebele LIKE ?';   $params[] = "%$kebele%"; }
    if ($woreda)   { $where[] = 'woreda LIKE ?';   $params[] = "%$woreda%"; }
    return [$where, $params];
}

$records = [];

if ($type === 'birth' || $type === 'all') {
    [$w, $p] = buildConditions('date_of_birth', $dateFrom, $dateTo, $kebele, $woreda);
    $sql = "SELECT registration_no,'Birth' AS event_type,child_name AS name,date_of_birth AS date,kebele,woreda,status FROM birth_records";
    if ($w) $sql .= ' WHERE ' . implode(' AND ', $w);
    $stmt = $pdo->prepare($sql); $stmt->execute($p);
    $records = array_merge($records, $stmt->fetchAll());
}

if ($type === 'death' || $type === 'all') {
    [$w, $p] = buildConditions('date_of_death', $dateFrom, $dateTo, $kebele, $woreda);
    $sql = "SELECT registration_no,'Death' AS event_type,deceased_name AS name,date_of_death AS date,kebele,woreda,status FROM death_records";
    if ($w) $sql .= ' WHERE ' . implode(' AND ', $w);
    $stmt = $pdo->prepare($sql); $stmt->execute($p);
    $records = array_merge($records, $stmt->fetchAll());
}

if ($type === 'marriage' || $type === 'all') {
    [$w, $p] = buildConditions('marriage_date', $dateFrom, $dateTo, $kebele, $woreda);
    $sql = "SELECT registration_no,'Marriage' AS event_type,CONCAT(husband_name,' & ',wife_name) AS name,marriage_date AS date,kebele,woreda,status FROM marriage_records";
    if ($w) $sql .= ' WHERE ' . implode(' AND ', $w);
    $stmt = $pdo->prepare($sql); $stmt->execute($p);
    $records = array_merge($records, $stmt->fetchAll());
}

if ($type === 'divorce' || $type === 'all') {
    [$w, $p] = buildConditions('divorce_date', $dateFrom, $dateTo, $kebele, $woreda);
    $sql = "SELECT registration_no,'Divorce' AS event_type,CONCAT(husband_name,' & ',wife_name) AS name,divorce_date AS date,kebele,woreda,status FROM divorce_records";
    if ($w) $sql .= ' WHERE ' . implode(' AND ', $w);
    $stmt = $pdo->prepare($sql); $stmt->execute($p);
    $records = array_merge($records, $stmt->fetchAll());
}

usort($records, fn($a, $b) => strcmp($b['date'], $a['date']));

$counts = ['births' => 0, 'deaths' => 0, 'marriages' => 0, 'divorces' => 0];
foreach ($records as $r) {
    $t = strtolower($r['event_type']);
    if ($t === 'birth')    $counts['births']++;
    if ($t === 'death')    $counts['deaths']++;
    if ($t === 'marriage') $counts['marriages']++;
    if ($t === 'divorce')  $counts['divorces']++;
}

sendSuccess([
    'records'   => $records,
    'total'     => count($records),
    'births'    => $counts['births'],
    'deaths'    => $counts['deaths'],
    'marriages' => $counts['marriages'],
    'divorces'  => $counts['divorces'],
]);
