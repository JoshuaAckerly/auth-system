<?php

namespace Tests\Feature\Admin;

use App\Models\SiteVisit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AnalyticsTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        $user = User::factory()->create(['email' => 'admin@example.com']);
        Config::set('app.admin_email', 'admin@example.com');

        return $user;
    }

    private function regularUser(): User
    {
        return User::factory()->create(['email' => 'user@example.com']);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/admin/analytics')
            ->assertRedirect('/login');
    }

    public function test_non_admin_gets_403(): void
    {
        $this->actingAs($this->regularUser())
            ->get('/admin/analytics')
            ->assertForbidden();
    }

    public function test_admin_can_view_analytics_page(): void
    {
        $this->actingAs($this->adminUser())
            ->get('/admin/analytics')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Analytics/Index'));
    }

    public function test_analytics_page_has_required_props(): void
    {
        $this->actingAs($this->adminUser())
            ->get('/admin/analytics')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Analytics/Index')
                ->has('stats')
                ->has('dailyChart')
                ->has('topPages')
                ->has('topCities')
                ->has('visitsByHost')
                ->has('recentVisits')
            );
    }

    public function test_stats_contains_expected_keys(): void
    {
        $this->actingAs($this->adminUser())
            ->get('/admin/analytics')
            ->assertInertia(fn (Assert $page) => $page
                ->has('stats.totalVisits')
                ->has('stats.visitsLast30Days')
                ->has('stats.visitsLast7Days')
                ->has('stats.uniqueIpsLast30')
                ->has('stats.loggedInLast30')
            );
    }

    public function test_daily_chart_has_14_entries(): void
    {
        $this->actingAs($this->adminUser())
            ->get('/admin/analytics')
            ->assertInertia(fn (Assert $page) => $page
                ->has('dailyChart', 14)
            );
    }

    public function test_total_visits_reflects_database(): void
    {
        SiteVisit::create([
            'host' => 'graveyardjokes.local',
            'path' => '/test',
            'created_at' => now(),
        ]);
        SiteVisit::create([
            'host' => 'graveyardjokes.local',
            'path' => '/about',
            'created_at' => now(),
        ]);

        $this->actingAs($this->adminUser())
            ->get('/admin/analytics')
            ->assertInertia(fn (Assert $page) => $page
                ->where('stats.totalVisits', 2)
            );
    }
}
