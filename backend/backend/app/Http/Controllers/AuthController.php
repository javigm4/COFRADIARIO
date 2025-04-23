<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User as Usuario;
use Illuminate\Support\Facades\Hash;
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



}
