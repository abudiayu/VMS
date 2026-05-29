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
$stmt = $pdo->prepare('SELECT id FROM divorce_records WHERE id = ?');
$stmt->execute([$id]);
if (!$stmt->fetch()) sendError('Record not found.', 404);
$body = getRequestBody();
$pdo->prepare('
    UPDATE divorce_records SET
        husband_name=?,husband_id_no=?,
        wife_name=?,wife_id_no=?,
        divorce_date=?,court_order_no=?,court_name=?,reason=?,
        kebele=?,woreda=?,notes=?,updated_at=NOW()
    WHERE id=?
')->execute([
    trim($body['husband_name'] ?? ''),   trim($body['husband_id_no'] ?? ''),
    trim($body['wife_name'] ?? ''),      trim($body['wife_id_no'] ?? ''),
    $body['divorce_date'] ?? '',         trim($body['court_order_no'] ?? ''),
    trim($body['court_name'] ?? ''),     $body['reason'] ?? '',
    trim($body['kebele'] ?? ''),         trim($body['woreda'] ?? ''),
    trim($body['notes'] ?? ''),          $id,
]);
$stmt = $pdo->prepare('SELECT * FROM divorce_records WHERE id = ?');
$stmt->execute([$id]);
sendSuccess(['record' => $stmt->fetch()], 'Divorce record updated successfully.');
