<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\Board;
use Faker\Factory as Faker;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $boards = Board::all();

        foreach ($boards as $board) {
            $taskCount = rand(3, 5);

            for ($i = 0; $i < $taskCount; $i++) {
                $task = Task::create([
                    'project_id'  => $board->project_id,
                    'board_id'    => $board->id,
                    'title'       => $faker->sentence(2),
                    'description' => $faker->paragraph(1),
                    'priority'    => $faker->randomElement(['low', 'medium', 'high']),
                    'due_date'    => Carbon::now()->addDays(5),
                ]);

                // Optional: assign user_id acak (misal 3–5)
                $task->assignments()->attach(rand(3, 5));
            }
        }
    }
}
