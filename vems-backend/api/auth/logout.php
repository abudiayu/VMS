<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed.', 405);
}

$headers    = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

if (!empty($authHeader) && stripos($authHeader, 'Bearer ') === 0) {
    $token = trim(substr($authHeader, 7));
    $pdo   = getConnection();
    $pdo->prepare('DELETE FROM sessions WHERE token = ?')->execute([$token]);
}

sendSuccess([], 'Logged out successfully.');
