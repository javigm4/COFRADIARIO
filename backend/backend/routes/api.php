<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventosController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoritosController;
use App\Http\Controllers\ArticulosController;
use App\Http\Controllers\CofradiasController;

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



// RUTAS DE LA API PARA EL FRONTEND (GETTERS)
Route::get('/eventos', [EventosController::class, 'index']);
Route::get('/eventos/{id}', [EventosController::class, 'show']); //obtener un evento por su id
Route::get('/articulos', [ArticulosController::class, 'index']);
Route::get('/cofradias', [CofradiasController::class, 'index']);
Route::get('/cofradias/{nombre}', [CofradiasController::class, 'mostrar']); //mostrar por nombre




// RUTAS DE LA API PARA EL BACKEND (CRUD)
Route::delete('/eventos/{id}', [EventosController::class, 'destroy']); // Ruta para     eliminar evento
Route::put('/eventos/{id}', [EventosController::class, 'update']); // Ruta para actualizar eventos
Route::post('/eventos', [EventosController::class, 'store']); // Ruta para crear evento
Route::delete('/favoritos/{id}', [FavoritosController::class, 'destroy']);
Route::post('/favoritos', [FavoritosController::class, 'store']);
Route::get('/articulos/{id}', [ArticulosController::class, 'show']);
Route::put('/articulos/{id}', [ArticulosController::class, 'update']);
Route::post('/articulos', [ArticulosController::class, 'store']);
Route::delete('/articulos/{id}', [ArticulosController::class, 'destroy']);


// RUTAS DE AUTENTICACION
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});
