<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCofradiasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cofradias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('titular1'); //este es obligatorio pues sin un titular no se puede crear la cofradia
            $table->string('titular2')->nullable();
            $table->string('titular3')->nullable();
            $table->string('direccion')->nullable(); //esto es porque una imagen puede salir de la parroquia y no de su casa hermandad, como por ejemplo la Paloma o la Agonía.
            $table->string('parroquia');
            $table->timestamps();
        });
    }


    public function down()
    {
        Schema::dropIfExists('cofradias');
    }
}
