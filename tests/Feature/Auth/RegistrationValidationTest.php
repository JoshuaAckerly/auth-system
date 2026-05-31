<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_requires_name(): void
    {
        $this->post('/register', [
            'name' => '',
            'email' => 'new@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertSessionHasErrors(['name']);
    }

    public function test_registration_requires_email(): void
    {
        $this->post('/register', [
            'name' => 'Test User',
            'email' => '',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertSessionHasErrors(['email']);
    }

    public function test_registration_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $this->post('/register', [
            'name' => 'Another User',
            'email' => 'taken@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertSessionHasErrors(['email']);
    }

    public function test_registration_rejects_password_mismatch(): void
    {
        $this->post('/register', [
            'name' => 'Test User',
            'email' => 'new@example.com',
            'password' => 'password',
            'password_confirmation' => 'different',
        ])->assertSessionHasErrors(['password']);
    }

    public function test_registration_requires_password(): void
    {
        $this->post('/register', [
            'name' => 'Test User',
            'email' => 'new@example.com',
        ])->assertSessionHasErrors(['password']);
    }
}
