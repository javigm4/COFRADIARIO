<?php

namespace App\Http\Controllers;
use App\Models\Evento;
use App\Models\Cofradias;
use App\Models\Favoritos;

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
        $favoritos = Favoritos::all();
        $esCofradia = session('rol') === 'cofradia';
        $esUsuario = session('rol') === 'usuario';
        $usuario = Auth::user();
	return response()->json(['eventos' => $eventos, 'favoritos' => $favoritos, 'cofradias'=> $cofradias, 'esCofradia' => $esCofradia, 'esUsuario' => $esUsuario, 'usuario' => $usuario]);

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
        'cofradia' => 'required|integer|exists:cofradias,id',
        'fecha' => 'required|date',
        'hora' => 'required|date_format:H:i', // Asegura que la hora esté en formato HH:MM
    ]);

    $fechaCompleta = $request->fecha . ' ' . $request->hora;

    // Crear el evento en la base de datos
    Evento::create([
        'nombre' => $request->nombre,
        'cofradia' => $request->cofradia,
        'fecha' => $fechaCompleta, // Guardamos la fecha con la hora
    ]);

    // Redirigir después de crear el evento
    return redirect()->route('agenda')->with('status', 'Evento creado con éxito');
}

        public function update(Request $request, $id)
        {
            $evento = Evento::findOrFail($id); // Obtener el evento a actualizar

            // Validación de los datos del formulario
            $request->validate([
                'nombre' => 'required|string|max:255',
                'fecha_hora' => 'required|date',
                'cofradia' => 'required|string',
            ]);

            // Actualizar los datos del evento
            $evento->nombre = $request->nombre;
            $evento->fecha = $request->fecha_hora; // Asignamos el valor combinado de fecha y hora
            $evento->cofradia = $request->cofradia;
            $evento->save();

            return redirect()->route('agenda')->with('success', 'Evento actualizado exitosamente');
        }



        // ------ EDITAR EVENTO ------
        // Ruta para mostrar la vista de editar evento (GET)
        public function edit($id)
        {
            $evento = Evento::findOrFail($id);
            return view('editar', ['evento' => $evento]);
        }


}


















