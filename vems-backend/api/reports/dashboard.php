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
$users     = (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();

$recentBirths = $pdo->query("
    SELECT id, registration_no, 'Birth' AS type,
           child_name AS name, date_of_birth AS date, status
    FROM birth_records ORDER BY created_at DESC LIMIT 3
")->fetchAll();

$recentDeaths = $pdo->query("
    SELECT id, registration_no, 'Death' AS type,
           deceased_name AS name, date_of_death AS date, status
    FROM death_records ORDER BY created_at DESC LIMIT 3
")->fetchAll();

$recentMarriages = $pdo->query("
    SELECT id, registration_no, 'Marriage' AS type,
           CONCAT(husband_name, ' & ', wife_name) AS name,
           marriage_date AS date, status
    FROM marriage_records ORDER BY created_at DESC LIMIT 2
")->fetchAll();

$recentDivorces = $pdo->query("
    SELECT id, registration_no, 'Divorce' AS type,
           CONCAT(husband_name, ' & ', wife_name) AS name,
           divorce_date AS date, status
    FROM divorce_records ORDER BY created_at DESC LIMIT 2
")->fetchAll();

$recentEvents = array_merge($recentBirths, $recentDeaths, $recentMarriages, $recentDivorces);
usort($recentEvents, fn($a, $b) => strcmp($b['date'], $a['date']));
$recentEvents = array_slice($recentEvents, 0, 10);

sendSuccess([
    'stats' => [
        'births'       => $births,
        'deaths'       => $deaths,
        'marriages'    => $marriages,
        'divorces'     => $divorces,
        'total_users'  => $users,
        'total_events' => $births + $deaths + $marriages + $divorces,
    ],
    'recent_events' => $recentEvents,
]);
