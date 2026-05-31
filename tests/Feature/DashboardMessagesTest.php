<?php

namespace Tests\Feature;

use App\Models\AdminMessage;
use App\Models\AdminMessageRead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardMessagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/dashboard')
            ->assertRedirect('/login');
    }

    public function test_dashboard_has_recent_messages_prop(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->has('recentMessages')
                ->has('unreadCount')
            );
    }

    public function test_broadcast_message_appears_for_all_users(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        AdminMessage::create([
            'user_id' => null,
            'title' => 'Broadcast Alert',
            'body' => 'Everyone sees this',
            'type' => 'broadcast',
        ]);

        $this->actingAs($userA)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->has('recentMessages', 1)
                ->where('recentMessages.0.title', 'Broadcast Alert')
            );

        $this->actingAs($userB)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->has('recentMessages', 1)
            );
    }

    public function test_individual_message_only_appears_for_target_user(): void
    {
        $target = User::factory()->create();
        $other = User::factory()->create();

        AdminMessage::create([
            'user_id' => $target->id,
            'title' => 'Personal Message',
            'body' => 'Only for you',
            'type' => 'individual',
        ]);

        $this->actingAs($target)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->has('recentMessages', 1)
            );

        $this->actingAs($other)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->has('recentMessages', 0)
            );
    }

    public function test_unread_count_reflects_unread_messages(): void
    {
        $user = User::factory()->create();

        AdminMessage::create([
            'user_id' => null,
            'title' => 'Broadcast 1',
            'body' => 'Test',
            'type' => 'broadcast',
        ]);
        AdminMessage::create([
            'user_id' => null,
            'title' => 'Broadcast 2',
            'body' => 'Test',
            'type' => 'broadcast',
        ]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->where('unreadCount', 2)
            );
    }

    public function test_read_message_is_marked_as_read(): void
    {
        $user = User::factory()->create();

        $message = AdminMessage::create([
            'user_id' => null,
            'title' => 'Broadcast',
            'body' => 'Read this',
            'type' => 'broadcast',
        ]);

        AdminMessageRead::create([
            'admin_message_id' => $message->id,
            'user_id' => $user->id,
            'read_at' => now(),
        ]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->where('unreadCount', 0)
                ->where('recentMessages.0.is_read', true)
            );
    }

    public function test_unread_message_has_is_read_false(): void
    {
        $user = User::factory()->create();

        AdminMessage::create([
            'user_id' => null,
            'title' => 'Unread',
            'body' => 'Not yet read',
            'type' => 'broadcast',
        ]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->where('recentMessages.0.is_read', false)
            );
    }
}
