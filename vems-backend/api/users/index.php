<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') sendError('Method not allowed.', 405);
requireRole(['admin']);
$pdo  = getConnection();
$stmt = $pdo->query('SELECT id,username,full_name,email,role,status,created_at,updated_at FROM users ORDER BY created_at DESC');
$users = $stmt->fetchAll();
sendSuccess(['users' => $users, 'total' => count($users)]);
