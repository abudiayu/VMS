<?php

require_once __DIR__ . '/../config/database.php';

function generateToken($userId) {
    return bin2hex(random_bytes(32)) . base64_encode($userId . ':' . time());
}

function getAuthUser() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (empty($authHeader) || stripos($authHeader, 'Bearer ') !== 0) {
        return null;
    }

    $token = trim(substr($authHeader, 7));
    $pdo   = getConnection();

    $stmt = $pdo->prepare('
        SELECT u.*
        FROM users u
        JOIN sessions s ON u.id = s.user_id
        WHERE s.token = ?
          AND s.expires_at > NOW()
          AND u.status = "active"
    ');
    $stmt->execute([$token]);
    return $stmt->fetch() ?: null;
}

function requireAuth() {
    $user = getAuthUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized. Please log in.']);
        exit;
    }
    return $user;
}

function requireRole($roles) {
    $user = requireAuth();
    if (!in_array($user['role'], (array)$roles)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Access denied. Insufficient privileges.']);
        exit;
    }
    return $user;
}
