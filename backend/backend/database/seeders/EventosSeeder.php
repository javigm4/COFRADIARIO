<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EventosSeeder extends Seeder
{
    public function run()
    {
        DB::table('eventos')->truncate();

        DB::table('eventos')->insert([
    
            [
                'id' => 1,
                'nombre' => 'Presentación del Retablo',
                'cofradia' => 2,
                'fecha' => Carbon::create(2025, 10, 17, 20, 3, 0),       
                'lugar' => 'Parroquia de Santo Domingo de Guzmán',
                'detalles' => 'Este retablo no es solo madera tallada y dorada, sino ofrenda viva y testimonio de fe.',
                'created_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
                'updated_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
            ],
            [
                'id' => 3,
                'nombre' => 'Extraordinaria de Maria Santisima de la Trinidad Coronada',
                'cofradia' => 3,
                'fecha' => Carbon::create(2025, 10, 25, 16, 3, 0),
                'lugar' => 'Casa de hermandad del Cautivo',
                'detalles' => 'Procesión extraordinaria por el XXV aniversario de su Coronación Canónica',
                'created_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
                'updated_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
            ],
            [
                'id' => 4,
                'nombre' => 'Zambomba Solidaria',
                'cofradia' => 2,
                'fecha' => Carbon::create(2025, 11, 28, 17, 0, 0),
                'lugar' => 'Plaza de Fray Alonso de Santo Tomás',
                'detalles' => 'La Congregación de Mena tiene el placer de invitaros a participar en la Zambomba Solidaria que se celebrará el próximo 28/11 a partir de las 17h en la Plaza de Fray Alonso de Sto. Tomás.',
                'created_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
                'updated_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
            ],           
        ]);
    }
}
