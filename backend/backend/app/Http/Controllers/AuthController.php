<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User as Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use App\Notifications\RegisterNotification;
use App\Notifications\ContactoNotification;
use Illuminate\Support\Facades\Log; // Importar la clase Log para registrar información

class AuthController extends Controller
{
    public function login(Request $request)
    {

        $user = Usuario::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

         if (!empty($request->codigo) && $request->codigo !== $user->codigo) {
        return response()->json(['error' => 'Código incorrecto'], 403);
    }
        if (!empty($request->codigo) && $request->codigo === $user->codigo) {
            $rol = 'cofradia'; // Si el código ingresado coincide con el del usuario, es una cofradía
        } else {
            $rol = 'usuario'; // Si no se ha ingresiado código o es incorrecto, es un usuario
        }
        $token = $user->createToken('authToken')->plainTextToken;


         Log::info('Usuario logeado: ', [
                    'status'=>200,
                    'usuario' => $user->name,
                    'email' => $user->email,
                    'rol' => $rol,
                ]);


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

         Log::info('Usuario registrado: ', [
                    'status'=>200,
                    'usuario' => $usuario->name,
                    'email' => $usuario->email,
                    'rol' => $usuario->rol,
                ]);

        // Enviar la notificación a tu correo personal
        Notification::route('mail', 'javierguerreromontero1@gmail.com')
            ->notify(new RegisterNotification($usuario));
    }


    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete(); // Revoca el token actual

            Log::info('Usuario deslogeado: ', [
                'status'=>200,
                'usuario' => $request->user()->name,
                'email' => $request->user()->email,
            ]);
            return response()->json(['message' => 'Sesión cerrada correctamente'], 200);
        } else {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }
    }

    public function enviarMensajeContacto(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'email' => 'required|email',
            'mensaje' => 'required'
        ]);


            Log::info("Nuevo mensaje de contacto enviado", [
                    'nombre' => $request->nombre,
                    'email' => $request->email,
                    'mensaje' => $request->mensaje
                ]);
        // Enviar la notificación al correo deseado
        Notification::route('mail', 'javierguerreromontero1@gmail.com')
            ->notify(new ContactoNotification($request->nombre, $request->email, $request->mensaje));

        return response()->json(['message' => 'Mensaje enviado correctamente'], 200);
    }
}
