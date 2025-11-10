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
                'titular' => 'Extraordinaria de la Trinidad',
                'id_autor' => 2,
                'cuerpo' => 'Esperando ver a la Trini en Carretería de nuevo... Un sueño hecho realidad.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            [
                'id' => 2,
                'titular' => 'El retablo de Mena',
                'id_autor' => 3,
                'cuerpo' => 'Es una locura cómo de bien Mena está anunciando el retablo. Algo me dice que va a ser el mejor que voy a ver en mi vida.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'titular' => 'El Gran Perdón',
                'id_autor' => 2,
                'cuerpo' => 'La cofradía del Prendi es una de las hermandades con mas esencia malagueña que tenemos actualmente y quien diga lo contrario miente.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
