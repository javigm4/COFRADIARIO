<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EventosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('eventos')->insert([
            [
                'nombre' => 'Besapie del Cristo',
                'cofradia' => 1, // Asumo que la cofradía de MENA tiene ID 1
                'fecha' => Carbon::create(2025, 4, 21, 10, 0, 0), // Ejemplo de fecha y hora
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Misa de la Virgen',
                'cofradia' => 2, // Asumo que la cofradía del CAUTIVO tiene ID 2
                'fecha' => Carbon::create(2025, 4, 22, 6, 0, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Triduo del Cristo',
                'cofradia' => 3, // Asumo que la cofradía del MUTILADO tiene ID 3
                'fecha' => Carbon::create(2025, 4, 23, 19, 0, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
