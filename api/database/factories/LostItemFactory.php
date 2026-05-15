<?php

namespace Database\Factories;

use App\Models\LostItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LostItem>
 */
class LostItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $itemTypes = ['document', 'object', 'animal', 'vehicle', 'other'];
        $reportType = fake()->randomElement(['lost', 'found']);

        return [
            'item_type' => fake()->randomElement($itemTypes),
            'item_name' => fake()->word(),
            'item_category' => fake()->word(),
            'photo_url' => fake()->imageUrl(300, 300, 'objects', true),
            'description' => fake()->sentence(8),
            'location' => fake()->address(),
            'date_lost_found' => fake()->date(),
            'region' => fake()->state(),
            'contact_phone' => fake()->phoneNumber(),
            'contact_email' => fake()->safeEmail(),
            'status' => fake()->randomElement(['lost', 'found', 'claimed']),
            'report_type' => $reportType,
            'is_urgent' => fake()->boolean(25),
            'reward' => fake()->randomElement([null, null, fake()->numerify('$###'), fake()->numerify('$##')]),
            'document_type' => fake()->randomElement([null, 'CNI', 'passport', 'driver_license']),
            'document_number' => fake()->randomElement([null, fake()->alphaNum(10)]),
            'owner_name' => fake()->randomElement([null, fake()->name()]),
            'brand' => fake()->word(),
            'color' => fake()->colorName(),
            'serial_number' => fake()->randomElement([null, fake()->alphaNum(15)]),
            'reporter_name' => fake()->name(),
            'reporter_phone' => fake()->phoneNumber(),
            'reporter_email' => fake()->safeEmail(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
        ];
    }
}
