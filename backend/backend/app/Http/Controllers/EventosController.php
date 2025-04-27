<?php

namespace App\Http\Controllers;
use App\Models\Evento;
use App\Models\Cofradias;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $eventos = Evento::orderBy('fecha', 'asc')->get();
        $cofradias = Cofradias::all();
        $esCofradia = session('rol') === 'cofradia';
        $esUsuario = session('rol') === 'usuario';
        $usuario = Auth::user();
	return view('agenda', ['eventos' => $eventos, 'cofradias'=> $cofradias, 'esCofradia' => $esCofradia, 'esUsuario' => $esUsuario, 'usuario' => $usuario]);

    }


    public function destroy($id)
    {
        $evento = Evento::find($id);

        if ($evento) {
            $evento->delete();
            return redirect()->route('agenda');
        } else {
            return redirect()->route('agenda');
        }
    }



    public function store(Request $request)
{
    // Validar los datos enviados desde el formulario
    $request->validate([
        'nombre' => 'required|string|max:255',
        'cofradia' => 'required|integer|exists:cofradias,id', // Verifica que la Cofradía exista
        'fecha' => 'required|date',
    ]);

    // Crear el evento en la base de datos
    Evento::create($request->all());

    // Redirigir después de crear el evento
    return redirect()->route('agenda')->with('status', 'Evento creado con éxito');
}

}


















