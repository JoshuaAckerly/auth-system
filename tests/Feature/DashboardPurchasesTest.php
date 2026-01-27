<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Purchase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class DashboardPurchasesTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_returns_purchases_for_authenticated_user()
    {
        $user = User::factory()->create();
        $purchases = Purchase::factory()->count(2)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/dashboard', ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'user',
            'purchases',
        ]);
        $this->assertCount(2, $response->json('purchases'));
        $this->assertEquals($purchases[0]->item, $response->json('purchases.0.item'));
        $this->assertEquals($purchases[1]->item, $response->json('purchases.1.item'));
    }
}
