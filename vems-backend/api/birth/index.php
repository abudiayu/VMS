<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') sendError('Method not allowed.', 405);

requireAuth();
$pdo = getConnection();
$where = []; $params = [];

if (!empty($_GET['kebele']))   { $where[] = 'kebele LIKE ?';        $params[] = '%'.$_GET['kebele'].'%'; }
if (!empty($_GET['date_from'])){ $where[] = 'date_of_birth >= ?';   $params[] = $_GET['date_from']; }
if (!empty($_GET['date_to']))  { $where[] = 'date_of_birth <= ?';   $params[] = $_GET['date_to']; }

$sql = 'SELECT * FROM birth_records';
if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
$sql .= ' ORDER BY created_at DESC';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$records = $stmt->fetchAll();
sendSuccess(['records' => $records, 'total' => count($records)]);
