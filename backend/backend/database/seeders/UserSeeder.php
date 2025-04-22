<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'Congregación de Mena',
                'email' => 'congregacionmena@gmail.com',
                'password' => bcrypt('buenamuerte22'),
                'codigo' => '123456',
            ]
        ]);
    }
}
