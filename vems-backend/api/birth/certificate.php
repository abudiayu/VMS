<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') sendError('Method not allowed.', 405);
requireAuth();
$id = intval($_GET['id'] ?? 0);
if (!$id) sendError('Record ID is required.');
$pdo  = getConnection();
$stmt = $pdo->prepare('SELECT * FROM birth_records WHERE id = ?');
$stmt->execute([$id]);
$record = $stmt->fetch();
if (!$record) sendError('Record not found.', 404);
sendSuccess([
    'record'          => $record,
    'certificate_url' => 'https://vems-backend.onrender.com/certificates/birth_' . $record['registration_no'] . '.pdf',
], 'Certificate generated.');
