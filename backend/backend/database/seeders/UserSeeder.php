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
            [
                'name' => 'Pollinica',
                'email' => 'pollinica@gmail.com',
                'password' => bcrypt('pollino22'),
                'codigo' => '3505',
            ],
            [
                'name' => 'Manolo',
                'email' => 'manoloejemplonose@gmail.com',
                'password' => bcrypt('123123'),
                'codigo' => '2482',
            ],
            [
                'name' => 'Javi',
                'email' => 'javierguerreromontero1@gmail.com',
                'password' => bcrypt('123123'),
                'codigo' => '1111',
            ],
        ]);
    }
}
