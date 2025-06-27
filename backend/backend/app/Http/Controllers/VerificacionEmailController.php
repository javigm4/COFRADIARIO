<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

class VerificacionEmailController extends Controller
{
    public function verify(EmailVerificationRequest $request)
    {
        $request->fulfill(); // Marca el correo como verificado

        // Redirige al frontend Angular
        return redirect('http://localhost:4200/verificado');
    }
}
