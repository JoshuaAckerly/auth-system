<?php

namespace Tests\Feature\Api;

use App\Models\Purchase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PurchaseApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_only_their_purchases(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Purchase::factory()->count(2)->create(['user_id' => $user->id]);
        Purchase::factory()->count(1)->create(['user_id' => $otherUser->id]);

        $token = $user->createToken('api-test')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/purchases')
            ->assertOk()
            ->assertJsonCount(2);
    }

    public function test_authenticated_user_can_store_purchase(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('api-test')->plainTextToken;

        $payload = [
            'item' => 'Album',
            'amount' => 29.99,
            'paypal_transaction_id' => 'PAYID-12345',
        ];

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/purchases', $payload)
            ->assertCreated()
            ->assertJsonPath('item', 'Album')
            ->assertJsonPath('paypal_transaction_id', 'PAYID-12345');

        $this->assertDatabaseHas('purchases', [
            'user_id' => $user->id,
            'item' => 'Album',
            'paypal_transaction_id' => 'PAYID-12345',
        ]);
    }

    public function test_purchases_endpoints_require_authentication(): void
    {
        $this->getJson('/api/purchases')->assertUnauthorized();

        $this->postJson('/api/purchases', [
            'item' => 'Poster',
            'amount' => 12.5,
        ])->assertUnauthorized();
    }
}
