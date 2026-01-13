<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmbroiderySize extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'size_cm',
    ];
}
