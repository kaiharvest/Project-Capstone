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
            $table->string('payment_proof_path')->nullable()->after('design_image_path'); // Menyimpan path bukti pembayaran
            $table->timestamp('payment_proof_uploaded_at')->nullable()->after('payment_proof_path'); // Waktu upload bukti pembayaran
            $table->enum('payment_status', ['pending', 'verified', 'rejected'])->default('pending')->after('payment_proof_path'); // Status verifikasi pembayaran
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_proof_path', 'payment_proof_uploaded_at', 'payment_status']);
        });
    }
};
