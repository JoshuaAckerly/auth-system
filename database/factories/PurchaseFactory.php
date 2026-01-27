<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Purchase>
 */
class PurchaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'item' => $this->faker->randomElement(['T-shirt', 'Album', 'Sticker', 'Poster']),
            'amount' => $this->faker->randomFloat(2, 5, 100),
        ];
    }
}
