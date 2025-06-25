<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\ProjectUserRole;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Faker\Factory as Faker;


class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // User ID tersedia dari 1 sampai 20, tapi ID 1 khusus untuk role 1 (owner)
        $availableUserIds = range(2, 20); // exclude user_id 1 dari random

        $projects = [];
        $roleData = [];

        for ($i = 0; $i < 5; $i++) {
            $project = Project::create([
                'name' => $faker->sentence(2),
                'description' => $faker->paragraph(2),
                'created_by' => 1,
                'status' => $faker->randomElement(['pending', 'in_progress', 'completed']),
            ]);

            $projects[] = $project;

            // ROLE 1: Selalu user_id = 1
            $roleData[] = [
                'project_id' => $project->id,
                'user_id' => 1,
                'role_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Ambil 2 user unik untuk role 2 & 3 (exclude user_id 1)
            $coreUsers = Arr::random($availableUserIds, 2);
            $usedUserIds = [1, $coreUsers[0], $coreUsers[1]];

            $roleData[] = [
                'project_id' => $project->id,
                'user_id' => $coreUsers[0],
                'role_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $roleData[] = [
                'project_id' => $project->id,
                'user_id' => $coreUsers[1],
                'role_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Tambahkan 5 user acak lainnya untuk role 4, exclude yang sudah dipakai
            $remainingUserIds = array_diff($availableUserIds, $usedUserIds);
            $extraUsers = Arr::random($remainingUserIds, 5);

            foreach ($extraUsers as $userId) {
                $roleData[] = [
                    'project_id' => $project->id,
                    'user_id' => $userId,
                    'role_id' => 4,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('project_user_roles')->insert($roleData);
    }
}
