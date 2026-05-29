<?php

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response_helper.php';
require_once __DIR__ . '/../../helpers/auth_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') sendError('Method not allowed.', 405);
requireAuth();
$pdo = getConnection();

$births    = (int)$pdo->query('SELECT COUNT(*) FROM birth_records')->fetchColumn();
$deaths    = (int)$pdo->query('SELECT COUNT(*) FROM death_records')->fetchColumn();
$marriages = (int)$pdo->query('SELECT COUNT(*) FROM marriage_records')->fetchColumn();
$divorces  = (int)$pdo->query('SELECT COUNT(*) FROM divorce_records')->fetchColumn();

sendSuccess([
    'births'    => $births,
    'deaths'    => $deaths,
    'marriages' => $marriages,
    'divorces'  => $divorces,
    'total'     => $births + $deaths + $marriages + $divorces,
]);
