<?php

namespace Tests\Feature\Api;

use App\Jobs\LookupVisitLocation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SiteVisitApiTest extends TestCase
{
    use RefreshDatabase;

    private string $token = 'test-track-token';

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('app.track_visit_token', $this->token);
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'host' => 'graveyardjokes.local',
            'path' => '/about',
            'ip_address' => '192.168.1.1',
            'user_agent' => 'Mozilla/5.0',
            'referer' => 'https://google.com',
        ], $overrides);
    }

    public function test_valid_token_creates_site_visit(): void
    {
        Queue::fake();

        $response = $this->withToken($this->token)
            ->postJson('/api/site-visits', $this->validPayload());

        $response->assertOk()->assertJson(['ok' => true]);
        $this->assertDatabaseHas('site_visits', [
            'host' => 'graveyardjokes.local',
            'path' => '/about',
        ]);
    }

    public function test_lookup_job_is_dispatched_when_ip_provided(): void
    {
        Queue::fake();

        $this->withToken($this->token)
            ->postJson('/api/site-visits', $this->validPayload(['ip_address' => '8.8.8.8']));

        Queue::assertPushed(LookupVisitLocation::class, function ($job) {
            return true; // just assert it was dispatched
        });
    }

    public function test_lookup_job_is_not_dispatched_without_ip(): void
    {
        Queue::fake();

        $this->withToken($this->token)
            ->postJson('/api/site-visits', $this->validPayload(['ip_address' => null]));

        Queue::assertNotPushed(LookupVisitLocation::class);
    }

    public function test_missing_token_returns_401(): void
    {
        $this->postJson('/api/site-visits', $this->validPayload())
            ->assertUnauthorized();
    }

    public function test_wrong_token_returns_401(): void
    {
        $this->withToken('wrong-token')
            ->postJson('/api/site-visits', $this->validPayload())
            ->assertUnauthorized();
    }

    public function test_missing_host_returns_422(): void
    {
        $this->withToken($this->token)
            ->postJson('/api/site-visits', $this->validPayload(['host' => '']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['host']);
    }

    public function test_missing_path_returns_422(): void
    {
        $this->withToken($this->token)
            ->postJson('/api/site-visits', $this->validPayload(['path' => '']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['path']);
    }

    public function test_optional_fields_can_be_omitted(): void
    {
        Queue::fake();

        $this->withToken($this->token)
            ->postJson('/api/site-visits', ['host' => 'graveyardjokes.local', 'path' => '/'])
            ->assertOk()
            ->assertJson(['ok' => true]);

        $this->assertDatabaseCount('site_visits', 1);
    }

    public function test_no_job_dispatched_when_track_token_not_configured(): void
    {
        Queue::fake();
        Config::set('app.track_visit_token', null);

        $this->withToken('any-token')
            ->postJson('/api/site-visits', $this->validPayload())
            ->assertUnauthorized();

        Queue::assertNotPushed(LookupVisitLocation::class);
    }
}
