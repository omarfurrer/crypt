<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeSecurityClearanceRemoveCrypto extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Change bookmarks security clearance
        $bookmarks = App\Bookmark::cursor();
        foreach ($bookmarks as $key => $bookmark) {
            $securityClearance = $bookmark->security_clearance;
            switch ($securityClearance) {
                case 2:
                    $bookmark->security_clearance = 1;
                    break;
            }
            $bookmark->save();
        }
        // change folders security clearance
        $folders = App\Folder::cursor();
        foreach ($folders as $key => $folder) {
            $securityClearance = $folder->security_clearance;
            switch ($securityClearance) {
                case 2:
                    $folder->security_clearance = 1;
                    break;
            }
            $folder->save();
        }
        // change users security clearance
        $users = App\User::cursor();
        foreach ($users as $key => $user) {
            $securityClearance = $user->security_clearance;
            switch ($securityClearance) {
                case 2:
                    $user->security_clearance = 1;
                    break;
            }
            $user->save();
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        /**
         * TODO : write name of the SQL dump file to revert changes
         */
    }

}
