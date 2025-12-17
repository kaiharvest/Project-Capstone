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
       Schema::create('products', function (Blueprint $table) {
$table->id();
$table->string('name');
$table->string('image')->nullable();
$table->string('category')->nullable();
$table->integer('price');
$table->integer('stock')->default(0);
$table->text('description')->nullable();
$table->timestamps();
});

Schema::create('orders', function (Blueprint $table) {
$table->id();
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
$table->enum('status', ['pending','processing','completed','cancelled'])->default('pending');
$table->integer('total_price')->default(0);
$table->string('proof_image')->nullable(); // bukti transfer
$table->timestamps();
});

Schema::create('order_items', function (Blueprint $table) {
$table->id();
$table->foreignId('order_id')->constrained()->cascadeOnDelete();
$table->foreignId('product_id')->constrained()->cascadeOnDelete();
$table->integer('quantity');
$table->integer('price');
$table->timestamps();
});

Schema::create('transactions', function (Blueprint $table) {
$table->id();
$table->foreignId('order_id')->constrained()->cascadeOnDelete();
$table->enum('payment_method', ['transfer','cash','ewallet'])->default('transfer');
$table->enum('status', ['pending','paid','failed'])->default('pending');
$table->timestamp('paid_at')->nullable();
$table->timestamps();
});

Schema::create('settings', function (Blueprint $table) {
$table->id();
$table->string('key')->unique();
$table->text('value')->nullable();
$table->timestamps();
});


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('settings');

    }
};
