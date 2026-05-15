<?php

namespace Database\Seeders;

use App\Models\LostItem;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LostItemSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        LostItem::factory(20)
            ->make()
            ->each(function (LostItem $lostItem) use ($users) {
                $lostItem->user_id = $users->random()->id;
                $lostItem->save();
            });
    }
}
