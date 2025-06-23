<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\Board;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $boards = Board::all();

        foreach ($boards as $board) {
            $task = Task::create([
                'project_id' => $board->project_id,
                'board_id' => $board->id,
                'title' => 'Task for ' . $board->name,
                'description' => 'Dummy task description',
                'priority' => 'medium',
                'status' => 'pending',
            ]);

            // Assign to member user_id = 3
            $task->assignedUsers()->attach(3);
        }
    }
}
