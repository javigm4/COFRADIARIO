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
| Aquí se registran las rutas de la API.
|
*/

// Obtener usuario autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// --------- RUTAS PÚBLICAS (GETTERS) ---------
Route::get('/eventos', [EventosController::class, 'index']);
Route::get('/eventos/{id}', [EventosController::class, 'show']);

Route::get('/articulos', [ArticulosController::class, 'index']);
Route::get('/articulos/{id}', [ArticulosController::class, 'show']);

Route::get('/cofradias', [CofradiasController::class, 'index']);
Route::get('/cofradias/{nombre}', [CofradiasController::class, 'mostrar']);

Route::post('/enviar-mensaje-contacto', [AuthController::class, 'enviarMensajeContacto']);

// --------- RUTAS PROTEGIDAS SOLO PARA CREAR ---------
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    // Crear eventos y artículos
    Route::post('/eventos', [EventosController::class, 'store']);
    Route::post('/articulos', [ArticulosController::class, 'store']);

    // Favoritos (recomendado mantener protegidos)
    Route::post('/favoritos', [FavoritosController::class, 'store']);
    Route::delete('/favoritos/{id}', [FavoritosController::class, 'destroy']);
});

// --------- RUTAS PÚBLICAS DE ACTUALIZAR Y ELIMINAR (usuarios ya autenticados por lógica de negocio) ---------
Route::put('/eventos/{id}', [EventosController::class, 'update']);
Route::delete('/eventos/{id}', [EventosController::class, 'destroy']);

Route::put('/articulos/{id}', [ArticulosController::class, 'update']);
Route::delete('/articulos/{id}', [ArticulosController::class, 'destroy']);

// --------- AUTENTICACIÓN ---------
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/email/verify/{id}/{hash}', function (Illuminate\Foundation\Auth\EmailVerificationRequest $request) {
        $request->fulfill();
        return response()->json(['message' => 'Email verificado correctamente']);
    })->middleware(['signed'])->name('verification.verify');
});
