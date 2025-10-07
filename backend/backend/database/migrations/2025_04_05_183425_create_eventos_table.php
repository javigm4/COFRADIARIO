<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->foreignId('cofradia')->constrained()->onDelete('cascade'); // Establece la relación con cofradias
            $table->dateTime('fecha');
            $table->string('lugar')->nullable(); // Lugar del evento
            $table->text('detalles')->nullable(); // Detalles adicionales del evento
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
        Schema::dropIfExists('eventos');
    }
}
