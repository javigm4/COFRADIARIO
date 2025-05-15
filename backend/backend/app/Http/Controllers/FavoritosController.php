<?php

namespace App\Http\Controllers;

use App\Models\favoritos;
use Illuminate\Http\Request;

class FavoritosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

     /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(Request $request)
    {
        $request->validate([
            'id_usuario' => 'required|integer|exists:users,id', // Verifica que el usuario exista
            'id_evento' => 'required|integer|exists:eventos,id', // Verifica que el evento exista
        ]);
        Favoritos::create($request->all());
            return response()->json(['message' => 'Favorito añadido correctamente'], 200);
        }


    public function destroy($id)
    {
        $favorito = Favoritos::find($id);

        if ($favorito) {
            $favorito->delete();
            return response()->json(['message' => 'Favorito eliminado correctamente'], 200);
        } else {
        return response()->json(['message' => 'Favorito no encontrado'], 404);
        }
    }
}
