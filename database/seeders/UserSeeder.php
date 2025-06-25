<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        User::insert([
            [
                'name' => 'Afif Rohul',
                'email' => 'afif@example.com',
                'password' => \Hash::make('password')
            ]
        ]);

        $users = [];

        for ($i = 0; $i < 50; $i++) {
            $users[] = [
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => \Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        User::insert($users);
    }
}
