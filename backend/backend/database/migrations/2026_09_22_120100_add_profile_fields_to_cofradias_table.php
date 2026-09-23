<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddProfileFieldsToCofradiasTable extends Migration
{
    public function up()
    {
        Schema::table('cofradias', function (Blueprint $table) {
            $table->unsignedBigInteger('id_user')->nullable()->after('id');
            $table->foreign('id_user')->references('id')->on('users')->onDelete('set null');

            $table->string('localidad')->nullable();
            $table->string('provincia')->nullable();
            $table->string('escudo_url')->nullable();
            $table->longText('historia')->nullable();
            $table->json('titulares')->nullable();
            $table->string('direccion')->nullable();
            $table->string('parroquia')->nullable();
            $table->string('instagram')->nullable();
            $table->string('facebook')->nullable();
            $table->string('youtube')->nullable();
            $table->string('video_url')->nullable();
            $table->string('telefono')->nullable();
            $table->string('email_contacto')->nullable();
            $table->boolean('activa')->default(true);
        });
    }

    public function down()
    {
        Schema::table('cofradias', function (Blueprint $table) {
            $table->dropForeign(['id_user']);
            $table->dropColumn([
                'id_user', 'localidad', 'provincia', 'escudo_url', 'historia',
                'titulares', 'direccion', 'parroquia',
                'instagram', 'facebook', 'youtube', 'video_url', 'telefono',
                'email_contacto', 'activa',
            ]);
        });
    }
}
