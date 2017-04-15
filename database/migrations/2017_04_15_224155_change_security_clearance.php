<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeSecurityClearance extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $bookmarks = App\Bookmark::cursor();
        foreach ($bookmarks as $key => $bookmark) {
            $securityClearance = $bookmark->security_clearance;
            switch ($securityClearance) {
                case 2:
                    $bookmark->security_clearance = 1;
                    break;
                case 3:
                case 4:
                    $bookmark->security_clearance = 2;
                    break;
                default:
                    break;
            }
            $bookmark->save();
        }
        $folders = App\Folder::cursor();
        foreach ($folders as $key => $folder) {
            $securityClearance = $folder->security_clearance;
            switch ($securityClearance) {
                case 2:
                    $folder->security_clearance = 1;
                    break;
                case 3:
                case 4:
                    $folder->security_clearance = 2;
                    break;
                default:
                    break;
            }
            $folder->save();
        }
        $users = App\User::cursor();
        foreach ($users as $key => $user) {
            $securityClearance = $user->security_clearance;
            switch ($securityClearance) {
                case 2:
                    $user->security_clearance = 1;
                    break;
                case 3:
                case 4:
                    $user->security_clearance = 2;
                    break;
                default:
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
        //
    }

}
