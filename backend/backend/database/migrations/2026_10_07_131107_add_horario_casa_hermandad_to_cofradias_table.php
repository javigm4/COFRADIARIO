<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddHorarioCasaHermandadToCofradiasTable extends Migration
{
    public function up()
    {
        Schema::table('cofradias', function (Blueprint $table) {
            if (!Schema::hasColumn('cofradias', 'horario_casa_hermandad')) {
                $table->string('horario_casa_hermandad', 500)->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('cofradias', function (Blueprint $table) {
            $table->dropColumn('horario_casa_hermandad');
        });
    }
}
