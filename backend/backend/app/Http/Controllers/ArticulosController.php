<?php

namespace App\Http\Controllers;

use App\Models\Articulo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

class ArticulosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        try {
            $articulos = Articulo::all();
            $usuarios = User::all();

            return response()->json([
                'status' => 200,
                'articulos' => $articulos,
                'usuarios' => $usuarios
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error al obtener los artículos'
            ], 500);
        }
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
        // Validar los datos antes de guardarlos
        $request->validate([
            'titular' => 'required|string|max:255',
            'cuerpo' => 'required|string',
            'id_autor' => 'required|exists:users,id', // Asegura que el autor existe
        ]);

        // Crear el artículo con los datos recibidos
        $articulo = Articulo::create([
            'titular' => $request->input('titular'),
            'cuerpo' => $request->input('cuerpo'),
            'id_autor' => $request->input('id_autor'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

            Log::info('Articulo creado', [
                    'status'=>200,
                    'titular' => $articulo->titular,
                ]);


        return response()->json(['message' => 'Artículo creado con éxito', 'articulo' => $articulo], 201);
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

         Log::info('Articulo modificado: ', [
                    'status'=>200,
                    'titular' => $articulo->titular,
                ]);


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
        $articulo = Articulo::find($id);

        if (!$articulo) {
            return response()->json(['message' => 'Articulo no encontrado'], 404);
        }

        $articulo->delete();

         Log::info('Articulo borrado', [
                    'status'=>200,
                    'titular' => $articulo->titular,
                ]);

        return response()->json(['message' => 'Articulo eliminado correctamente'], 200);
    }
}
