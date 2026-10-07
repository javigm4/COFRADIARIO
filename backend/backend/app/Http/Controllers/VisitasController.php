<?php

namespace App\Http\Controllers;

use App\Models\Visita;
use Illuminate\Http\Request;

class VisitasController extends Controller
{
    /** Registra una visita a una página del sitio (usada por el frontend en cada navegación) */
    public function registrar(Request $request)
    {
        $request->validate([
            'ruta' => 'nullable|string|max:255',
        ]);

        Visita::create(['ruta' => $request->ruta]);

        return response()->json(['ok' => true]);
    }
}
