<?php

namespace App\Http\Controllers;

use App\Models\Articulo;
use App\Models\User;
use Illuminate\Http\Request;

class ArticulosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $articulos = Articulo::all();
        $usuarios = User::all();
        return response()->json(['articulos' => $articulos, 'usuarios' => $usuarios]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\articulos  $articulos
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $articulo = Articulo::find($id);

        if (!$articulo) {
            return response()->json(['message' => 'Artículo no encontrado'], 404);
        }

        return response()->json($articulo);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\articulos  $articulos
     * @return \Illuminate\Http\Response
     */
    public function edit(Articulo $articulos)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\articulos  $articulos
     * @return \Illuminate\Http\Response
     */


    public function update(Request $request, $id)
    {
        $articulo = Articulo::find($id);

        if (!$articulo) {
            return response()->json(['message' => 'Artículo no encontrado'], 404);
        }

        // Asegúrate de usar los nombres correctos de columnas
        $articulo->titular = $request->input('titular'); // Antes ponías 'titulo'
        $articulo->cuerpo = $request->input('cuerpo');

        $articulo->save(); // Esto actualizará `updated_at` automáticamente

        return response()->json(['message' => 'Artículo actualizado correctamente']);
    }



    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\articulos  $articulos
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $evento = Articulo::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Articulo no encontrado'], 404);
        }

        $evento->delete();

        return response()->json(['message' => 'Articulo eliminado correctamente'], 200);
    }
}
