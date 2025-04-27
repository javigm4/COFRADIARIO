<?php

namespace App\Http\Controllers;
use App\Models\Evento;
use App\Models\Cofradias;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $eventos = Evento::orderBy('fecha', 'asc')->get();
        $cofradias = Cofradias::all();
        $esCofradia = session('rol') === 'cofradia';
        $esUsuario = session('rol') === 'usuario';
        $usuario = Auth::user();
	return view('agenda', ['eventos' => $eventos, 'cofradias'=> $cofradias, 'esCofradia' => $esCofradia, 'esUsuario' => $esUsuario, 'usuario' => $usuario]);

    }
}


















