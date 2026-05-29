<?php

require_once __DIR__ . '/../config/database.php';

try {
    $pdo = getConnection();
} catch (Exception $e) {
    die('DB Error: ' . $e->getMessage() . PHP_EOL);
}

$pdo->exec('DELETE FROM sessions');
$pdo->exec('DELETE FROM users');

$users = [
    ['admin',      'System Administrator', 'admin@vems.gov.et',     'admin',    'admin123'],
    ['registrar1', 'Kebele Registrar',     'registrar@vems.gov.et', 'employee', 'employee123'],
    ['customer1',  'Test Customer',        'customer@vems.gov.et',  'customer', 'customer123'],
];

$stmt = $pdo->prepare('
    INSERT INTO users (username, full_name, email, role, password_hash, status, created_at)
    VALUES (?, ?, ?, ?, ?, "active", NOW())
');

foreach ($users as [$username, $fullName, $email, $role, $password]) {
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt->execute([$username, $fullName, $email, $role, $hash]);
    echo "Created: $username / $password" . PHP_EOL;
}

echo PHP_EOL . "Done. All accounts ready." . PHP_EOL;
