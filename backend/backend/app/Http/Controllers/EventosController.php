<?php

namespace App\Http\Controllers;

use App\Models\eventos as Evento;
use Illuminate\Http\Request;

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
        $esAdmin = session('rol') === 'cofradia'; // Verifica el rol desde la sesión

	return view('/agenda', ['eventos' => $eventos, 'esAdmin' => $esAdmin]);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\eventos  $eventos
     * @return \Illuminate\Http\Response
     */
    public function show(eventos $eventos)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\eventos  $eventos
     * @return \Illuminate\Http\Response
     */
    public function edit(eventos $eventos)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\eventos  $eventos
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, eventos $eventos)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\eventos  $eventos
     * @return \Illuminate\Http\Response
     */
    public function destroy(eventos $eventos)
    {
        //
    }
    }
