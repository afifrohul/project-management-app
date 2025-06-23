<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\ProjectUserRole;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Project 1 - Afif sebagai owner
        $project1 = Project::create([
            'name' => 'Project Alpha',
            'description' => 'Project management pertama',
            'created_by' => 1
        ]);

        // Project 2 - Rina sebagai owner
        $project2 = Project::create([
            'name' => 'Project Beta',
            'description' => 'Project management kedua',
            'created_by' => 2
        ]);

        // Assign roles
        ProjectUserRole::insert([
            ['project_id' => $project1->id, 'user_id' => 1, 'role_id' => 1], // Owner
            ['project_id' => $project1->id, 'user_id' => 2, 'role_id' => 2], // Manager
            ['project_id' => $project1->id, 'user_id' => 3, 'role_id' => 3], // Member

            ['project_id' => $project2->id, 'user_id' => 2, 'role_id' => 1], // Owner
            ['project_id' => $project2->id, 'user_id' => 1, 'role_id' => 2], // Manager
            ['project_id' => $project2->id, 'user_id' => 3, 'role_id' => 3], // Member
        ]);
    }
}
