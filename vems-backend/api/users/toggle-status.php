<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') sendError('Method not allowed.', 405);
$authUser = requireRole(['admin']);
$id       = intval($_GET['id'] ?? 0);
if (!$id) sendError('User ID is required.');
if ($id === $authUser['id']) sendError('You cannot change your own status.');

$body   = getRequestBody();
$status = $body['status'] ?? '';
if (!in_array($status, ['active','inactive'])) sendError('Status must be active or inactive.');

$pdo  = getConnection();
$stmt = $pdo->prepare('SELECT id FROM users WHERE id = ?');
$stmt->execute([$id]);
if (!$stmt->fetch()) sendError('User not found.', 404);

$pdo->prepare('UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?')->execute([$status, $id]);
if ($status === 'inactive') {
    $pdo->prepare('DELETE FROM sessions WHERE user_id = ?')->execute([$id]);
}
sendSuccess(['status' => $status], 'User status updated successfully.');
