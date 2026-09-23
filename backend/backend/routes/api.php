<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventosController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticulosController;
use App\Http\Controllers\CofradiasController;
use App\Http\Controllers\AdminController;

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
Route::get('/proximosEventos', [EventosController::class, 'proximosEventos']);
Route::get('/eventos/{id}', [EventosController::class, 'show']);

Route::get('/articulos', [ArticulosController::class, 'index']);
Route::get('/ultimosArticulos', [ArticulosController::class, 'ultimosArticulos']);
Route::get('/articulos/{id}', [ArticulosController::class, 'show']);

Route::get('/cofradias', [CofradiasController::class, 'index']);
Route::get('/cofradias/{nombre}', [CofradiasController::class, 'mostrar']);
Route::get('/cofradias/{id}/perfil', [CofradiasController::class, 'perfil'])->whereNumber('id');
Route::post('/cofradias/{id}/contacto', [CofradiasController::class, 'contacto'])->whereNumber('id');

Route::post('/eventos', [EventosController::class, 'store'])->withoutMiddleware([\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class]);

// ---------- RUTAS PÚBLICAS (CORREOS) --------- 
Route::post('/enviar-mensaje-contacto', [AuthController::class, 'enviarMensajeContacto']);

Route::post('/password/forgot', [AuthController::class, 'sendResetLinkEmail']);


// --------- RUTAS PROTEGIDAS SOLO PARA CREAR ---------
Route::middleware(['auth:sanctum'])->group(function () {
    // Crear eventos y artículos
    Route::post('/articulos', [ArticulosController::class, 'store']);
});

// --------- VERIFICACIÓN DE CORREO ---------
Route::get('/email/verify/{id}/{token}', [AuthController::class, 'verificarCorreo']);
Route::post('/email/confirmar', [AuthController::class, 'confirmarVerificacion']);
Route::post('/email/reenviar', [AuthController::class, 'reenviarVerificacion']);

// --------- MI COFRADÍA (autoedición) ---------
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/mi-cofradia', [AdminController::class, 'miCofradia']);
    Route::put('/mi-cofradia', [AdminController::class, 'actualizarMiCofradia']);
});

// --------- PANEL DE GESTIÓN (solo administradores) ---------
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/estadisticas', [AdminController::class, 'estadisticas']);

    Route::get('/cofradias', [AdminController::class, 'cofradias']);
    Route::post('/cofradias', [AdminController::class, 'crearCofradia']);
    Route::put('/cofradias/{cofradia}', [AdminController::class, 'editarCofradia']);
    Route::delete('/cofradias/{cofradia}', [AdminController::class, 'eliminarCofradia']);
    Route::post('/cofradias/{cofradia}/vincular', [AdminController::class, 'vincularUsuario']);
    Route::post('/cofradias/{cofradia}/desvincular', [AdminController::class, 'desvincularUsuario']);
    Route::get('/usuarios-sin-cofradia', [AdminController::class, 'usuariosSinCofradia']);

    Route::get('/usuarios', [AuthController::class, 'listarUsuarios']);
    Route::post('/usuarios/{usuario}/toggle-cofradia', [AdminController::class, 'toggleCofradia']);
    Route::post('/usuarios/{usuario}/verificar', [AuthController::class, 'verificarManual']);
    Route::post('/usuarios/{usuario}/toggle-admin', [AuthController::class, 'toggleAdmin']);
    Route::delete('/usuarios/{usuario}', [AuthController::class, 'eliminarUsuarioAdmin']);
});

// --------- RUTAS PÚBLICAS DE ACTUALIZAR Y ELIMINAR (usuarios ya autenticados por lógica de negocio) ---------
Route::put('/eventos/{id}', [EventosController::class, 'update']);
Route::delete('/eventos/{id}', [EventosController::class, 'destroy']);

Route::put('/articulos/{id}', [ArticulosController::class, 'update']);
Route::delete('/articulos/{id}', [ArticulosController::class, 'destroy']);

Route::post('/cofradias', [CofradiasController::class, 'store']);
Route::delete('/cofradias/{id}', [CofradiasController::class, 'destroy']);

//--------- REGENERACION DE CONTRASEÑAS ------
// Recuperación de contraseña
Route::post('/password/email', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/password/reset', [AuthController::class, 'resetPassword'])->name('password.reset');

// Ruta para redirigir al frontend con token y email
Route::get('/password/reset/{token}', function ($token, Request $request) {
    return response()->json([
        'token' => $token,
        'email' => $request->query('email'),
        'message' => 'Aquí deberías redirigir al formulario en el frontend'
    ]);
})->name('password.reset.get');




// --------- AUTENTICACIÓN ---------
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});
