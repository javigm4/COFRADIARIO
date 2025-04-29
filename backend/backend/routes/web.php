<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventosController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoritosController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');



});



Route::get('/agenda', [EventosController::class, 'index'])->name('agenda');

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::get('/login', function () {
    return view('login');
})->name('login');

Route::post('/register', [AuthController::class, 'register'])->name('register');
//para quer funcione el registro

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');



Route::delete('/eventos/{id}', [EventosController::class, 'destroy'])->name('eliminarEvento');

Route::post('/eventos/create', [EventosController::class, 'store'])->name('crearEvento');

Route::post('/favoritos', [FavoritosController::class, 'store'])->name('agregarFavorito');

Route::delete('/favoritos/{id}', [FavoritosController::class, 'destroy'])->name('eliminarFavorito');



Route::patch('/evento/dummy/{id}', function ($id) {
    // Por ahora no se implementa la eliminación de eventos,
    // por lo que se redirige de vuelta o se muestra un mensaje temporal.
    return back()->with('status', 'Funcionalidad de eliminación no implementada.');
})->name('editarEvento');



Route::get('/register', function () {
    return view('register');
})->name('register'); // muestra la vista del registro


