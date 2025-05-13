<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventosController;
use App\Http\Controllers\AuthController;

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






// RUTAS DE LA API PARA EL BACKEND (CRUD)
Route::delete('/eventos/{id}', [EventosController::class, 'destroy']); // Ruta para eliminar evento
Route::put('/eventos/{id}', [EventosController::class, 'update']); // Ruta para actualizar eventos
Route::post('/eventos', [EventosController::class, 'store']); // Ruta para crear evento


// RUTAS DE AUTENTICACION
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

