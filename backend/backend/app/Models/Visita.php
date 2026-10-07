<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visita extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'ruta',
    ];
}
