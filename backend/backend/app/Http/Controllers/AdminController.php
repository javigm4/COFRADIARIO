<?php

namespace App\Http\Controllers;

use App\Models\Cofradia;
use App\Models\Evento;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // ─────────────────────────────────────────────
    //  ESTADÍSTICAS
    // ─────────────────────────────────────────────

    public function estadisticas()
    {
        $ahora = now();
        $inicioMes = $ahora->copy()->startOfMonth();
        $inicioSemana = $ahora->copy()->startOfWeek(\Carbon\Carbon::MONDAY);

        $totalUsuarios = User::count();
        $totalCofradias = Cofradia::count();
        $conCofradia = User::where('role', 'cofradia')->count();
        $nuevosMes = User::where('created_at', '>=', $inicioMes)->count();
        $nuevosSemana = User::where('created_at', '>=', $inicioSemana)->count();
        $totalEventos = Evento::count();

        $provincias = Cofradia::selectRaw('provincia, COUNT(*) as total')
            ->whereNotNull('provincia')
            ->groupBy('provincia')
            ->orderByDesc('total')
            ->get()
            ->map(fn($p) => ['nombre' => $p->provincia, 'total' => (int) $p->total]);

        return response()->json([
            'cofradias' => ['total' => $totalCofradias],
            'eventos' => ['total' => $totalEventos],
            'usuarios' => [
                'total' => $totalUsuarios,
                'con_cofradia' => $conCofradia,
                'aficionados' => $totalUsuarios - $conCofradia,
                'nuevos_mes' => $nuevosMes,
                'nuevos_semana' => $nuevosSemana,
            ],
            'provincias' => $provincias,
            'fecha' => $ahora->format('d/m/Y'),
        ]);
    }

    // ─────────────────────────────────────────────
    //  COFRADÍAS
    // ─────────────────────────────────────────────

    public function cofradias()
    {
        return Cofradia::with('user:id,name,email')
            ->withCount('eventos')
            ->orderBy('nombre')
            ->get();
    }

    public function crearCofradia(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'localidad' => 'nullable|string|max:255',
            'provincia' => 'nullable|string|max:100',
            'historia' => 'nullable|string',
            'escudo_url' => 'nullable|string|max:500',
            'titulares' => 'nullable|array',
            'titulares.*.nombre' => 'nullable|string|max:255',
            'titulares.*.foto_url' => 'nullable|string|max:500',
            'direccion' => 'nullable|string|max:255',
            'parroquia' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'facebook' => 'nullable|string|max:255',
            'youtube' => 'nullable|string|max:255',
            'video_url' => 'nullable|string|max:500',
            'telefono' => 'nullable|string|max:30',
            'email_contacto' => 'nullable|email|max:255',
        ]);

        $cofradia = Cofradia::create(array_merge($data, ['activa' => true]));

        return response()->json($cofradia, 201);
    }

    public function editarCofradia(Request $request, Cofradia $cofradia)
    {
        $data = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'localidad' => 'nullable|string|max:255',
            'provincia' => 'nullable|string|max:100',
            'historia' => 'nullable|string',
            'escudo_url' => 'nullable|string|max:500',
            'titulares' => 'nullable|array',
            'titulares.*.nombre' => 'nullable|string|max:255',
            'titulares.*.foto_url' => 'nullable|string|max:500',
            'direccion' => 'nullable|string|max:255',
            'parroquia' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'facebook' => 'nullable|string|max:255',
            'youtube' => 'nullable|string|max:255',
            'video_url' => 'nullable|string|max:500',
            'telefono' => 'nullable|string|max:30',
            'email_contacto' => 'nullable|email|max:255',
            'activa' => 'boolean',
        ]);

        $cofradia->update($data);

        return response()->json($cofradia->fresh('user'));
    }

    public function eliminarCofradia(Cofradia $cofradia)
    {
        if ($cofradia->eventos()->count() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar la cofradía porque tiene eventos asociados'
            ], 400);
        }

        $cofradia->delete();

        return response()->json(['ok' => true]);
    }

    /** Vincular un usuario registrado a una cofradía */
    public function vincularUsuario(Request $request, Cofradia $cofradia)
    {
        $request->validate([
            'id_user' => 'required|exists:users,id',
        ]);

        // Desvincula si ese usuario ya tenía otra cofradía
        Cofradia::where('id_user', $request->id_user)
            ->where('id', '!=', $cofradia->id)
            ->update(['id_user' => null]);

        $cofradia->update(['id_user' => $request->id_user]);
        User::where('id', $request->id_user)->update(['role' => 'cofradia']);

        return response()->json($cofradia->fresh('user'));
    }

    /** Desvincular usuario de una cofradía */
    public function desvincularUsuario(Cofradia $cofradia)
    {
        if ($cofradia->id_user) {
            User::where('id', $cofradia->id_user)->update(['role' => 'usuario']);
        }
        $cofradia->update(['id_user' => null]);

        return response()->json($cofradia->fresh());
    }

    /** Listar usuarios sin cofradía vinculada aún, para el selector de vinculación */
    public function usuariosSinCofradia()
    {
        $vinculados = Cofradia::whereNotNull('id_user')->pluck('id_user');

        return User::whereNotIn('id', $vinculados)
            ->select('id', 'name', 'email', 'role')
            ->orderBy('name')
            ->get();
    }

    /**
     * Convertir una cuenta de usuario normal en cofradía (crea su ficha) o, si ya lo es,
     * quitarle el rol (borra la ficha si no tiene eventos). Control total del admin sobre
     * quién puede publicar eventos, sin depender de lo que el usuario eligiera al registrarse.
     */
    public function toggleCofradia(User $usuario)
    {
        if ($usuario->role === 'cofradia') {
            $cofradia = Cofradia::where('id_user', $usuario->id)->first();
            if ($cofradia && $cofradia->eventos()->count() > 0) {
                return response()->json([
                    'message' => 'Esta cofradía tiene eventos asociados. Elimínalos antes de quitarle el rol.'
                ], 422);
            }
            if ($cofradia) {
                $cofradia->delete();
            }
            $usuario->update(['role' => 'usuario']);
            return response()->json(['usuario' => $usuario, 'cofradia_eliminada' => true]);
        }

        $usuario->update(['role' => 'cofradia']);

        // Si ya existe una ficha sin vincular con el mismo nombre (dato heredado
        // de antes de este sistema de cuentas), la reutilizamos en vez de crear
        // una ficha duplicada y perder sus eventos/datos ya cargados.
        $cofradia = Cofradia::whereNull('id_user')->where('nombre', $usuario->name)->first();
        if ($cofradia) {
            $cofradia->update(['id_user' => $usuario->id]);
        } else {
            $cofradia = Cofradia::firstOrCreate(
                ['id_user' => $usuario->id],
                ['nombre' => $usuario->name, 'activa' => true]
            );
        }

        return response()->json(['usuario' => $usuario, 'cofradia' => $cofradia]);
    }

    // ─────────────────────────────────────────────
    //  MI COFRADÍA (autoedición por la propia cofradía)
    // ─────────────────────────────────────────────

    public function miCofradia(Request $request)
    {
        $cofradia = Cofradia::where('id_user', $request->user()->id)->first();
        if (!$cofradia) {
            return response()->json(['message' => 'No tienes una cofradía vinculada.'], 404);
        }
        return response()->json($cofradia);
    }

    public function actualizarMiCofradia(Request $request)
    {
        $cofradia = Cofradia::where('id_user', $request->user()->id)->first();
        if (!$cofradia) {
            return response()->json(['message' => 'No tienes una cofradía vinculada.'], 404);
        }

        $data = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'localidad' => 'nullable|string|max:255',
            'provincia' => 'nullable|string|max:100',
            'historia' => 'nullable|string',
            'escudo_url' => 'nullable|string|max:500',
            'titulares' => 'nullable|array',
            'titulares.*.nombre' => 'nullable|string|max:255',
            'titulares.*.foto_url' => 'nullable|string|max:500',
            'direccion' => 'nullable|string|max:255',
            'parroquia' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'facebook' => 'nullable|string|max:255',
            'youtube' => 'nullable|string|max:255',
            'video_url' => 'nullable|string|max:500',
            'telefono' => 'nullable|string|max:30',
            'email_contacto' => 'nullable|email|max:255',
        ]);

        $cofradia->update($data);

        return response()->json($cofradia->fresh());
    }
}
