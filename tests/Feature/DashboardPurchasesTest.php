<?php

namespace Tests\Feature;

use App\Models\Purchase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardPurchasesTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_returns_purchases_for_authenticated_user()
    {
        $user = User::factory()->create();
        $purchases = Purchase::factory()->count(2)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('purchases', 2)
            ->where('purchases.0.item', $purchases[0]->item)
            ->where('purchases.1.item', $purchases[1]->item)
        );
    }
}
