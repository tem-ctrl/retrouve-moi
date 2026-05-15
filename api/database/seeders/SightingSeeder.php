<?php

namespace Database\Seeders;

use App\Models\MissingPerson;
use App\Models\Sighting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SightingSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $missingPersons = MissingPerson::all();

        if ($missingPersons->isEmpty()) {
            return;
        }

        Sighting::factory(30)
            ->make()
            ->each(function (Sighting $sighting) use ($users, $missingPersons) {
                $sighting->user_id = $users->random()->id;
                $sighting->missing_person_id = $missingPersons->random()->id;
                $sighting->save();
            });
    }
}
