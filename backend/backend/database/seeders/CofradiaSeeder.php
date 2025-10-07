<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CofradiaSeeder extends Seeder
{
    public function run()
    {
        // Limpiamos la tabla solo si quieres reiniciar
        DB::table('cofradias')->delete();
        DB::table('cofradias')->insert([
            [
                'id' => 1, // coincide con tu BD actual
                'nombre' => 'Dulce Nombre',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'id' => 2, // coincide con tu BD actual
                'nombre' => 'Mena',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'id' => 3, // coincide con tu BD actual
                'nombre' => 'Cautivo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'id' => 4, // coincide con tu BD actual
                'nombre' => 'Prendimiento',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
        ]);
    }
}
