<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteVisit extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'host',
        'ip_address',
        'city',
        'region',
        'country',
        'user_agent',
        'path',
        'referer',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getBrowserAttribute(): string
    {
        $ua = $this->user_agent ?? '';

        if (str_contains($ua, 'Edg/') || str_contains($ua, 'Edge/')) {
            return 'Edge';
        }
        if (str_contains($ua, 'OPR/') || str_contains($ua, 'Opera')) {
            return 'Opera';
        }
        if (str_contains($ua, 'Chrome/')) {
            return 'Chrome';
        }
        if (str_contains($ua, 'Firefox/')) {
            return 'Firefox';
        }
        if (str_contains($ua, 'Safari/')) {
            return 'Safari';
        }

        return 'Other';
    }
}
