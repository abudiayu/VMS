<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';
require_once __DIR__ . '/../../helpers/registration_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed.', 405);
$authUser = requireRole(['admin','employee']);
$body     = getRequestBody();
foreach (['husband_name','wife_name','divorce_date','court_order_no','kebele'] as $f) {
    if (empty(trim($body[$f] ?? ''))) sendError("Field '$f' is required.");
}
$pdo   = getConnection();
$regNo = generateRegistrationNumber('divorce');
$pdo->prepare('
    INSERT INTO divorce_records
        (registration_no,husband_name,husband_id_no,
         wife_name,wife_id_no,
         divorce_date,court_order_no,court_name,reason,
         kebele,woreda,notes,registered_by,status,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,"registered",NOW())
')->execute([
    $regNo,
    trim($body['husband_name']),   trim($body['husband_id_no'] ?? ''),
    trim($body['wife_name']),      trim($body['wife_id_no'] ?? ''),
    $body['divorce_date'],         trim($body['court_order_no']),
    trim($body['court_name'] ?? ''), $body['reason'] ?? '',
    trim($body['kebele']),         trim($body['woreda'] ?? ''),
    trim($body['notes'] ?? ''),    $authUser['id'],
]);
$id   = $pdo->lastInsertId();
$stmt = $pdo->prepare('SELECT * FROM divorce_records WHERE id = ?');
$stmt->execute([$id]);
sendSuccess(['record' => $stmt->fetch()], 'Divorce record registered successfully.', 201);
