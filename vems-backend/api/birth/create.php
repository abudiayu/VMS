<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';
require_once __DIR__ . '/../../helpers/registration_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed.', 405);
$authUser = requireRole(['admin', 'employee']);
$body     = getRequestBody();

foreach (['child_name','date_of_birth','gender','father_name','mother_name','kebele'] as $f) {
    if (empty(trim($body[$f] ?? ''))) sendError("Field '$f' is required.");
}

$pdo  = getConnection();
$regNo = generateRegistrationNumber('birth');

$pdo->prepare('
    INSERT INTO birth_records
        (registration_no,child_name,date_of_birth,place_of_birth,gender,
         father_name,father_id_no,mother_name,mother_id_no,
         kebele,woreda,notes,registered_by,status,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,"registered",NOW())
')->execute([
    $regNo,
    trim($body['child_name']),
    $body['date_of_birth'],
    trim($body['place_of_birth'] ?? ''),
    $body['gender'],
    trim($body['father_name']),
    trim($body['father_id_no'] ?? ''),
    trim($body['mother_name']),
    trim($body['mother_id_no'] ?? ''),
    trim($body['kebele']),
    trim($body['woreda'] ?? ''),
    trim($body['notes'] ?? ''),
    $authUser['id'],
]);

$id   = $pdo->lastInsertId();
$stmt = $pdo->prepare('SELECT * FROM birth_records WHERE id = ?');
$stmt->execute([$id]);
sendSuccess(['record' => $stmt->fetch()], 'Birth record registered successfully.', 201);
