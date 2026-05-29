<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';
require_once __DIR__ . '/../../helpers/registration_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed.', 405);
$authUser = requireRole(['admin','employee']);
$body     = getRequestBody();
foreach (['husband_name','wife_name','marriage_date','witness1_name','witness2_name','kebele'] as $f) {
    if (empty(trim($body[$f] ?? ''))) sendError("Field '$f' is required.");
}
$pdo   = getConnection();
$regNo = generateRegistrationNumber('marriage');
$pdo->prepare('
    INSERT INTO marriage_records
        (registration_no,husband_name,husband_id_no,husband_dob,
         wife_name,wife_id_no,wife_dob,
         marriage_date,place_of_marriage,marriage_type,
         witness1_name,witness2_name,witness3_name,witness4_name,
         kebele,woreda,notes,registered_by,status,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"registered",NOW())
')->execute([
    $regNo,
    trim($body['husband_name']),   trim($body['husband_id_no'] ?? ''),
    $body['husband_dob'] ?? null,
    trim($body['wife_name']),      trim($body['wife_id_no'] ?? ''),
    $body['wife_dob'] ?? null,
    $body['marriage_date'],        trim($body['place_of_marriage'] ?? ''),
    $body['marriage_type'] ?? '',
    trim($body['witness1_name']),  trim($body['witness2_name']),
    trim($body['witness3_name'] ?? ''), trim($body['witness4_name'] ?? ''),
    trim($body['kebele']),         trim($body['woreda'] ?? ''),
    trim($body['notes'] ?? ''),    $authUser['id'],
]);
$id   = $pdo->lastInsertId();
$stmt = $pdo->prepare('SELECT * FROM marriage_records WHERE id = ?');
$stmt->execute([$id]);
sendSuccess(['record' => $stmt->fetch()], 'Marriage record registered successfully.', 201);
