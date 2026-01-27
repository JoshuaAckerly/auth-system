<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PurchaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 5 users if not already present
        if (\App\Models\User::count() < 5) {
            \App\Models\User::factory()->count(5)->create();
        }

        // Assign 3 purchases to each user
        foreach (\App\Models\User::all() as $user) {
            \App\Models\Purchase::factory()->count(3)->create(['user_id' => $user->id]);
        }
    }
}
