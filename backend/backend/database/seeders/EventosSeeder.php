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
        DB::table('eventos')->truncate();
        DB::table('eventos')->insert([
            [
                'nombre' => 'Besapie del Cristo',
                'cofradia' => 1,
                'fecha' => Carbon::create(2025, 4, 21, 10, 0, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Misa de la Virgen',
                'cofradia' => 2,
                'fecha' => Carbon::create(2025, 4, 22, 6, 0, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Triduo del Cristo',
                'cofradia' => 3,
                'fecha' => Carbon::create(2025, 4, 23, 19, 0, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Procesión de la Madrugada',
                'cofradia' => 1,
                'fecha' => Carbon::create(2025, 4, 25, 3, 30, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Vigilia de Semana Santa',
                'cofradia' => 2,
                'fecha' => Carbon::create(2025, 4, 24, 20, 0, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Rosario de la Aurora',
                'cofradia' => 3,
                'fecha' => Carbon::create(2025, 4, 26, 7, 0, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Eucaristía Mensual',
                'cofradia' => 4,
                'fecha' => Carbon::create(2025, 5, 2, 11, 0, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Junta General',
                'cofradia' => 5,
                'fecha' => Carbon::create(2025, 5, 5, 18, 0, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Culto al Cautivo',
                'cofradia' => 6,
                'fecha' => Carbon::create(2025, 5, 10, 20, 0, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Retiro Espiritual',
                'cofradia' => 1,
                'fecha' => Carbon::create(2025, 5, 15, 9, 0, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Concierto de Marchas',
                'cofradia' => 2,
                'fecha' => Carbon::create(2025, 5, 20, 21, 0, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
