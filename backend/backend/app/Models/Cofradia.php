<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cofradia extends Model
{
    use HasFactory;
    protected $fillable = ['nombre'];

    public function eventos()
    {
        return $this->hasMany(Evento::class, 'cofradia'); // 'cofradia' es la FK en eventos
    }
}
