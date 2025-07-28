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
                ['project_id' => $project->id, 'name' => 'To Do'],
                ['project_id' => $project->id, 'name' => 'Sekretaris'],
                ['project_id' => $project->id, 'name' => 'Bendahara'],
                ['project_id' => $project->id, 'name' => 'Acara'],
                ['project_id' => $project->id, 'name' => 'Humas'],
                ['project_id' => $project->id, 'name' => 'PDD'],
                ['project_id' => $project->id, 'name' => 'Perkap'],
            ]);
        }
    }
}
