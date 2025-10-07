<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\Evento;
use App\Models\Favorito;
use App\Services\ZohoMailer;

class EliminarEventosPasados extends Command
{
    protected $signature = 'eventos:eliminar-pasados';
    protected $description = 'Elimina los eventos cuya fecha ya ha pasado y envía recordatorios';

    public function handle()
    {
        // -------------------- Eliminar eventos que ya han pasado -------------------------------
        $hoy = Carbon::today('Europe/Madrid');
        $eliminados = Evento::where('fecha', '<', $hoy)->delete();
        $this->info("Se eliminaron $eliminados eventos pasados.");

        // ---------------------Buscar favoritos cuyos eventos sean mañana -----------------------
        $mañana = Carbon::tomorrow('Europe/Madrid');

        $favoritos = Favorito::with(['usuario', 'evento'])
            ->get()
            ->filter(function ($favorito) use ($mañana) {
                return $favorito->evento
                    && Carbon::parse($favorito->evento->fecha, 'Europe/Madrid')->isSameDay($mañana);
            });

        $this->info("Favoritos encontrados: " . $favoritos->count());

        $mailer = app(ZohoMailer::class);

        foreach ($favoritos as $favorito) {
            $usuario = $favorito->usuario;
            $evento  = $favorito->evento;

            if ($usuario && $evento) {
                $eventoFecha = Carbon::parse($evento->fecha, 'Europe/Madrid')->toDateString();

                $html = "
                    <h1>Recordatorio de evento</h1>
                    <p>Hola {$usuario->name},</p>
                    <p>Mañana tienes el evento: <strong>{$evento->nombre}</strong></p>
                    <p>Fecha: {$eventoFecha}</p>
                    <p>Ubicación: {$evento->lugar}</p>
                    <p>¡No faltes!</p>
                ";

                $mailer->sendEmail(
                    $usuario->email,
                    $usuario->name,
                    'Recordatorio de evento',
                    $html
                );

                $this->info("Correo enviado a {$usuario->email}");
            }
        }

        $this->info('¡Todos los recordatorios enviados!');
    }
}
