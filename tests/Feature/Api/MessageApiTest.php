<?php

namespace Tests\Feature\Api;

use App\Models\AdminMessage;
use App\Models\AdminMessageRead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_messages(): void
    {
        $this->getJson('/api/messages')
            ->assertUnauthorized();
    }

    public function test_authenticated_user_can_list_their_messages(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        // Individual message for this user
        AdminMessage::create([
            'user_id' => $user->id,
            'title' => 'For you',
            'body' => 'Personal message',
            'type' => 'individual',
        ]);

        // Individual message for other user (should NOT appear)
        AdminMessage::create([
            'user_id' => $otherUser->id,
            'title' => 'Not for you',
            'body' => 'Someone else message',
            'type' => 'individual',
        ]);

        // Broadcast message (should appear for all)
        AdminMessage::create([
            'user_id' => null,
            'title' => 'Broadcast',
            'body' => 'For everyone',
            'type' => 'broadcast',
        ]);

        $token = $user->createToken('api-test')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/messages')
            ->assertOk();

        $data = $response->json();
        $this->assertCount(2, $data['messages']['data']);
        $this->assertEquals(2, $data['unread_count']);
    }

    public function test_messages_include_is_read_flag(): void
    {
        $user = User::factory()->create();

        $message = AdminMessage::create([
            'user_id' => $user->id,
            'title' => 'Read message',
            'body' => 'Already read',
            'type' => 'individual',
        ]);

        AdminMessage::create([
            'user_id' => $user->id,
            'title' => 'Unread message',
            'body' => 'Not yet read',
            'type' => 'individual',
        ]);

        AdminMessageRead::create([
            'admin_message_id' => $message->id,
            'user_id' => $user->id,
            'read_at' => now(),
        ]);

        $token = $user->createToken('api-test')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/messages')
            ->assertOk();

        $messages = collect($response->json('messages.data'));
        $readMessage = $messages->firstWhere('id', $message->id);
        $this->assertTrue($readMessage['is_read']);

        $this->assertEquals(1, $response->json('unread_count'));
    }

    public function test_user_can_mark_message_as_read(): void
    {
        $user = User::factory()->create();

        $message = AdminMessage::create([
            'user_id' => $user->id,
            'title' => 'Test',
            'body' => 'Body',
            'type' => 'individual',
        ]);

        $token = $user->createToken('api-test')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson("/api/messages/{$message->id}/read")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('admin_message_reads', [
            'admin_message_id' => $message->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_marking_already_read_message_is_idempotent(): void
    {
        $user = User::factory()->create();

        $message = AdminMessage::create([
            'user_id' => $user->id,
            'title' => 'Test',
            'body' => 'Body',
            'type' => 'individual',
        ]);

        AdminMessageRead::create([
            'admin_message_id' => $message->id,
            'user_id' => $user->id,
            'read_at' => now(),
        ]);

        $token = $user->createToken('api-test')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson("/api/messages/{$message->id}/read")
            ->assertOk();

        $this->assertDatabaseCount('admin_message_reads', 1);
    }

    public function test_user_cannot_mark_other_users_message_as_read(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $message = AdminMessage::create([
            'user_id' => $otherUser->id,
            'title' => 'Not yours',
            'body' => 'Body',
            'type' => 'individual',
        ]);

        $token = $user->createToken('api-test')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson("/api/messages/{$message->id}/read")
            ->assertNotFound();
    }

    public function test_user_can_mark_all_messages_as_read(): void
    {
        $user = User::factory()->create();

        AdminMessage::create([
            'user_id' => $user->id,
            'title' => 'Message 1',
            'body' => 'Body 1',
            'type' => 'individual',
        ]);

        AdminMessage::create([
            'user_id' => null,
            'title' => 'Broadcast',
            'body' => 'Body 2',
            'type' => 'broadcast',
        ]);

        $token = $user->createToken('api-test')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson('/api/messages/read-all')
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseCount('admin_message_reads', 2);
        $this->assertEquals(0, AdminMessage::query()->unreadFor($user->id)->count());
    }

    public function test_broadcast_read_by_one_user_does_not_affect_other(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $broadcast = AdminMessage::create([
            'user_id' => null,
            'title' => 'Broadcast',
            'body' => 'For all',
            'type' => 'broadcast',
        ]);

        // User 1 marks it as read
        AdminMessageRead::create([
            'admin_message_id' => $broadcast->id,
            'user_id' => $user1->id,
            'read_at' => now(),
        ]);

        // User 2 should still see it as unread
        $this->assertEquals(0, AdminMessage::query()->unreadFor($user1->id)->count());
        $this->assertEquals(1, AdminMessage::query()->unreadFor($user2->id)->count());
    }
}
