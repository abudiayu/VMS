<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed.', 405);
}

$authUser        = requireAuth();
$body            = getRequestBody();
$currentPassword = $body['current_password'] ?? '';
$newPassword     = $body['new_password'] ?? '';

if (empty($currentPassword) || empty($newPassword)) {
    sendError('Current and new passwords are required.');
}
if (strlen($newPassword) < 6) {
    sendError('New password must be at least 6 characters.');
}

$pdo  = getConnection();
$stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
$stmt->execute([$authUser['id']]);
$row  = $stmt->fetch();

if (!$row || !password_verify($currentPassword, $row['password_hash'])) {
    sendError('Current password is incorrect.', 401);
}

$pdo->prepare('UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?')
    ->execute([password_hash($newPassword, PASSWORD_BCRYPT), $authUser['id']]);

sendSuccess([], 'Password changed successfully.');
