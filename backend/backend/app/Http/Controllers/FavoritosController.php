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
            return redirect()->route('agenda')->with('status', 'Evento añadido a favoritos con éxito');
    }


    public function destroy($id)
    {
        $favorito = Favoritos::find($id);

        if ($favorito) {
            $favorito->delete();
            return redirect()->route('agenda');
        } else {
            return redirect()->route('agenda');
        }
    }
}
