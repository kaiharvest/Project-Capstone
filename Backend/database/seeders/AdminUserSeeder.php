<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
if (!User::where('email','admin@example.com')->exists()) {
User::create([
'name' => 'Admin',
'email' => 'admin@example.com',
'password' => bcrypt('password'),
'role' => 'admin',
]);
}
}
}