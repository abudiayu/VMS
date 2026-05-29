<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') sendError('Method not allowed.', 405);
requireRole(['admin']);
$id = intval($_GET['id'] ?? 0);
if (!$id) sendError('Record ID is required.');
$pdo  = getConnection();
$stmt = $pdo->prepare('SELECT id FROM marriage_records WHERE id = ?');
$stmt->execute([$id]);
if (!$stmt->fetch()) sendError('Record not found.', 404);
$pdo->prepare('DELETE FROM marriage_records WHERE id = ?')->execute([$id]);
sendSuccess([], 'Marriage record deleted successfully.');
