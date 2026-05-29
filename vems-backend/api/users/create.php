<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed.', 405);
requireRole(['admin']);
$body = getRequestBody();

foreach (['username','full_name','email','role','password'] as $f) {
    if (empty(trim($body[$f] ?? ''))) sendError("Field '$f' is required.");
}
if (!filter_var($body['email'], FILTER_VALIDATE_EMAIL)) sendError('Invalid email address.');
if (strlen($body['password']) < 6) sendError('Password must be at least 6 characters.');
if (!in_array($body['role'], ['admin','employee','customer'])) sendError('Invalid role.');

$pdo  = getConnection();
$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
$stmt->execute([trim($body['username']), trim($body['email'])]);
if ($stmt->fetch()) sendError('Username or email already exists.');

$status = in_array($body['status'] ?? 'active', ['active','inactive']) ? $body['status'] : 'active';

$pdo->prepare('
    INSERT INTO users (username,full_name,email,role,password_hash,status,created_at)
    VALUES (?,?,?,?,?,?,NOW())
')->execute([
    trim($body['username']),
    trim($body['full_name']),
    trim($body['email']),
    $body['role'],
    password_hash($body['password'], PASSWORD_BCRYPT),
    $status,
]);

$id   = $pdo->lastInsertId();
$stmt = $pdo->prepare('SELECT id,username,full_name,email,role,status,created_at FROM users WHERE id = ?');
$stmt->execute([$id]);
sendSuccess(['user' => $stmt->fetch()], 'User account created successfully.', 201);
