<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'order_number', // nomor pemesanan unik
        'service_type',
        'embroidery_type',
        'size_cm',
        'quantity',
        'shipping_method',
        'shipping_address',
        'total_price',
        'status',
        'order_type',
        'notes',
        'proof_image', // untuk bukti pembayaran (lama)
        'design_image_path', // untuk menyimpan path gambar desain bordir dari user
        'payment_proof_path', // bukti pembayaran baru
        'payment_proof_uploaded_at', // waktu upload bukti pembayaran
        'payment_status' // status verifikasi pembayaran
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'size_cm' => 'decimal:2',
        'total_price' => 'integer',
        'quantity' => 'integer',
        'payment_proof_uploaded_at' => 'datetime',
    ];

    /**
     * Boot the model to set the order number automatically
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->order_number = static::generateUniqueOrderNumber();
        });
    }

    /**
     * Generate a unique order number
     */
    public static function generateUniqueOrderNumber()
    {
        $prefix = 'ORD';
        $timestamp = now()->format('Ymd');
        $random = str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);

        $orderNumber = $prefix . $timestamp . $random;

        // Ensure uniqueness
        while (self::where('order_number', $orderNumber)->exists()) {
            $random = str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
            $orderNumber = $prefix . $timestamp . $random;
        }

        return $orderNumber;
    }

    /**
     * Relasi ke model User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke model OrderItem
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Relasi ke model Transaction
     */
    public function transaction()
    {
        return $this->hasOne(Transaction::class);
    }

    /**
     * Get the payment proof URL
     */
    public function getPaymentProofUrlAttribute()
    {
        return $this->payment_proof_path ? asset('storage/' . $this->payment_proof_path) : null;
    }
}
