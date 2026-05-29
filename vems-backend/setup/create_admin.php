<?php

header('Content-Type: text/html; charset=utf-8');
require_once __DIR__ . '/../config/database.php';

try {
    $pdo = getConnection();
} catch (Exception $e) {
    die('<b style="color:red">DB Error: ' . $e->getMessage() . '</b>');
}

$pdo->exec('DELETE FROM sessions');
$pdo->exec('DELETE FROM users');

$accounts = [
    [
        'username'  => 'admin',
        'full_name' => 'System Administrator',
        'email'     => 'admin@vems.gov.et',
        'role'      => 'admin',
        'password'  => 'admin123',
    ],
    [
        'username'  => 'registrar1',
        'full_name' => 'Kebele Registrar',
        'email'     => 'registrar@vems.gov.et',
        'role'      => 'employee',
        'password'  => 'employee123',
    ],
    [
        'username'  => 'customer1',
        'full_name' => 'Test Customer',
        'email'     => 'customer@vems.gov.et',
        'role'      => 'customer',
        'password'  => 'customer123',
    ],
];

$stmt = $pdo->prepare('
    INSERT INTO users (username, full_name, email, role, password_hash, status, created_at)
    VALUES (?, ?, ?, ?, ?, "active", NOW())
');

echo '<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; padding: 30px; background: #f5f5f5; }
  h2   { color: #1a73e8; }
  table{ border-collapse: collapse; width: 100%; max-width: 600px; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  th   { background: #1a73e8; color: #fff; padding: 12px 16px; text-align: left; }
  td   { padding: 11px 16px; border-bottom: 1px solid #eee; }
  .ok  { color: #34a853; font-weight: bold; }
  .err { color: #ea4335; font-weight: bold; }
  .warn{ background: #fff3cd; padding: 12px 16px; border-radius: 6px; margin-top: 20px; border-left: 4px solid #fbbc04; }
</style></head><body>';

echo '<h2>VEMS — Account Setup</h2>';
echo '<table><tr><th>Username</th><th>Password</th><th>Role</th><th>Status</th></tr>';

foreach ($accounts as $acc) {
    $hash   = password_hash($acc['password'], PASSWORD_BCRYPT);
    $stmt->execute([$acc['username'], $acc['full_name'], $acc['email'], $acc['role'], $hash]);
    $check  = password_verify($acc['password'], $hash);
    $status = $check ? '<span class="ok">✔ Created</span>' : '<span class="err">✘ Failed</span>';
    echo "<tr><td>{$acc['username']}</td><td>{$acc['password']}</td><td>{$acc['role']}</td><td>$status</td></tr>";
}

echo '</table>';
echo '<div class="warn"><b>⚠ Delete this file after use:</b> setup/create_admin.php</div>';
echo '</body></html>';
