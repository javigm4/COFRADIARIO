<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AmpliaLongitudUrlsCofradiasTable extends Migration
{
    public function up()
    {
        DB::statement('ALTER TABLE cofradias MODIFY escudo_url VARCHAR(2000) NULL');
        DB::statement('ALTER TABLE cofradias MODIFY video_url VARCHAR(2000) NULL');
        DB::statement('ALTER TABLE cofradias MODIFY banner_url VARCHAR(2000) NULL');
        DB::statement('ALTER TABLE cofradias MODIFY web_url VARCHAR(2000) NULL');
    }

    public function down()
    {
        DB::statement('ALTER TABLE cofradias MODIFY escudo_url VARCHAR(255) NULL');
        DB::statement('ALTER TABLE cofradias MODIFY video_url VARCHAR(255) NULL');
        DB::statement('ALTER TABLE cofradias MODIFY banner_url VARCHAR(500) NULL');
        DB::statement('ALTER TABLE cofradias MODIFY web_url VARCHAR(500) NULL');
    }
}
