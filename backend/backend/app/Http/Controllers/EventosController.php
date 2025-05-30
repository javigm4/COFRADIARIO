<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use App\Models\Cofradias;
use App\Models\Favoritos;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
        $usuario = Auth::user();

        Log::info('Listado de eventos consultado', [
            'status' => 200,
            'count' => $eventos->count(),
        ]);

        return response()->json(['status'=> 200, 'eventos' => $eventos, 'favoritos' => $favoritos, 'cofradias' => $cofradias, 'usuario' => $usuario]);
    }


    public function destroy($id)
    {
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        $evento->delete();
        Log::info('Evento eliminado', [
            'status' => 200,
            'evento_id' => $id,
            'nombre' => $evento->nombre,
        ]);
        // Retornar respuesta JSON con código 200

        return response()->json(['message' => 'Evento eliminado correctamente'], 200);
    }




    public function store(Request $request)
    {

        // Validar los datos enviados desde el formulario
        $request->validate([
            'nombre' => 'required|string|max:255',
            'cofradia' => 'required|integer|exists:cofradias,id',
            'fecha' => 'required|date',
            'hora' => 'required|date_format:H:i', // Asegura que la hora e  sté en formato HH:MM
        ]);

        $fechaCompleta = $request->fecha . ' ' . $request->hora;

        // Crear el evento en la base de datos
       $evento = Evento::create([
            'nombre' => $request->nombre,
            'cofradia' => $request->cofradia,
            'fecha' => $fechaCompleta, // Guardamos la fecha con la hora
        ]);

        Log::info('Evento creado', [
            'status' => 201,
            'evento_id' => $evento->id,
            'nombre' => $evento->nombre,
            'cofradia' => $evento->cofradia,
            'fecha' => $evento->fecha,
        ]);

                // Retornar respuesta JSON con código 201
        return response()->json([
            'message' => 'Evento creado con éxito',
            'evento'  => $evento
        ], 201);
    }

    public function update(Request $request, $id)
    {
        //encontramos el evento por su id
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        // Validar los datos recibidos
        $request->validate([
            'nombre' => 'required|string|max:255',
            'cofradia' => 'required|integer|exists:cofradias,id',
            'fecha' => 'required|date',
        ]);

        // Actualizar los datos del evento
        $evento->update([
            'nombre' => $request->nombre,
            'cofradia' => $request->cofradia,
            'fecha' => $request->fecha,
        ]);

        Log::info('Evento actualizado', [
            'status' => 200,
            'evento_id' => $evento->id,
            'nombre' => $evento->nombre,
            'cofradia' => $evento->cofradia,
            'fecha' => $evento->fecha,
        ]);

        return response()->json(['message' => 'Evento actualizado correctamente', 'evento' => $evento], 200);
    }



    // ------ EDITAR EVENTO ------
    // Ruta para mostrar la vista de editar evento (GET)
    public function edit($id)
    {
        $evento = Evento::findOrFail($id);
        return view('editar', ['evento' => $evento]);
    }



    // ------ OBTENER UN EVENTO POR SU ID ------
    public function show($id)
    {
        $evento = Evento::find($id);
        if (!$evento) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }
        return response()->json($evento, 200);
    }
}
