<?php

namespace Database\Factories;

use App\Models\MissingPerson;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MissingPerson>
 */
class MissingPersonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'age' => fake()->numberBetween(5, 85),
            'gender' => fake()->randomElement(['male', 'female']),
            'photo_url' => fake()->imageUrl(300, 300, 'people', true),
            'description' => fake()->sentence(8),
            'last_seen_location' => fake()->address(),
            'last_seen_date' => fake()->date(),
            'region' => fake()->state(),
            'contact_phone' => fake()->phoneNumber(),
            'contact_email' => fake()->safeEmail(),
            'status' => fake()->randomElement(['missing', 'found', 'searching', 'urgent']),
            'is_urgent' => fake()->boolean(30),
            'distinctive_signs' => fake()->sentence(4),
            'height' => fake()->randomElement(['175', '165', '180', '185', '190']), // height in cm
            'weight' => fake()->randomElement(['55', '68', '77', '86']), // weight in kg
            'clothing_description' => fake()->sentence(5),
            'reporter_name' => fake()->name(),
            'reporter_phone' => fake()->phoneNumber(),
            'reporter_email' => fake()->safeEmail(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
        ];
    }
}
