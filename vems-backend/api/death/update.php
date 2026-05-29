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
$stmt = $pdo->prepare('SELECT id FROM death_records WHERE id = ?');
$stmt->execute([$id]);
if (!$stmt->fetch()) sendError('Record not found.', 404);
$body = getRequestBody();
$pdo->prepare('
    UPDATE death_records SET
        deceased_name=?,date_of_death=?,place_of_death=?,cause_of_death=?,
        age_at_death=?,gender=?,reported_by=?,reporter_id_no=?,
        kebele=?,woreda=?,notes=?,updated_at=NOW()
    WHERE id=?
')->execute([
    trim($body['deceased_name'] ?? ''), $body['date_of_death'] ?? '',
    trim($body['place_of_death'] ?? ''), trim($body['cause_of_death'] ?? ''),
    intval($body['age_at_death'] ?? 0), $body['gender'] ?? '',
    trim($body['reported_by'] ?? ''), trim($body['reporter_id_no'] ?? ''),
    trim($body['kebele'] ?? ''), trim($body['woreda'] ?? ''),
    trim($body['notes'] ?? ''), $id,
]);
$stmt = $pdo->prepare('SELECT * FROM death_records WHERE id = ?');
$stmt->execute([$id]);
sendSuccess(['record' => $stmt->fetch()], 'Death record updated successfully.');
