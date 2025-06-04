<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->truncate();

        DB::table('users')->insert([
            [ //1
                'name' => 'Pollinica',
                'email' => 'pollinica@gmail.com',
                'password' => bcrypt('pollino22'),
                'codigo' => '3505',
            ],
            [ //2
                'name' => 'El Capi',
                'email' => 'elcapi@cofradia.com',
                'password' => bcrypt('capitan77'),
                'codigo' => 'X7Z9',
            ],
            [ //3
                'name' => 'La Macarena',
                'email' => 'macarena@sevilla.es',
                'password' => bcrypt('virgen88'),
                'codigo' => 'MAR123',
            ],
            [ //4
                'name' => 'Hermano Mayor',
                'email' => 'hermano@mayor.com',
                'password' => bcrypt('mayor456'),
                'codigo' => 'HMO2025',
            ],
            [ //5
                'name' => 'Salutación',
                'email' => 'salutacion@gmail.com',
                'password' => bcrypt('pollino22'),
                'codigo' => '1234',
            ],
            [ //6
                'name' => 'Dulce Nombre',
                'email' => 'dulcenombre@gmail.com',
                'password' => bcrypt('dulce2024'),
                'codigo' => 'DNMB24',
            ],
            [ //7
                'name' => 'Humildad y Paciencia',
                'email' => 'humildadypaciencia@gmail.com',
                'password' => bcrypt('humipaci'),
                'codigo' => 'HYP002',
            ],
            [ //8
                'name' => 'La Humildad',
                'email' => 'lahumildad@gmail.com',
                'password' => bcrypt('humildad23'),
                'codigo' => 'LHD789',
            ],
            [ //9
                'name' => 'Cautivo',
                'email' => 'cautivo@gmail.com',
                'password' => bcrypt('cautivo33'),
                'codigo' => 'CTVO33',
            ],
        ]);
    }
}
