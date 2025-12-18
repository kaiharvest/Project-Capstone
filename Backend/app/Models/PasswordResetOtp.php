<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordResetOtp extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'otp',
        'expires_at',
        'used'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used' => 'boolean',
    ];
    
    /**
     * Fungsi untuk memeriksa apakah OTP masih berlaku
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
    
    /**
     * Fungsi untuk memeriksa apakah OTP valid (tidak expired dan belum digunakan)
     */
    public function isValid(): bool
    {
        return !$this->isExpired() && !$this->used;
    }
}