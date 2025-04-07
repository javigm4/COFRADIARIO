<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CofradiaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('cofradias')->insert([
            [
                'nombre' => 'Pollinica',
                'titular1' => 'Jesús a su entrada en Jerusalén',
                'titular2' => 'María Santísima del Amparo',
                'titular3' => null,
                'direccion' => 'Calle Parras, 20',
                'parroquia' => 'Iglesia de San Agustín',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Dulce Nombre',
                'titular1' => 'Nuestro Padre Jesús de la Soledad',
                'titular2' => 'María Santísima del Dulce Nombre',
                'titular3' => null,
                'direccion' => 'Calle Juan de la Encina, 39',
                'parroquia' => 'Parroquia de la Divina Pastora',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Salutación',
                'titular1' => 'Divino Nombre de Jesús Nazareno de la Salutación',
                'titular2' => 'María Santísima del Patrocinio, Reina de los Cielos',
                'titular3' => null,
                'direccion' => 'Calle Cabello, 21',
                'parroquia' => 'Parroquia de la Santa Cruz y San Felipe Neri',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Humildad y Paciencia',
                'titular1' => 'Santísimo Cristo de la Humildad y Paciencia',
                'titular2' => 'María Santísima de Dolores y Esperanza',
                'titular3' => null,
                'direccion' => 'Plazuela María Santísima de Dolores y Esperanza, 1',
                'parroquia' => 'Parroquia de San Vicente de Paul',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'La Humildad',
                'titular1' => 'Santísimo Cristo de la Humildad',
                'titular2' => 'Nuestra Madre y Señora de la Merced',
                'titular3' => null,
                'direccion' => 'Calle Agua',
                'parroquia' => 'Santuario de la Victoria',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
