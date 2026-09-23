<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class BackfillRolesVerificationAndAdmins extends Migration
{
    public function up()
    {
        // Todas las cuentas ya existentes se consideran verificadas: nunca pasaron
        // por un flujo de verificación por correo, así que no se les puede exigir
        // ahora retroactivamente.
        DB::table('users')->whereNull('email_verified_at')->update(['email_verified_at' => now()]);

        // No se vincula ninguna cuenta a su cofradía automáticamente: todas las
        // cuentas existentes se quedan como 'usuario' (ya es el valor por defecto
        // de la columna) y es el administrador quien las convierte en cofradía
        // manualmente desde el panel de gestión ("Vincular usuario"), a su ritmo.
        // Ni los usuarios ni las cofradías existentes se tocan ni se pierden.

        DB::table('users')->whereIn('email', [
            'bandiariodiariodelasbandas@gmail.com',
            'cofradiariodemalaga@gmail.com',
        ])->update(['is_admin' => true]);
    }

    public function down()
    {
        // Migración solo de datos: no se revierte automáticamente.
    }
}
