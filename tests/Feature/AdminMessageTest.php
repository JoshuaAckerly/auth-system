<?php

namespace Tests\Feature;

use App\Models\AdminMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminMessageTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): User
    {
        $admin = User::factory()->create(['email' => 'admin@test.com']);
        config(['app.admin_email' => 'admin@test.com']);

        return $admin;
    }

    public function test_non_admin_cannot_access_admin_messages(): void
    {
        $user = User::factory()->create(['email' => 'user@test.com']);
        config(['app.admin_email' => 'admin@test.com']);

        $this->actingAs($user)
            ->get('/admin/messages')
            ->assertForbidden();
    }

    public function test_guest_cannot_access_admin_messages(): void
    {
        $this->get('/admin/messages')
            ->assertRedirect('/login');
    }

    public function test_admin_can_view_message_index(): void
    {
        $admin = $this->createAdmin();

        AdminMessage::create([
            'title' => 'Test Message',
            'body' => 'Test body',
            'type' => 'broadcast',
        ]);

        $this->actingAs($admin)
            ->get('/admin/messages')
            ->assertOk();
    }

    public function test_admin_can_view_create_form(): void
    {
        $admin = $this->createAdmin();

        $this->actingAs($admin)
            ->get('/admin/messages/create')
            ->assertOk();
    }

    public function test_admin_can_send_individual_message(): void
    {
        $admin = $this->createAdmin();
        $user = User::factory()->create();

        $this->actingAs($admin)
            ->post('/admin/messages', [
                'title' => 'Personal Note',
                'body' => 'This is for you.',
                'type' => 'individual',
                'user_id' => $user->id,
            ])
            ->assertRedirect(route('admin.messages.index'));

        $this->assertDatabaseHas('admin_messages', [
            'title' => 'Personal Note',
            'type' => 'individual',
            'user_id' => $user->id,
        ]);
    }

    public function test_admin_can_send_broadcast_message(): void
    {
        $admin = $this->createAdmin();

        $this->actingAs($admin)
            ->post('/admin/messages', [
                'title' => 'Announcement',
                'body' => 'Big news for everyone.',
                'type' => 'broadcast',
            ])
            ->assertRedirect(route('admin.messages.index'));

        $this->assertDatabaseHas('admin_messages', [
            'title' => 'Announcement',
            'type' => 'broadcast',
            'user_id' => null,
        ]);
    }

    public function test_broadcast_message_ignores_user_id(): void
    {
        $admin = $this->createAdmin();
        $user = User::factory()->create();

        $this->actingAs($admin)
            ->post('/admin/messages', [
                'title' => 'Broadcast',
                'body' => 'For all.',
                'type' => 'broadcast',
                'user_id' => $user->id,
            ]);

        $this->assertDatabaseHas('admin_messages', [
            'title' => 'Broadcast',
            'user_id' => null,
        ]);
    }

    public function test_individual_message_requires_user_id(): void
    {
        $admin = $this->createAdmin();

        $this->actingAs($admin)
            ->post('/admin/messages', [
                'title' => 'Personal',
                'body' => 'Missing user.',
                'type' => 'individual',
            ])
            ->assertSessionHasErrors('user_id');
    }

    public function test_admin_can_view_message_details(): void
    {
        $admin = $this->createAdmin();

        $message = AdminMessage::create([
            'title' => 'Detail Test',
            'body' => 'Check the details.',
            'type' => 'broadcast',
        ]);

        $this->actingAs($admin)
            ->get("/admin/messages/{$message->id}")
            ->assertOk();
    }

    public function test_message_title_is_required(): void
    {
        $admin = $this->createAdmin();

        $this->actingAs($admin)
            ->post('/admin/messages', [
                'title' => '',
                'body' => 'Body text.',
                'type' => 'broadcast',
            ])
            ->assertSessionHasErrors('title');
    }

    public function test_message_body_max_length(): void
    {
        $admin = $this->createAdmin();

        $this->actingAs($admin)
            ->post('/admin/messages', [
                'title' => 'Title',
                'body' => str_repeat('a', 5001),
                'type' => 'broadcast',
            ])
            ->assertSessionHasErrors('body');
    }
}
