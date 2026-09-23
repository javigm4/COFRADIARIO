<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cofradia extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombre',
        'id_user',
        'localidad',
        'provincia',
        'escudo_url',
        'historia',
        'titulares',
        'direccion',
        'parroquia',
        'instagram',
        'facebook',
        'youtube',
        'video_url',
        'telefono',
        'email_contacto',
        'activa',
    ];

    protected $casts = [
        'activa' => 'boolean',
        'titulares' => 'array',
    ];

    public function eventos()
    {
        return $this->hasMany(Evento::class, 'cofradia'); // 'cofradia' es la FK en eventos
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
