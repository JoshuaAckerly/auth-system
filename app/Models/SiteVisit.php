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
        'is_bot',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    private const BOT_PATTERN = '/bot|crawler|spider|slurp|scan|wget|curl|python|go-http|java|ruby|nuclei|zgrab|nmap|nikto|sqlmap|masscan|facebookexternalhit|applebot/i';

    public static function isBot(?string $userAgent): bool
    {
        return empty($userAgent) || (bool) preg_match(self::BOT_PATTERN, $userAgent);
    }

    // Uses indexed is_bot column — set at write time to avoid full table scans
    public function scopeHuman($query): void
    {
        $query->where('is_bot', false);
    }

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
