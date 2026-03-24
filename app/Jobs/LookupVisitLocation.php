<?php

namespace App\Jobs;

use App\Models\SiteVisit;
use GuzzleHttp\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LookupVisitLocation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;
    public int $timeout = 15;

    public function __construct(private readonly int $visitId, private readonly string $ip) {}

    public function handle(): void
    {
        // Skip private/loopback addresses
        if (in_array($this->ip, ['127.0.0.1', '::1', 'localhost'], true)
            || $this->isPrivateIp($this->ip)) {
            return;
        }

        $cacheKey = 'ip_geo_' . md5($this->ip);

        $location = Cache::remember($cacheKey, now()->addHours(24), function () {
            try {
                $client = new Client(['timeout' => 10]);
                $response = $client->get("https://ipinfo.io/{$this->ip}/json", [
                    'headers' => ['Accept' => 'application/json'],
                ]);
                $data = json_decode((string) $response->getBody(), true);

                if (! is_array($data)) {
                    return null;
                }

                return [
                    'city'    => $data['city'] ?? null,
                    'region'  => $data['region'] ?? null,
                    'country' => $data['country'] ?? null,
                ];
            } catch (\Exception $e) {
                Log::warning('GeoIP lookup failed for ' . $this->ip . ': ' . $e->getMessage());
                return null;
            }
        });

        if ($location) {
            SiteVisit::where('id', $this->visitId)->update($location);
        }
    }

    private function isPrivateIp(string $ip): bool
    {
        return filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) === false;
    }
}
