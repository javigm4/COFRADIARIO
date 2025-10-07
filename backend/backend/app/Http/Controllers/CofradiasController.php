<?php

namespace App\Http\Controllers;

use App\Models\Cofradia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Importar la clase Log para registrar información
class CofradiasController extends Controller
{

    public function index()
    {
        $cofradias = Cofradia::all();


        return response()->json($cofradias);
    }



    public function mostrar($nombre)
    {
        // Obtener datos de la base de datos
        $cofradia = Cofradia::where('nombre', $nombre)->first();
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

        Log::info('Cofradía consultada', [
            'status' => 200,
            'nombre' => $cofradia->nombre,
        ]);

        return response()->json([
            'cofradia' => $cofradia,
            'texto' => $texto,
            'imagenes' => $imagenes
        ]);
    }






    public function store(Request $request)
    {


        // Validar los datos enviados desde el formulario
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        // Crear el evento en la base de datos
        $cofradia = Cofradia::create([
            'nombre' => $request->nombre,

        ]);


        return response()->json([
            'message' => 'Cofradia creada con éxito',
            'cofradia'  => $cofradia
        ], 201);
    }






    public function destroy($id)
    {
        $cofradia = Cofradia::find($id);

        if (!$cofradia) {
            return response()->json(['message' => 'Cofradia no encontrada'], 404);
        }

        // Revisar si tiene eventos asociados
        if ($cofradia->eventos()->count() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar la cofradía porque tiene eventos asociados'
            ], 400); // Bad Request
        }

        $cofradia->delete();

        Log::info('Cofradia eliminada', [
            'status' => 200,
            'cofradia_id' => $id,
            'nombre' => $cofradia->nombre,
        ]);

        return response()->json(['message' => 'Cofradia eliminada correctamente'], 200);
    }
}
