<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') sendError('Method not allowed.', 405);
requireRole(['admin','employee']);
$id = intval($_GET['id'] ?? 0);
if (!$id) sendError('Record ID is required.');
$pdo  = getConnection();
$stmt = $pdo->prepare('SELECT id FROM birth_records WHERE id = ?');
$stmt->execute([$id]);
if (!$stmt->fetch()) sendError('Record not found.', 404);
$body = getRequestBody();
$pdo->prepare('
    UPDATE birth_records SET
        child_name=?,date_of_birth=?,place_of_birth=?,gender=?,
        father_name=?,father_id_no=?,mother_name=?,mother_id_no=?,
        kebele=?,woreda=?,notes=?,updated_at=NOW()
    WHERE id=?
')->execute([
    trim($body['child_name'] ?? ''), $body['date_of_birth'] ?? '',
    trim($body['place_of_birth'] ?? ''), $body['gender'] ?? '',
    trim($body['father_name'] ?? ''), trim($body['father_id_no'] ?? ''),
    trim($body['mother_name'] ?? ''), trim($body['mother_id_no'] ?? ''),
    trim($body['kebele'] ?? ''), trim($body['woreda'] ?? ''),
    trim($body['notes'] ?? ''), $id,
]);
$stmt = $pdo->prepare('SELECT * FROM birth_records WHERE id = ?');
$stmt->execute([$id]);
sendSuccess(['record' => $stmt->fetch()], 'Birth record updated successfully.');
