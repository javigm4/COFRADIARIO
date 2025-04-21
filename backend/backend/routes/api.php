<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => ['cors']], function (){

    Route::post('/login', 'AuthController@login');
    Route::post('/register', 'AuthController@register');
    Route::post('/regenerate/code', 'AuthController@regenerateCode');
    Route::post('/regenerate/password', 'AuthController@regeneratePassword');

    Route::get('/eventos', 'EventosController@index');
    Route::get('cofradias','CofradiasController@index');

    Route::post('/articulos', 'ArticuloController@store');
    Route::get('/articulos', 'ArticuloController@index');
    Route::get('/articulos/{articulo}', 'ArticuloController@show');
    Route::patch('/articulos/{articulo}', 'ArticuloController@update');
    Route::delete('/articulos/{articulo}', 'ArticuloController@destroy');



    //---------------------EVENTOS---------------------------------
    //ROL USUARIO
    Route::middleware(['auth:sanctum'])->group(function () {
        // Agregar un evento a favoritos (solo para USUARIOS)
        Route::post('/eventos/{evento}/favoritos', 'EventoController@addToFavoritos')->middleware('role:usuario');
    });

    //ROL COFRADIA
    Route::middleware(['auth:sanctum'])->group(function () {
        // Administrar eventos (solo para COFRADÍAS)
        Route::post('/eventos', 'EventoController@store')->middleware('role:cofradia'); // Crear evento
        Route::patch('/eventos/{evento}', 'EventoController@update')->middleware('role:cofradia'); // Actualizar evento
        Route::delete('/eventos/{evento}', 'EventoController@destroy')->middleware('role:cofradia'); // Eliminar evento
    });

    //ROL ADMINISTRADOR
    Route::middleware(['auth:sanctum'])->group(function () {
        // Administrar eventos (solo para COFRADÍAS)
        Route::post('/eventos', 'EventoController@store')->middleware('role:cofradia'); // Crear evento
        Route::patch('/eventos/{evento}', 'EventoController@update')->middleware('role:cofradia'); // Actualizar evento
        Route::delete('/eventos/{evento}', 'EventoController@destroy')->middleware('role:cofradia'); // Eliminar evento

        Route::post('/cofradias', 'CofradiasController@store')->middleware('role:admin'); // Crear cofradia ç
        Route::post('/cofradias/{cofradia}', 'CofradiasController@update')->middleware('role:admin'); // Actualizar cofradia
        Route::delete('/cofradias/{cofradia}', 'CofradiasController@destroy')->middleware('role:admin'); // Eliminar cofradia
        Route::post('/usuarios', 'UsuarioController@store')->middleware('role:admin'); // Crear usuario
        Route::post('/usuarios/{usuario}', 'UsuarioController@update')->middleware('role:admin'); // Actualizar usuario
        Route::delete('/usuarios/{usuario}', 'UsuarioController@destroy')->middleware('role:admin'); // Eliminar usuario
        Route::post('/roles', 'RoleController@store')->middleware('role:admin'); // Crear rol
        Route::post('/roles/{role}', 'RoleController@update')->middleware('role:admin'); // Actualizar rol
        Route::delete('/roles/{role}', 'RoleController@destroy')->middleware('role:admin'); // Eliminar rol
});
});
