<?php
namespace App\Http\Controllers;

use App\Models\Favorito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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

    // Comprobamos si ya existe ese favorito
    $favoritoExistente = Favorito::where('id_usuario', $request->id_usuario)
                                ->where('id_evento', $request->id_evento)
                                ->first();

    if ($favoritoExistente) {
        return response()->json(['status' => 409, 'message' => 'Este evento ya está en tus favoritos'], 409);
    }

        Favorito::create($request->all());

        Log::info('Favorito añadido', [
            'status' => 200,
            'id_usuario' => $request->id_usuario,
            'id_evento' => $request->id_evento,
        ]);

            return response()->json(['status'=>200, 'message' => 'Favorito añadido correctamente'], 200);
        }


    public function destroy($id)
    {
        $favorito = Favorito::find($id);

        if ($favorito) {
            $favorito->delete();

            Log::info('Favorito eliminado', [
                'status' => 200,
                'favorito_id' => $id,
                'id_usuario' => $favorito->id_usuario,
                'id_evento' => $favorito->id_evento,
            ]);
            return response()->json(['message' => 'Favorito eliminado correctamente'], 200);
        } else {
        return response()->json(['message' => 'Favorito no encontrado'], 404);
        }
    }
}
