<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\articulos;

class ArticulosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('articulos')->insert([
            'id' => '1',
            'titular' => 'La Esperanza en Roma',
            'id_autor' => 1,
            'cuerpo'=> 'María Santísima de la Esperanza presidirá junto al Cachorro de Triana la procesión del Jubileo de la  en la capital italia',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        /*
+------------+-----------------+------+-----+---------+----------------+
| Field      | Type            | Null | Key | Default | Extra          |
+------------+-----------------+------+-----+---------+----------------+
| id         | bigint unsigned | NO   | PRI | NULL    | auto_increment |
| titular    | varchar(255)    | NO   |     | NULL    |                |
| autor      | varchar(255)    | YES  |     | NULL    |                |
| cuerpo     | text            | NO   |     | NULL    |                |
| created_at | timestamp       | YES  |     | NULL    |                |
| updated_at | timestamp       | YES  |     | NULL    |                |

        */

    }
}
