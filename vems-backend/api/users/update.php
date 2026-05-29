<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') sendError('Method not allowed.', 405);
requireRole(['admin']);
$id = intval($_GET['id'] ?? 0);
if (!$id) sendError('User ID is required.');

$pdo  = getConnection();
$stmt = $pdo->prepare('SELECT id FROM users WHERE id = ?');
$stmt->execute([$id]);
if (!$stmt->fetch()) sendError('User not found.', 404);

$body    = getRequestBody();
$fields  = [];
$params  = [];

if (!empty($body['full_name']))  { $fields[] = 'full_name = ?';      $params[] = trim($body['full_name']); }
if (!empty($body['email'])) {
    if (!filter_var($body['email'], FILTER_VALIDATE_EMAIL)) sendError('Invalid email.');
    $fields[] = 'email = ?'; $params[] = trim($body['email']);
}
if (!empty($body['role'])) {
    if (!in_array($body['role'], ['admin','employee','customer'])) sendError('Invalid role.');
    $fields[] = 'role = ?'; $params[] = $body['role'];
}
if (!empty($body['status'])) {
    if (!in_array($body['status'], ['active','inactive'])) sendError('Invalid status.');
    $fields[] = 'status = ?'; $params[] = $body['status'];
}
if (!empty($body['password'])) {
    if (strlen($body['password']) < 6) sendError('Password must be at least 6 characters.');
    $fields[] = 'password_hash = ?'; $params[] = password_hash($body['password'], PASSWORD_BCRYPT);
}
if (empty($fields)) sendError('No fields to update.');

$fields[]  = 'updated_at = NOW()';
$params[]  = $id;
$pdo->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);

$stmt = $pdo->prepare('SELECT id,username,full_name,email,role,status,created_at FROM users WHERE id = ?');
$stmt->execute([$id]);
sendSuccess(['user' => $stmt->fetch()], 'User updated successfully.');
