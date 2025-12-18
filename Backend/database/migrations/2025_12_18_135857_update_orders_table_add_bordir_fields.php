<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Menambahkan kolom-kolom yang diperlukan untuk fitur pemesanan bordir
            $table->string('service_type')->nullable(); // Jenis layanan bordir
            $table->string('embroidery_type')->nullable(); // Jenis bordir
            $table->decimal('size_cm', 8, 2)->nullable(); // Ukuran bordir dalam cm
            $table->integer('quantity')->nullable(); // Jumlah pesanan
            $table->string('shipping_method')->nullable(); // Ekspedisi pengiriman
            $table->text('shipping_address')->nullable(); // Alamat pengiriman
            $table->string('order_type')->default('now'); // Pesan sekarang atau simpan ke keranjang
            $table->text('notes')->nullable(); // Catatan tambahan dari user

            // Update kolom status dengan enum yang sesuai
            $table->enum('status', ['pending', 'processing', 'confirmed', 'cancelled', 'cart'])->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Menghapus kolom-kolom yang ditambahkan
            $table->dropColumn([
                'service_type',
                'embroidery_type',
                'size_cm',
                'quantity',
                'shipping_method',
                'shipping_address',
                'order_type',
                'notes'
            ]);

            // Kembalikan kolom status ke enum asli
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending')->change();
        });
    }
};
