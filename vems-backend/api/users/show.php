<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') sendError('Method not allowed.', 405);
requireRole(['admin']);
$id = intval($_GET['id'] ?? 0);
if (!$id) sendError('User ID is required.');
$pdo  = getConnection();
$stmt = $pdo->prepare('SELECT id,username,full_name,email,role,status,created_at FROM users WHERE id = ?');
$stmt->execute([$id]);
$user = $stmt->fetch();
if (!$user) sendError('User not found.', 404);
sendSuccess(['user' => $user]);
