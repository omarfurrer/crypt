<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterDatabaseCharsetAndCollation extends Migration {

    public function up()
    {
        DB::connection()->getPdo()->exec('ALTER DATABASE crypt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        $tables = \DB::select('SHOW TABLES');
        foreach ($tables as $table) {
            $name = $table->Tables_in_crypt;
            //if you don't want to truncate a table add it here
            DB::connection()->getPdo()->exec('ALTER TABLE ' . $name . ' CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        }
    }

    public function down()
    {
        DB::connection()->getPdo()->exec('ALTER DATABASE crypt CHARACTER SET utf8 COLLATE utf8_unicode_ci');
        foreach ($tables as $table) {
            $name = $table->Tables_in_crypt;
            //if you don't want to truncate a table add it here
            DB::connection()->getPdo()->exec('ALTER TABLE ' . $name . ' CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci');
        }
    }

}
