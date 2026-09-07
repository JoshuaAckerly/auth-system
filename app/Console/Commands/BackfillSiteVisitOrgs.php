<?php

namespace App\Console\Commands;

use App\Models\SiteVisit;
use GuzzleHttp\Client;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class BackfillSiteVisitOrgs extends Command
{
    protected $signature = 'analytics:backfill-orgs {--limit=500 : Max distinct IPs to look up per run}';

    protected $description = 'Look up hosting/ASN org for existing site visits and flag datacenter IPs as bots';

    public function handle(): int
    {
        $client = new Client(['timeout' => 10]);

        $ips = SiteVisit::whereNull('org')
            ->whereNotNull('ip_address')
            ->where('is_bot', false)
            ->distinct()
            ->limit((int) $this->option('limit'))
            ->pluck('ip_address');

        $this->info("Looking up {$ips->count()} distinct IPs...");

        foreach ($ips as $ip) {
            $cacheKey = 'ip_geo_org_'.md5($ip);

            $org = Cache::remember($cacheKey, now()->addHours(24), function () use ($client, $ip) {
                try {
                    $response = $client->get("https://ipinfo.io/{$ip}/json", [
                        'headers' => ['Accept' => 'application/json'],
                    ]);
                    $data = json_decode((string) $response->getBody(), true);

                    return is_array($data) ? ($data['org'] ?? null) : null;
                } catch (\Exception $e) {
                    Log::warning('GeoIP org lookup failed for '.$ip.': '.$e->getMessage());

                    return null;
                }
            });

            $update = ['org' => $org];
            if (SiteVisit::isHostingProvider($org)) {
                $update['is_bot'] = true;
            }

            SiteVisit::where('ip_address', $ip)->update($update);
        }

        $this->info('Done.');

        return self::SUCCESS;
    }
}
