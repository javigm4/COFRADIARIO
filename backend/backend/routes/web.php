<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventosController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoritosController;
use App\Http\Controllers\ArticulosController;
use App\Http\Controllers\CofradiasController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Aquí es donde registras las rutas web de tu aplicación. Se cargan
| a través del RouteServiceProvider dentro del grupo "web".
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/agenda', [EventosController::class, 'index'])->name('agenda');
Route::get('/diario', [ArticulosController::class, 'index'])->name('diario');

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::get('/login', function () {
    return view('login');
})->name('login');

Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::get('/register', function () {
    return view('register');
})->name('register');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ---- EVENTOS ----
Route::delete('/eventos/{id}', [EventosController::class, 'destroy'])->name('eliminarEvento');
Route::post('/eventos/create', [EventosController::class, 'store'])->name('crearEvento');
Route::get('/evento/{id}/edit', [EventosController::class, 'edit'])->name('actualizarEvento');
Route::put('/evento/{id}', [EventosController::class, 'update'])->name('editarEvento');

// ---- FAVORITOS ----
Route::post('/favoritos', [FavoritosController::class, 'store'])->name('agregarFavorito');
Route::delete('/favoritos/{id}', [FavoritosController::class, 'destroy'])->name('eliminarFavorito');

// ---- COFRADÍAS ----
Route::get('/seleccionCofradia', [CofradiasController::class, 'index'])->name('seleccionCofradia');
Route::get('/cofradia/{nombre}', [CofradiasController::class, 'mostrar']);

Route::get('/cofradia/{nombre}', function ($nombre) {
    $rutaTxt = storage_path("app/public/cofradiasDatos/{$nombre}/info.txt");
    $texto = file_exists($rutaTxt) ? file_get_contents($rutaTxt) : 'Información no disponible.';

    return view('infoCofradias', [
        'nombre' => $nombre,
        'texto'  => $texto
    ]);
});

// ---- RUTA DE DEPURACIÓN DE CONFIGURACIÓN SMTP/SENDGRID ----
Route::get('/debug-mail-config', function() {
    dd([
        'MAIL_MAILER'      => env('MAIL_MAILER'),
        'MAIL_HOST'        => env('MAIL_HOST'),
        'MAIL_PORT'        => env('MAIL_PORT'),
        'MAIL_USERNAME'    => env('MAIL_USERNAME'),
        'MAIL_PASSWORD'    => env('MAIL_PASSWORD'),
        'MAIL_ENCRYPTION'  => env('MAIL_ENCRYPTION'),
        'SENDGRID_API_KEY' => env('SENDGRID_API_KEY'),
    ]);
});
