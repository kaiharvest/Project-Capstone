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
            $table->string('order_number')->unique()->nullable(); // Tambahkan kolom order_number
        });

        // Generate order number for existing orders
        \App\Models\Order::chunk(100, function ($orders) {
            foreach ($orders as $order) {
                if (empty($order->order_number)) {
                    $order->order_number = \App\Models\Order::generateUniqueOrderNumber();
                    $order->save();
                }
            }
        });

        // Set kolom order_number menjadi tidak nullable setelah semua data terisi
        Schema::table('orders', function (Blueprint $table) {
            $table->string('order_number')->nullable(false)->change(); // Jadikan tidak nullable
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            //
        });
    }
};
