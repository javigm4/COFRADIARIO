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
        $request->validate([
            'email' => 'required',
            'password' => 'required',
            'codigo' => 'nullable|string',
        ]);

        $usuario = Usuario::where('email', $request->email)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return back()->withErrors(['email' => 'Credenciales incorrectas']);
        }

        // Validación condicional del código
        if (!empty($request->codigo)) { // Usa `!empty()` para asegurar que no sea nulo o vacío
            if ($usuario->codigo === $request->codigo) {
                session(['rol' => 'cofradia']);
            } else {
                return back()->withErrors(['codigo' => 'Código incorrecto']);
            }
        } else {
            session(['rol' => 'usuario']);
        }

        Auth::login($usuario);

        return redirect()->route('agenda');
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

        return redirect()->route('login');
    }


    public function logout(Request $request)
    {
        Auth::logout();
        session()->flush();
        return redirect()->route('login');
    }

}
