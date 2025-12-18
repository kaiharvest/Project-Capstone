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
        'proof_image' // untuk bukti pembayaran
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
    ];

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
}
