<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\Evento;

class EliminarEventosPasados extends Command
{
    protected $signature = 'eventos:eliminar-pasados';
    protected $description = 'Elimina los eventos cuya fecha ya ha pasado';

    public function handle()
    {
        $hoy = Carbon::today();
        $eliminados = Evento::where('fecha', '<', $hoy)->delete();

        $this->info("Se eliminaron $eliminados eventos pasados.");
    }
}
