<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed.', 405);
}

$body     = getRequestBody();
$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

if (empty($username) || empty($password)) {
    sendError('Username and password are required.');
}

$pdo  = getConnection();
$stmt = $pdo->prepare('SELECT * FROM users WHERE username = ? AND status = "active" LIMIT 1');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    sendError('Invalid username or password.', 401);
}

$token     = generateToken($user['id']);
$expiresAt = date('Y-m-d H:i:s', strtotime('+8 hours'));

$pdo->prepare('DELETE FROM sessions WHERE user_id = ?')->execute([$user['id']]);
$pdo->prepare('INSERT INTO sessions (user_id, token, expires_at, created_at) VALUES (?, ?, ?, NOW())')
    ->execute([$user['id'], $token, $expiresAt]);

unset($user['password_hash']);

sendSuccess([
    'token' => $token,
    'user'  => $user,
], 'Login successful.');
