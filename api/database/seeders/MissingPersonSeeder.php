<?php

namespace Database\Seeders;

use App\Models\MissingPerson;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MissingPersonSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        MissingPerson::factory(15)
            ->make()
            ->each(function (MissingPerson $missingPerson) use ($users) {
                $missingPerson->user_id = $users->random()->id;
                $missingPerson->save();
            });
    }
}
