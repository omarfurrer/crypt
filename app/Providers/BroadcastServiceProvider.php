<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Broadcast;
use App\User;

class BroadcastServiceProvider extends ServiceProvider {

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
//        Broadcast::routes();
        Broadcast::routes(['middleware' => ['api', 'jwt.auth']]);

        /*
         * Authenticate the user's personal channel...
         */
//        Broadcast::channel('App.User.*',
//                           function ($user, $userId) {
//            return (int) $user->id === (int) $userId;
//        });
//        
        Broadcast::channel('users.*.bookmarks',
                           function ($user, $userID) {
            return (int) $user->id === (int) User::find($userID)->id;
        });
    }

}
