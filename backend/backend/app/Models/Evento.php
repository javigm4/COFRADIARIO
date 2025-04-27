<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Cofradias;


class Evento extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'cofradia', 'fecha'];

    public function cofradia()
    {
        return $this->belongsTo(Cofradias::class, 'cofradia');
    }

}
