<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInfoCofradesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('info_cofrades', function (Blueprint $table) {
            $table->id();
            $table->int('id_cofradia'); //esto es la id de la cofradia a la que pertenece
            $table->string('foto1'); //esto es la foto del primer titular
            $table->string('foto2')->nullable; //esto es la foto del segundo titular
            $table->string('foto3')->nullable(); //esto es la foto del tercer titular
            $table->text('text');//informacion de la cofradia
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('info_cofrades');
    }
}
