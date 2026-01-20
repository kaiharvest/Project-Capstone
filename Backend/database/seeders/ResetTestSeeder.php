<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

class ResetTestSeeder extends Seeder
{
    /**
     * Reset data for testing while preserving edit profile data.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        $tablesToTruncate = [
            'order_items',
            'transactions',
            'orders',
            'products',
            'password_reset_otps',
            'personal_access_tokens',
        ];

        foreach ($tablesToTruncate as $table) {
            if (Schema::hasTable($table)) {
                DB::table($table)->truncate();
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Keep admin user and remove others.
        User::where('role', '!=', 'admin')->delete();

        $this->call(AdminUserSeeder::class);
    }
}
