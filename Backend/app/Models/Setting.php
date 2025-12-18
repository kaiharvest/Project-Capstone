<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'value',
        'pricing_rules'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'pricing_rules' => 'array', // Cast kolom pricing_rules sebagai array/JSON
    ];

    /**
     * Static method untuk mengambil nilai setting berdasarkan key
     */
    public static function get($key, $default = null) {
        $s = static::where('key', $key)->first();
        return $s ? $s->value : $default;
    }

    /**
     * Static method untuk mengambil aturan harga
     */
    public static function getPricingRules() {
        $setting = static::where('key', 'pricing_rules')->first();
        return $setting ? $setting->pricing_rules : null;
    }

    /**
     * Static method untuk menyimpan aturan harga
     */
    public static function setPricingRules($rules) {
        $setting = static::updateOrCreate(
            ['key' => 'pricing_rules'],
            ['pricing_rules' => $rules]
        );
        return $setting;
    }
}
