<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_seos', function (Blueprint $table) {
            $table->id();
            $table->string('page_key')->unique();
            $table->string('page_label');
            $table->string('page_url');

            // Core
            $table->string('title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('robots')->default('index,follow');

            // Open Graph
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('og_type')->default('website');

            // Twitter Card
            $table->string('twitter_card')->default('summary_large_image');
            $table->string('twitter_title')->nullable();
            $table->text('twitter_description')->nullable();
            $table->string('twitter_image')->nullable();

            // Structured Data
            $table->json('schema_json')->nullable();

            // Sitemap
            $table->decimal('sitemap_priority', 3, 2)->default(0.50);
            $table->string('sitemap_change_freq')->default('monthly');

            $table->timestamps();

            $table->index('page_url');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_seos');
    }
};
