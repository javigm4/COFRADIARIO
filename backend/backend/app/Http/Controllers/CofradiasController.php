<?php

namespace App\Http\Controllers;

use App\Models\cofradias;
use Illuminate\Http\Request;

class CofradiasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
   public function index()
{
    $cofradias = Cofradias::all();
    return response()->json($cofradias);
}



public function mostrar($nombre)
{
    // Obtener datos de la base de datos
    $cofradia = Cofradias::where('nombre', $nombre)->first();
    if (!$cofradia) {
        return response()->json(['message' => 'Cofradía no encontrada'], 404);
    }

    // Ajustar nombre carpeta con guiones
    $nombreCarpeta = strtoupper(str_replace(' ', '-', $nombre));
    $carpeta = public_path("storage/cofradiasDatos/" . $nombreCarpeta);

    $texto = file_exists("$carpeta/info.txt") ? file_get_contents("$carpeta/info.txt") : 'Información no disponible.';

    $imagenes = array_values(array_filter(scandir($carpeta), function ($archivo) {
        return preg_match('/\\.(jpg|jpeg|png|gif)$/i', $archivo);
    }));

    return response()->json([
        'cofradia' => $cofradia,
        'texto' => $texto,
        'imagenes' => $imagenes
    ]);
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
     * @param  \App\Models\cofradias  $cofradias
     * @return \Illuminate\Http\Response
     */
    public function show(cofradias $cofradias)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\cofradias  $cofradias
     * @return \Illuminate\Http\Response
     */
    public function edit(cofradias $cofradias)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\cofradias  $cofradias
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, cofradias $cofradias)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\cofradias  $cofradias
     * @return \Illuminate\Http\Response
     */
    public function destroy(cofradias $cofradias)
    {
        //
    }
}
