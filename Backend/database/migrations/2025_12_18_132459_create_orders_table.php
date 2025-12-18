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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relasi ke user
            $table->enum('service_type', ['seragam', 'topi', 'emblem', 'jaket', 'tas']); // Jenis layanan bordir
            $table->enum('embroidery_type', ['3d', 'computer']); // Jenis bordir
            $table->decimal('size_cm', 8, 2); // Ukuran bordir dalam cm
            $table->integer('quantity'); // Jumlah pesanan
            $table->enum('shipping_method', ['jnt', 'jne']); // Ekspedisi pengiriman
            $table->text('shipping_address'); // Alamat pengiriman (diambil dari profil user)
            $table->integer('total_price'); // Total harga yang dihitung oleh sistem
            $table->enum('status', ['pending', 'processing', 'confirmed', 'cancelled'])->default('pending');
            $table->enum('order_type', ['now', 'cart'])->default('now'); // Pesan sekarang atau simpan ke keranjang
            $table->text('notes')->nullable(); // Catatan tambahan dari user
            $table->timestamps(); // created_at dan updated_at

            // Indeks untuk pencarian yang efisien
            $table->index('user_id');
            $table->index('status');
            $table->index('order_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
