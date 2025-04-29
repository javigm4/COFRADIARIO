<?php

namespace App\Http\Controllers;

use App\Models\articulos;
use App\Models\User;
use Illuminate\Http\Request;

class ArticulosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $articulos = Articulos::all();
        $usuarios = User::all();
        return view('diario', ['articulos' => $articulos, 'usuarios'=> $usuarios]); // lo enviamos a diario.blade.php
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
     * @param  \App\Models\articulos  $articulos
     * @return \Illuminate\Http\Response
     */
    public function show(articulos $articulos)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\articulos  $articulos
     * @return \Illuminate\Http\Response
     */
    public function edit(articulos $articulos)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\articulos  $articulos
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, articulos $articulos)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\articulos  $articulos
     * @return \Illuminate\Http\Response
     */
    public function destroy(articulos $articulos)
    {
        //
    }
}
