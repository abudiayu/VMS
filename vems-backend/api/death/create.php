<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';
require_once __DIR__ . '/../../helpers/registration_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed.', 405);
$authUser = requireRole(['admin','employee']);
$body     = getRequestBody();
foreach (['deceased_name','date_of_death','cause_of_death','reported_by','kebele'] as $f) {
    if (empty(trim($body[$f] ?? ''))) sendError("Field '$f' is required.");
}
$pdo   = getConnection();
$regNo = generateRegistrationNumber('death');
$pdo->prepare('
    INSERT INTO death_records
        (registration_no,deceased_name,date_of_death,place_of_death,cause_of_death,
         age_at_death,gender,reported_by,reporter_id_no,
         kebele,woreda,notes,registered_by,status,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,"registered",NOW())
')->execute([
    $regNo,
    trim($body['deceased_name']),
    $body['date_of_death'],
    trim($body['place_of_death'] ?? ''),
    trim($body['cause_of_death']),
    intval($body['age_at_death'] ?? 0),
    $body['gender'] ?? '',
    trim($body['reported_by']),
    trim($body['reporter_id_no'] ?? ''),
    trim($body['kebele']),
    trim($body['woreda'] ?? ''),
    trim($body['notes'] ?? ''),
    $authUser['id'],
]);
$id   = $pdo->lastInsertId();
$stmt = $pdo->prepare('SELECT * FROM death_records WHERE id = ?');
$stmt->execute([$id]);
sendSuccess(['record' => $stmt->fetch()], 'Death record registered successfully.', 201);
