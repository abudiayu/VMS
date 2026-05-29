<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

$r = [];
$r['php_version']   = PHP_VERSION;
$r['server_port']   = $_SERVER['SERVER_PORT'] ?? 'unknown';
$r['document_root'] = $_SERVER['DOCUMENT_ROOT'] ?? 'unknown';

try {
    $pdo = getConnection();
    $r['db_connection'] = 'OK';
} catch (Exception $e) {
    $r['db_connection'] = 'FAILED: ' . $e->getMessage();
    echo json_encode($r, JSON_PRETTY_PRINT);
    exit;
}

foreach (['users','sessions','birth_records','death_records','marriage_records','divorce_records'] as $t) {
    try {
        $count = $pdo->query("SELECT COUNT(*) FROM $t")->fetchColumn();
        $r['table_' . $t] = 'OK (' . $count . ' rows)';
    } catch (Exception $e) {
        $r['table_' . $t] = 'MISSING — run vems_db.sql first';
    }
}

try {
    $stmt = $pdo->prepare('SELECT id,username,role,status,password_hash FROM users WHERE username = ?');
    $stmt->execute(['admin']);
    $user = $stmt->fetch();
    if ($user) {
        $r['admin_found']       = 'YES';
        $r['admin_role']        = $user['role'];
        $r['admin_status']      = $user['status'];
        $r['password_admin123'] = password_verify('admin123', $user['password_hash']) ? 'CORRECT ✔' : 'WRONG HASH ✘';
    } else {
        $r['admin_found'] = 'NO — run setup/create_admin.php';
    }
} catch (Exception $e) {
    $r['admin_check'] = 'ERROR: ' . $e->getMessage();
}

echo json_encode($r, JSON_PRETTY_PRINT);
