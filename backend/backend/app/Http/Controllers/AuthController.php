<?php

namespace App\Http\Controllers;

use App\Notifications\ResetPasswordNotifications;
use App\Services\BrevoMailer;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User as Usuario;
use App\Models\Cofradia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use App\Notifications\RegisterNotification;
use App\Notifications\ContactoNotification;
use App\Services\ZohoMailer;
use Illuminate\Support\Facades\Log; // Importar la clase Log para registrar información
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {

        $user = Usuario::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        if (!$user->estaVerificado()) {
            return response()->json([
                'error' => 'Debes verificar tu correo antes de iniciar sesión.',
                'pendiente_verificar' => true,
                'email' => $user->email,
            ], 403);
        }

        $token = $user->createToken('authToken')->plainTextToken;

        Log::info('Usuario logeado: ', [
            'status' => 200,
            'usuario' => $user->name,
            'email' => $user->email,
            'rol' => $user->role,
        ]);

        return response()->json([
            'data' => [
                'accessToken' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_admin' => (bool) $user->is_admin,
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
                'password' => 'required|min:6|confirmed',
                'name' => 'required|string|max:255|unique:users,name',
                // 'role' y 'localidad'/'provincia' se aceptan solo como intención informativa:
                // toda cuenta nueva se crea como 'usuario'. El administrador es quien la
                // convierte en cofradía desde el panel de gestión, tras revisarla.
                'role' => 'nullable|in:usuario,cofradia',
                'localidad' => 'nullable|string|max:255',
                'provincia' => 'nullable|string|max:100',
            ]);

            $quiereCofradia = $request->role === 'cofradia';
            $token = Str::random(64);

            $usuario = new Usuario();
            $usuario->email = $request->email;
            $usuario->name = $request->name;
            $usuario->password = Hash::make($request->password);
            $usuario->role = 'usuario';
            $usuario->verification_token = $token;
            $usuario->email_verified_at = null;
            $usuario->save();

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:4200');
            $verificarUrl = env('APP_URL') . "/api/email/verify/{$usuario->id}/{$token}";

            $html = "
            <h1>Confirma tu cuenta en Cofradiario</h1>
            <p>Hola {$usuario->name},</p>
            <p>Gracias por registrarte. Haz clic en el siguiente enlace para verificar tu cuenta:</p>
            <p><a href='{$verificarUrl}'>Verificar mi cuenta</a></p>
            <p>Si no has sido tú, puedes ignorar este correo.</p>
        ";

            $mailer->sendEmail($usuario->email, $usuario->name, 'Verifica tu cuenta en Cofradiario', $html);

            $intencion = $quiereCofradia
                ? 'Cofradía (' . ($request->localidad ?: 'sin localidad') . ', ' . ($request->provincia ?: 'sin provincia') . ')'
                : 'Usuario';
            $htmlAdmin = "
            <h1>Nuevo registro de usuario</h1>
            <p>Nombre: {$usuario->name}</p>
            <p>Email: {$usuario->email}</p>
            <p>Quiere registrarse como: {$intencion}</p>
            <p>Recuerda que hay que convertirlo en cofradía manualmente desde el panel de gestión si corresponde.</p>
        ";
            $mailer->sendEmail('cofradiariodemalaga@gmail.com', 'Registro nuevo', 'Nuevo registro de usuario', $htmlAdmin);

            return response()->json([
                'message' => 'Cuenta creada. Revisa tu correo para verificar la cuenta.',
                'pendiente_verificar' => true,
                'email' => $usuario->email,
            ], 201);
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

    /**
     * El enlace del correo solo valida y redirige — no verifica todavía.
     * La verificación real ocurre en confirmarVerificacion(), que requiere
     * una acción explícita del usuario (botón) en el frontend, para evitar que
     * un antivirus que abra el enlace en automático consuma el token.
     */
    public function verificarCorreo(int $id, string $token)
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:4200');
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return redirect("{$frontendUrl}/verificado?estado=error");
        }

        if ($usuario->estaVerificado()) {
            return redirect("{$frontendUrl}/verificado?estado=ya_verificado");
        }

        if (!hash_equals($usuario->verification_token ?? '', $token)) {
            return redirect("{$frontendUrl}/verificado?estado=error");
        }

        return redirect("{$frontendUrl}/verificado?estado=confirmar&id={$id}#token=" . urlencode($token));
    }

    /** Verificación real, solo se dispara con una acción explícita del usuario (POST). */
    public function confirmarVerificacion(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'token' => 'required|string',
        ]);

        $usuario = Usuario::find($request->id);

        if (!$usuario) {
            return response()->json(['message' => 'Enlace no válido o expirado.'], 422);
        }

        if ($usuario->estaVerificado()) {
            $authToken = $usuario->createToken('verificacion')->plainTextToken;
            return response()->json(['token' => $authToken, 'usuario' => $usuario]);
        }

        if (!hash_equals($usuario->verification_token ?? '', $request->token)) {
            return response()->json(['message' => 'Enlace no válido o expirado.'], 422);
        }

        $usuario->update([
            'email_verified_at' => now(),
            'verification_token' => null,
        ]);

        $authToken = $usuario->createToken('verificacion')->plainTextToken;
        return response()->json(['token' => $authToken, 'usuario' => $usuario]);
    }

    public function reenviarVerificacion(Request $request, ZohoMailer $mailer)
    {
        $request->validate(['email' => 'required|email']);

        $usuario = Usuario::where('email', $request->email)->first();

        if ($usuario && !$usuario->estaVerificado()) {
            $token = Str::random(64);
            $usuario->update(['verification_token' => $token]);

            $verificarUrl = env('APP_URL') . "/api/email/verify/{$usuario->id}/{$token}";
            $html = "
            <h1>Confirma tu cuenta en Cofradiario</h1>
            <p>Hola {$usuario->name},</p>
            <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
            <p><a href='{$verificarUrl}'>Verificar mi cuenta</a></p>
        ";
            $mailer->sendEmail($usuario->email, $usuario->name, 'Verifica tu cuenta en Cofradiario', $html);
        }

        // Respuesta neutra: nunca revela si el correo existe o ya está verificado.
        return response()->json(['message' => 'Si el correo existe y aún no está verificado, recibirás un nuevo enlace en breve.']);
    }








    public function listarUsuarios()
    {
        $usuarios = Usuario::select('id', 'name', 'email', 'role', 'is_admin', 'email_verified_at', 'created_at', 'updated_at')
            ->with('cofradia:id,id_user,nombre')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['usuarios' => $usuarios]);
    }

    /** Verificar manualmente una cuenta (admin) */
    public function verificarManual(Usuario $usuario)
    {
        if ($usuario->estaVerificado()) {
            return response()->json(['message' => 'Ya estaba verificado.']);
        }
        $usuario->update(['email_verified_at' => now(), 'verification_token' => null]);
        return response()->json(['usuario' => $usuario]);
    }

    /** Dar o quitar permisos de administrador (admin) */
    public function toggleAdmin(Usuario $usuario)
    {
        $usuario->update(['is_admin' => !$usuario->is_admin]);
        return response()->json(['usuario' => $usuario]);
    }

    /** Eliminar una cuenta de usuario (admin) */
    public function eliminarUsuarioAdmin(Usuario $usuario)
    {
        Cofradia::where('id_user', $usuario->id)->update(['id_user' => null]);
        $usuario->tokens()->delete();
        $usuario->delete();
        return response()->json(['ok' => true]);
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
