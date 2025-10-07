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
                'id' => 70,
                'nombre' => 'Extraordinaria de Nuestro Padre Jesus de la Soledad',
                'cofradia' => 1,
                'fecha' => Carbon::create(2025, 10, 4, 17, 15, 0),
                'lugar' => 'casa hermandad de los estudiantes',
                'detalles' => '',
                'created_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
                'updated_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
            ],
            [
                'id' => 71,
                'nombre' => 'Presentacion del Retablo',
                'cofradia' => 2,
                'fecha' => Carbon::create(2025, 10, 17, 20, 0, 0),       
                'lugar' => 'iglesia de santo domingo',
                'detalles' => '',
                'created_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
                'updated_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
            ],
            [
                'id' => 3,
                'nombre' => 'Extraordinaria de Maria Santisima de la Trinidad Coronada',
                'cofradia' => 3,
                'fecha' => Carbon::create(2025, 10, 25, 20, 0, 0),
                'lugar' => 'casa hermandad del cautivo, calle trinidad',
                'detalles' => '',
                'created_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
                'updated_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
            ],
            [
                'id' => 4,
                'nombre' => 'Extraordinaria de Maria Santisima del Gran Perdon',
                'cofradia' => 4,
                'fecha' => Carbon::create(2025, 10, 17, 18, 0, 0),
                'lugar' => 'casa hermandad de los estudiantes',
                'detalles' => '',
                'created_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
                'updated_at' => Carbon::create(2025, 9, 22, 18, 11, 6),
            ],
           
        ]);
    }
}
