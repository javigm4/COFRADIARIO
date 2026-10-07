<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddHorarioTemploToCofradiasTable extends Migration
{
    public function up()
    {
        Schema::table('cofradias', function (Blueprint $table) {
            if (!Schema::hasColumn('cofradias', 'horario_templo')) {
                $table->string('horario_templo', 500)->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('cofradias', function (Blueprint $table) {
            $table->dropColumn('horario_templo');
        });
    }
}
