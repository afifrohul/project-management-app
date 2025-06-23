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
        User::insert([
            [
                'name' => 'Afif',
                'email' => 'afif@example.com',
                'password' => \Hash::make('password')
            ],
            [
                'name' => 'Rina',
                'email' => 'rina@example.com',
                'password' => \Hash::make('password')
            ],
            [
                'name' => 'Budi',
                'email' => 'budi@example.com',
                'password' => \Hash::make('password')
            ],
        ]);
    }
}
