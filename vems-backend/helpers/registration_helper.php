<?php

function generateRegistrationNumber($type) {
    $prefixes = [
        'birth'    => 'BR',
        'death'    => 'DR',
        'marriage' => 'MR',
        'divorce'  => 'DV',
    ];
    $prefix = $prefixes[$type] ?? 'EV';
    $year   = date('Y');
    $unique = strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
    return $prefix . '-' . $year . '-' . $unique;
}
