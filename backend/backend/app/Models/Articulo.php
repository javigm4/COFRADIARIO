<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
class Articulo extends Model
{
    use HasFactory;

    protected $table = 'articulos';

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_autor'); // id_autor referencia la clave primaria en usuarios
    }
}
