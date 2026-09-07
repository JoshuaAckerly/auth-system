<?php

return [

    // Comma-separated IPs (in ANALYTICS_EXCLUDED_IPS) hidden from all site-visit analytics, e.g. the admin's own IP
    'excluded_ips' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('ANALYTICS_EXCLUDED_IPS', ''))
    ))),

];
