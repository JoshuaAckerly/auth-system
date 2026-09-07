<?php

namespace App\Console\Commands;

use App\Models\SiteVisit;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PropagateBotIps extends Command
{
    protected $signature = 'analytics:propagate-bot-ips';

    protected $description = 'Flag all visits from an IP as bot if that IP has ever sent at least one bot-flagged request';

    public function handle(): int
    {
        // MySQL can't UPDATE and SELECT from the same table directly, so materialize the bot IP list first
        $botIps = SiteVisit::where('is_bot', true)
            ->whereNotNull('ip_address')
            ->distinct()
            ->pluck('ip_address');

        if ($botIps->isEmpty()) {
            $this->line('No bot IPs found.');

            return self::SUCCESS;
        }

        $updated = 0;
        foreach ($botIps->chunk(500) as $chunk) {
            $updated += DB::table('site_visits')
                ->where('is_bot', false)
                ->whereIn('ip_address', $chunk->all())
                ->update(['is_bot' => true]);
        }

        $this->info("Flagged {$updated} additional visit(s) as bot across {$botIps->count()} known bot IP(s).");

        return self::SUCCESS;
    }
}
