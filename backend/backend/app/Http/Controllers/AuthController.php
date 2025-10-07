<?php

namespace App\Http\Controllers;

use App\Notifications\ResetPasswordNotifications;
use App\Services\BrevoMailer;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User as Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use App\Notifications\RegisterNotification;
use App\Notifications\ContactoNotification;
use App\Services\ZohoMailer;
use Illuminate\Support\Facades\Log; // Importar la clase Log para registrar información
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

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
            'status' => 200,
            'usuario' => $user->name,
            'email' => $user->email,
            'rol' => $rol,
        ]);


        return response()->json([
            'data' => [
                'accessToken' => $token,
                'token_type' => 'Bearer',
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




    /**
     * 
     * 
     * 
     * @param \Illuminate\Http\Request $request
     * @param \App\Services\ZohoMailer $mailer
     * @return \Illuminate\Http\JsonResponse
     */

    /* ------- BREVOMAILER ----*/


    public function register(Request $request, ZohoMailer $mailer)
    {
        try {
            $request->validate([
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:6|confirmed', // <- agrega confirmed
                'name' => 'required|string|max:255|unique:users,name',
            ]);

            $usuario = new Usuario();
            $usuario->email = $request->email;
            $usuario->name = $request->name;
            $usuario->password = Hash::make($request->password);

            do {
                $codigoAleatorio = rand(1111, 9999);
            } while (Usuario::where('codigo', $codigoAleatorio)->exists());

            $usuario->codigo = $codigoAleatorio;
            $usuario->save();

            $html = "
            <h1>Nuevo registro de usuario</h1>
            <p>Nombre: {$usuario->name}</p>
            <p>Email: {$usuario->email}</p>
            <p>Código: {$usuario->codigo}</p>
            <p>Gracias por registrarte en nuestra plataforma.</p>
        ";

            $mailer->sendEmail(
                'cofradiariodemalaga@gmail.com',
                'Registro nuevo',
                'Nuevo registro de usuario',
                $html
            );

            return response()->json(['message' => 'Usuario registrado con éxito'], 201);
        } catch (ValidationException $ve) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $ve->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error en el registro',
                'error' => $e->getMessage()
            ], 500);
        }
    }








    public function enviarMensajeContacto(Request $request, ZohoMailer $mailer)
    {
        $request->validate([
            'nombre' => 'required',
            'email' => 'required|email',
            'mensaje' => 'required'
        ]);


        // Enviar correo usando BrevoMailer
        $html = "
        <h1>Nuevo mensaje de contacto</h1>
        <p><strong>Nombre:</strong> {$request->nombre}</p>
        <p><strong>Email:</strong> {$request->email}</p>
        <p><strong>Mensaje:</strong> {$request->mensaje}</p> 
    ";

        $mailer->sendEmail(
            'cofradiariodemalaga@gmail.com', // tu correo
            'Mensaje nuevo',                     // tu nombre
            'Nuevo mensaje de contacto',         // asunto
            $html
        );

        return response()->json(['message' => 'Mensaje enviado correctamente'], 200);
    }


    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete(); // Revoca el token actual

            Log::info('Usuario deslogeado: ', [
                'status' => 200,
                'usuario' => $request->user()->name,
                'email' => $request->user()->email,
            ]);
            return response()->json(['message' => 'Sesión cerrada correctamente'], 200);
        } else {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }
    }

    public function sendResetLinkEmail(Request $request, ZohoMailer $mailer)
    {
        $request->validate(['email' => 'required|email']); //Valida el email

        $user = Usuario::where('email', $request->email)->first(); //Obtiene el usuario cuyo email se ha introducido    

        if (!$user) {
            return response()->json(['message' => 'No se encontró ningún usuario con ese email'], 404);
        }

        $token = app('auth.password.broker')->createToken($user); //Creo un token único y temporal y lo mete en la tabla de passwords resets

        $resetUrl = env('FRONTEND_URL') . "/reset-password?token={$token}&email={$user->email}"; //creo un enlace con el token personal (cada persona tiene un enlace diferente) y se envia por correo
        // Contenido del correo
        $html = "
        <h1>Restablecer contraseña</h1>
        <p>Hola {$user->name},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href='{$resetUrl}'>Restablecer contraseña</a>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        ";

        $enviado = $mailer->sendEmail(
            $user->email,
            $user->name,
            'Restablecer contraseña',
            $html
        );
        //se envia el correo 

        if ($enviado) {
            return response()->json(['message' => 'Correo de recuperación enviado correctamente'], 200);
        } else {
            return response()->json(['message' => 'Error al enviar el correo'], 500);
        }
    }

    public function resetPassword(Request $request, ZohoMailer $mailer)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:6',
        ]);

        //Iba hacerlo por medio de if  (if(request->token == user-> token ligado a la tabla de password_resets), pero por lo visto ya se hace solo con el Password:reset)

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        ); //Se resetea la contraseña

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Contraseña cambiada correctamente'], 200);
        } else {
            return response()->json(['message' => 'Error al cambiar contraseña'], 400);
        }
    }
}
