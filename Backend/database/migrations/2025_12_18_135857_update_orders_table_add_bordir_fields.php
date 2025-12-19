<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Periksa apakah kolom sudah ada sebelum menambahkan
        $columnsToAdd = [
            'service_type',
            'embroidery_type',
            'size_cm',
            'quantity',
            'shipping_method',
            'shipping_address',
            'order_type',
            'notes'
        ];

        foreach ($columnsToAdd as $column) {
            $columnExists = DB::select("SHOW COLUMNS FROM orders LIKE '$column'");
            if (empty($columnExists)) {
                Schema::table('orders', function (Blueprint $table) use ($column) {
                    if ($column === 'service_type' || $column === 'embroidery_type' || $column === 'shipping_method' || $column === 'order_type') {
                        $table->string($column)->nullable();
                    } elseif ($column === 'size_cm') {
                        $table->decimal('size_cm', 8, 2)->nullable();
                    } elseif ($column === 'quantity') {
                        $table->integer('quantity')->nullable();
                    } elseif ($column === 'shipping_address') {
                        $table->text('shipping_address')->nullable();
                    } elseif ($column === 'notes') {
                        $table->text('notes')->nullable();
                    }
                });
            }
        }

        // Update enum status jika belum diupdate
        $statusColumn = DB::select("SHOW COLUMNS FROM orders WHERE Field = 'status'");
        if (!empty($statusColumn)) {
            $type = $statusColumn[0]->Type;

            // Cek apakah enum status sudah termasuk 'cart' dan 'confirmed'
            if (strpos($type, 'cart') === false || strpos($type, 'confirmed') === false) {
                // Update data lama sebelum mengganti enum status
                DB::statement("ALTER TABLE orders MODIFY COLUMN status VARCHAR(20) DEFAULT 'pending'");
                // Update semua status 'completed' ke 'confirmed' agar tidak hilang
                DB::table('orders')->where('status', 'completed')->update(['status' => 'confirmed']);

                // Ganti status column dengan enum baru
                DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'processing', 'confirmed', 'cancelled', 'cart') NOT NULL DEFAULT 'pending'");
            }
        } else {
            // Jika kolom status tidak ditemukan, buat dengan enum baru
            Schema::table('orders', function (Blueprint $table) {
                $table->enum('status', ['pending', 'processing', 'confirmed', 'cancelled', 'cart'])->default('pending');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Ganti dulu status 'confirmed' ke 'completed' agar konsisten dengan enum lama
        DB::statement("ALTER TABLE orders MODIFY COLUMN status VARCHAR(20) DEFAULT 'pending'");
        DB::table('orders')->where('status', 'confirmed')->update(['status' => 'completed']);

        // Hanya hapus kolom jika kolom tersebut ada
        $columnsToDrop = [
            'service_type',
            'embroidery_type',
            'size_cm',
            'quantity',
            'shipping_method',
            'shipping_address',
            'order_type',
            'notes'
        ];

        foreach ($columnsToDrop as $column) {
            $columnExists = DB::select("SHOW COLUMNS FROM orders LIKE ?", [$column]);
            if (!empty($columnExists)) {
                Schema::table('orders', function (Blueprint $table) use ($column) {
                    $table->dropColumn($column);
                });
            }
        }

        // Kembalikan kolom status ke enum asli
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'");
    }
};
