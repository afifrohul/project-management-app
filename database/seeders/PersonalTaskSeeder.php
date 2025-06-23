<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PersonalTask;
use Faker\Factory as Faker;

class PersonalTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $tasks = [];

        for ($i = 0; $i < 50; $i++) {
            $dueDate = $faker->dateTimeBetween('now', '+1 month')->format('Y-m-d');

            $tasks[] = [
                'user_id' => $faker->numberBetween(1, 2),
                'title' => $faker->sentence(2),
                'description' => $faker->paragraph(1),
                'priority' => $faker->randomElement(['low', 'medium', 'high']),
                'status' => $faker->randomElement(['pending', 'in_progress', 'completed']),
                'due_date' => $dueDate,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        PersonalTask::insert($tasks);
    }
}
