<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBannerWebToCofradiasTable extends Migration
{
    public function up()
    {
        Schema::table('cofradias', function (Blueprint $table) {
            if (!Schema::hasColumn('cofradias', 'banner_url')) {
                $table->string('banner_url', 500)->nullable();
            }
            if (!Schema::hasColumn('cofradias', 'web_url')) {
                $table->string('web_url', 500)->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('cofradias', function (Blueprint $table) {
            $table->dropColumn(['banner_url', 'web_url']);
        });
    }
}
