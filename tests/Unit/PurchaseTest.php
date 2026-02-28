<?php

namespace Tests\Unit;

use App\Models\Purchase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PurchaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_purchase_belongs_to_a_user(): void
    {
        $user = User::factory()->create();
        $purchase = Purchase::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $purchase->user);
        $this->assertSame($user->id, $purchase->user->id);
    }
}
