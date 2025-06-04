<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ArticulosSeeder extends Seeder
{
    public function run()
    {
                DB::table('articulos')->truncate();

        DB::table('articulos')->insert([
            [
                'id' => 1,
                'titular' => 'La Esperanza en Roma',
                'id_autor' => 1,
                'cuerpo' => 'María Santísima de la Esperanza presidirá junto al Cachorro de Triana la procesión del Jubileo en la capital italiana.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'titular' => 'Tradiciones de Sevilla',
                'id_autor' => 2,
                'cuerpo' => 'El Capi relata las costumbres más arraigadas en las cofradías sevillanas durante la Semana Santa.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'titular' => 'La Macarena y su historia',
                'id_autor' => 3,
                'cuerpo' => 'Un repaso a la historia y devoción de la Virgen de la Macarena, patrona de muchos sevillanos.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'titular' => 'El papel del Hermano Mayor',
                'id_autor' => 4,
                'cuerpo' => 'Entrevista con el Hermano Mayor sobre las responsabilidades y retos actuales en la cofradía.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
