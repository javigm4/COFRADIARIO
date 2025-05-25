<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User as Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use App\Notifications\RegisterNotification;


class AuthController extends Controller
{
    public function login(Request $request)
    {

        $user = Usuario::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }
        if (!empty($request->codigo) && $request->codigo === $user->codigo) {
            $rol = 'cofradia'; // Si el código ingresado coincide con el del usuario, es una cofradía
        } else {
            $rol = 'usuario'; // Si no se ha ingresiado código o es incorrecto, es un usuario
        }
        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'data' => [
                'accessToken' => $token,
                'toke_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'codigo' => $user->codigo,
                    'role' => $rol,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at
                ]
            ]
        ]);
    }





    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6'
        ]);

        // Crear un nuevo usuario
        $usuario = new Usuario();
        $usuario->email = $request->email;
        $usuario->name = $request->name;
        $usuario->password = Hash::make($request->password);

        // Generar un código aleatorio único
        do {
            $codigoAleatorio = rand(1111, 9999);
        } while (Usuario::where('codigo', $codigoAleatorio)->exists());

        $usuario->codigo = $codigoAleatorio;
        $usuario->save();

        // Enviar la notificación a tu correo personal
        Notification::route('mail', 'javierguerreromontero1@gmail.com')
            ->notify(new RegisterNotification($usuario));
    }


   public function logout(Request $request)
{
    if ($request->user()) {
        $request->user()->currentAccessToken()->delete(); // Revoca el token actual
        return response()->json(['message' => 'Sesión cerrada correctamente'], 200);
    } else {
        return response()->json(['error' => 'Usuario no autenticado'], 401);
    }
}


}
