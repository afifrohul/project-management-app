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
        $faker = \Faker\Factory::create();

        $projects = [];

        for ($i = 0; $i < 5; $i++) {
            $projects[] = [
                'name' => $faker->sentence(2),
                'description' => $faker->paragraph(2),
                'created_by' => 1,
                'status' => $faker->randomElement(['pending', 'in_progress', 'completed']),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Project::insert($projects);

        ProjectUserRole::insert([
            ['project_id' => 1, 'user_id' => 1, 'role_id' => 1], 
            ['project_id' => 1, 'user_id' => 2, 'role_id' => 2], 
            ['project_id' => 1, 'user_id' => 3, 'role_id' => 3], 
            ['project_id' => 1, 'user_id' => 4, 'role_id' => 3], 
            ['project_id' => 1, 'user_id' => 5, 'role_id' => 3], 
            ['project_id' => 1, 'user_id' => 6, 'role_id' => 3], 
            ['project_id' => 1, 'user_id' => 7, 'role_id' => 3], 
            ['project_id' => 1, 'user_id' => 8, 'role_id' => 3], 
            ['project_id' => 1, 'user_id' => 9, 'role_id' => 4], 
            ['project_id' => 1, 'user_id' => 10, 'role_id' => 4], 
            ['project_id' => 1, 'user_id' => 11, 'role_id' => 4], 
            ['project_id' => 1, 'user_id' => 12, 'role_id' => 4], 
            ['project_id' => 1, 'user_id' => 13, 'role_id' => 4], 
            ['project_id' => 1, 'user_id' => 14, 'role_id' => 4], 
            ['project_id' => 1, 'user_id' => 15, 'role_id' => 4], 
            ['project_id' => 1, 'user_id' => 16, 'role_id' => 4], 
            ['project_id' => 1, 'user_id' => 17, 'role_id' => 4], 
            ['project_id' => 1, 'user_id' => 18, 'role_id' => 4], 
            ['project_id' => 1, 'user_id' => 19, 'role_id' => 4], 
            ['project_id' => 1, 'user_id' => 20, 'role_id' => 4], 
        ]);
    }
}
