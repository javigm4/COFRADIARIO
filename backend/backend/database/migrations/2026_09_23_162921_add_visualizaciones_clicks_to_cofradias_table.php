<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddVisualizacionesClicksToCofradiasTable extends Migration
{
    public function up()
    {
        Schema::table('cofradias', function (Blueprint $table) {
            if (!Schema::hasColumn('cofradias', 'visualizaciones')) {
                $table->unsignedInteger('visualizaciones')->default(0);
            }
            if (!Schema::hasColumn('cofradias', 'clicks')) {
                $table->unsignedInteger('clicks')->default(0);
            }
        });
    }

    public function down()
    {
        Schema::table('cofradias', function (Blueprint $table) {
            $table->dropColumn(['visualizaciones', 'clicks']);
        });
    }
}
