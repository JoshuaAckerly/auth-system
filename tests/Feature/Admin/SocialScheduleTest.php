<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SocialScheduleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

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
        $this->get('/admin/social-schedule')
            ->assertRedirect('/login');
    }

    public function test_non_admin_gets_403(): void
    {
        $this->actingAs($this->regularUser())
            ->get('/admin/social-schedule')
            ->assertForbidden();
    }

    public function test_admin_can_view_social_schedule(): void
    {
        Config::set('services.graveyardjokes.base_url', 'https://graveyardjokes.test');
        Config::set('services.graveyardjokes.social_schedule_secret', 'schedule-secret');

        Http::fake([
            'graveyardjokes.test/api/social/schedule' => Http::response([
                'data' => [
                    [
                        'id' => 35,
                        'platform' => 'instagram',
                        'content' => 'Scheduled Instagram post',
                        'media_url' => 'https://graveyardjokes.test/image.jpg',
                        'scheduled_at' => now()->addDay()->toIso8601String(),
                        'posted_at' => null,
                        'status' => 'pending',
                        'error_message' => null,
                    ],
                ],
            ]),
        ]);

        $this->actingAs($this->adminUser())
            ->get('/admin/social-schedule')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/SocialSchedule/Index')
                ->where('stats.total', 1)
                ->where('stats.pending', 1)
                ->where('posts.0.content', 'Scheduled Instagram post')
                ->where('apiError', null)
            );

        Http::assertSent(fn ($request) => $request->hasHeader('Authorization', 'Bearer schedule-secret'));
    }

    public function test_admin_sees_configuration_error_when_secret_missing(): void
    {
        Config::set('services.graveyardjokes.social_schedule_secret', null);

        $this->actingAs($this->adminUser())
            ->get('/admin/social-schedule')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/SocialSchedule/Index')
                ->where('stats.total', 0)
                ->where('posts', [])
                ->where('apiError', 'SOCIAL_SCHEDULE_SECRET is not configured for auth-system.')
            );
    }
}