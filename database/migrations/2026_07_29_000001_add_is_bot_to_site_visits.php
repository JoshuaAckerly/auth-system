<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const BOT_PATTERN = 'bot|crawler|spider|slurp|scan|wget|curl|python|go-http|java|ruby|nuclei|zgrab|nmap|nikto|sqlmap|masscan|facebookexternalhit|applebot';

    public function up(): void
    {
        Schema::table('site_visits', function (Blueprint $table) {
            $table->boolean('is_bot')->default(false)->after('created_at');
            $table->index(['is_bot', 'created_at']);
        });

        // Backfill existing rows so scopeHuman() can drop the REGEXP immediately
        DB::statement("UPDATE site_visits SET is_bot = 1 WHERE user_agent IS NULL OR user_agent = '' OR LOWER(user_agent) REGEXP ?", [self::BOT_PATTERN]);
    }

    public function down(): void
    {
        Schema::table('site_visits', function (Blueprint $table) {
            $table->dropIndex(['is_bot', 'created_at']);
            $table->dropColumn('is_bot');
        });
    }
};
