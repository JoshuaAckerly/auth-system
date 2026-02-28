<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_login_screen_stores_valid_return_url_in_session(): void
    {
        $returnUrl = 'https://example.com/after-login';

        $response = $this->get('/login?return_url='.urlencode($returnUrl));

        $response->assertStatus(200);
        $response->assertSessionHas('return_url', $returnUrl);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_are_redirected_to_return_url_after_login_when_present(): void
    {
        $user = User::factory()->create();
        $returnUrl = 'https://example.com/after-login';

        $response = $this->withSession(['return_url' => $returnUrl])->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect($returnUrl);
        $response->assertSessionMissing('return_url');
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }

    public function test_users_are_rate_limited_after_too_many_invalid_login_attempts(): void
    {
        $user = User::factory()->create();
        $throttleKey = Str::transliterate(Str::lower($user->email).'|127.0.0.1');

        for ($index = 0; $index < 5; $index++) {
            $this->from('/login')->post('/login', [
                'email' => $user->email,
                'password' => 'wrong-password',
            ]);
        }

        $response = $this->from('/login')->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('email');

        RateLimiter::clear($throttleKey);
    }
}
