<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRoleAdminVerificationToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // En producción esta columna nunca llegó a crearse (la migración
            // 2025_06_26_091207 quedó huérfana), así que la creamos aquí de
            // forma defensiva para no depender de que aquella se aplique.
            if (!Schema::hasColumn('users', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['usuario', 'cofradia'])->default('usuario')->after('password');
            }
            if (!Schema::hasColumn('users', 'verification_token')) {
                $table->string('verification_token', 64)->nullable()->after('role');
            }
            if (!Schema::hasColumn('users', 'is_admin')) {
                $table->boolean('is_admin')->default(false)->after('verification_token');
            }
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'verification_token', 'is_admin']);
        });
    }
}
