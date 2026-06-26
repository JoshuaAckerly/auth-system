<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('page_seos', function (Blueprint $table) {
            $table->string('project')->default('graveyardjokes')->after('id');
            $table->index('project');
        });

        // Tag the existing auth-system pages with their project
        DB::table('page_seos')
            ->whereIn('page_key', ['login', 'register', 'dashboard', 'profile', 'admin.messages', 'admin.analytics', 'admin.seo'])
            ->update(['project' => 'auth-system']);
    }

    public function down(): void
    {
        Schema::table('page_seos', function (Blueprint $table) {
            $table->dropIndex(['project']);
            $table->dropColumn('project');
        });
    }
};
