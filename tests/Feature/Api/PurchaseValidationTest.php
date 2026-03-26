<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PurchaseValidationTest extends TestCase
{
    use RefreshDatabase;

    private function authHeader(): array
    {
        $user  = User::factory()->create();
        $token = $user->createToken('api-test')->plainTextToken;
        return ['Authorization' => 'Bearer ' . $token];
    }

    public function test_store_requires_item(): void
    {
        $this->withHeaders($this->authHeader())
            ->postJson('/api/purchases', [
                'amount' => 9.99,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['item']);
    }

    public function test_store_requires_amount(): void
    {
        $this->withHeaders($this->authHeader())
            ->postJson('/api/purchases', [
                'item' => 'Poster',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['amount']);
    }

    public function test_store_requires_numeric_amount(): void
    {
        $this->withHeaders($this->authHeader())
            ->postJson('/api/purchases', [
                'item'   => 'Poster',
                'amount' => 'not-a-number',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['amount']);
    }

    public function test_item_cannot_exceed_255_characters(): void
    {
        $this->withHeaders($this->authHeader())
            ->postJson('/api/purchases', [
                'item'   => str_repeat('a', 256),
                'amount' => 9.99,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['item']);
    }

    public function test_paypal_transaction_id_is_optional(): void
    {
        $this->withHeaders($this->authHeader())
            ->postJson('/api/purchases', [
                'item'   => 'Digital Download',
                'amount' => 4.99,
            ])
            ->assertCreated();
    }
}
