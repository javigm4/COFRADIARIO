<?php

namespace App\Http\Controllers;

use App\Models\Cofradia;
use App\Models\Evento;
use App\Services\ZohoMailer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Importar la clase Log para registrar información
class CofradiasController extends Controller
{

    public function index()
    {
        $cofradias = Cofradia::withCount('eventos')
            ->whereDoesntHave('user', function ($q) {
                $q->where('is_admin', true);
            })
            ->get();

        return response()->json($cofradias);
    }

    /** Ficha pública de una cofradía: datos + próximos eventos */
    public function perfil($id)
    {
        $cofradia = Cofradia::withCount('eventos')
            ->whereDoesntHave('user', function ($q) {
                $q->where('is_admin', true);
            })
            ->find($id);

        if (!$cofradia) {
            return response()->json(['message' => 'Cofradía no encontrada'], 404);
        }

        $proximosEventos = Evento::where('cofradia', $cofradia->id)
            ->where('fecha', '>=', now())
            ->orderBy('fecha')
            ->get();

        return response()->json([
            'cofradia' => $cofradia,
            'proximos_eventos' => $proximosEventos,
        ]);
    }

    /** Formulario de contacto de la ficha de una cofradía */
    public function contacto($id, Request $request, ZohoMailer $mailer)
    {
        $cofradia = Cofradia::find($id);
        if (!$cofradia) {
            return response()->json(['message' => 'Cofradía no encontrada'], 404);
        }

        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email',
            'mensaje' => 'required|string|max:2000',
        ]);

        $destino = $cofradia->email_contacto ?: $cofradia->user?->email;
        if (!$destino) {
            return response()->json(['message' => 'Esta cofradía no tiene un correo de contacto configurado.'], 422);
        }

        $html = "
        <h1>Nuevo mensaje desde tu ficha en Cofradiario</h1>
        <p><strong>Nombre:</strong> {$request->nombre}</p>
        <p><strong>Email de respuesta:</strong> {$request->email}</p>
        <p><strong>Mensaje:</strong> {$request->mensaje}</p>
        ";

        $mailer->sendEmail($destino, $cofradia->nombre, "Mensaje de contacto — {$cofradia->nombre}", $html);

        return response()->json(['message' => 'Mensaje enviado correctamente']);
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
