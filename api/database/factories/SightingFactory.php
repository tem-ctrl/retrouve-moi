<?php

namespace Database\Factories;

use App\Models\MissingPerson;
use App\Models\Sighting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sighting>
 */
class SightingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reporter_name' => fake()->name(),
            'reporter_phone' => fake()->phoneNumber(),
            'reporter_email' => fake()->safeEmail(),
            'location' => fake()->address(),
            'sighting_date' => fake()->date(),
            'description' => fake()->sentence(10),
            'missing_person_id' => MissingPerson::factory(),
        ];
    }
}
