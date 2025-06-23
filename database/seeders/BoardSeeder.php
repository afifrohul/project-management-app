<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Board;
use App\Models\Project;

class BoardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = Project::all();

        foreach ($projects as $project) {
            Board::insert([
                ['project_id' => $project->id, 'name' => 'To Do', 'position' => 1],
                ['project_id' => $project->id, 'name' => 'In Progress', 'position' => 2],
                ['project_id' => $project->id, 'name' => 'Done', 'position' => 3],
            ]);
        }
    }
}
