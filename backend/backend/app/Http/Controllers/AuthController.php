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
            'nombre' => 'required',
            'password' => 'required',
            'codigo' => 'nullable|string',
        ]);

        $usuario = Usuario::where('nombre', $request->nombre)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return back()->withErrors(['nombre' => 'Credenciales incorrectas']);
        }

        // Si el código fue ingresado, validarlo contra el del usuario
        if ($request->filled('codigo')) {
            if ($usuario->codigo === $request->codigo) {
                session(['rol' => 'cofradia']);
            } else {
                return back()->withErrors(['codigo' => 'Código incorrecto']);
            }
        } else {
            session(['rol' => 'usuario']);
        }

        Auth::login($usuario);

        return redirect('/index');
    }


}
