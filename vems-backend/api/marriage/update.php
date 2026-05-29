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
$stmt = $pdo->prepare('SELECT id FROM marriage_records WHERE id = ?');
$stmt->execute([$id]);
if (!$stmt->fetch()) sendError('Record not found.', 404);
$body = getRequestBody();
$pdo->prepare('
    UPDATE marriage_records SET
        husband_name=?,husband_id_no=?,husband_dob=?,
        wife_name=?,wife_id_no=?,wife_dob=?,
        marriage_date=?,place_of_marriage=?,marriage_type=?,
        witness1_name=?,witness2_name=?,witness3_name=?,witness4_name=?,
        kebele=?,woreda=?,notes=?,updated_at=NOW()
    WHERE id=?
')->execute([
    trim($body['husband_name'] ?? ''),   trim($body['husband_id_no'] ?? ''),
    $body['husband_dob'] ?? null,
    trim($body['wife_name'] ?? ''),      trim($body['wife_id_no'] ?? ''),
    $body['wife_dob'] ?? null,
    $body['marriage_date'] ?? '',        trim($body['place_of_marriage'] ?? ''),
    $body['marriage_type'] ?? '',
    trim($body['witness1_name'] ?? ''),  trim($body['witness2_name'] ?? ''),
    trim($body['witness3_name'] ?? ''),  trim($body['witness4_name'] ?? ''),
    trim($body['kebele'] ?? ''),         trim($body['woreda'] ?? ''),
    trim($body['notes'] ?? ''),          $id,
]);
$stmt = $pdo->prepare('SELECT * FROM marriage_records WHERE id = ?');
$stmt->execute([$id]);
sendSuccess(['record' => $stmt->fetch()], 'Marriage record updated successfully.');
