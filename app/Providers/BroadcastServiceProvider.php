<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Broadcast;
use App\Bookmark;
use JWTAuth;

class BroadcastServiceProvider extends ServiceProvider {

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Broadcast::routes();
//        Broadcast::routes(['middleware' => ['api', 'jwt.auth']]);

        /*
         * Authenticate the user's personal channel...
         */
//        Broadcast::channel('App.User.*',
//                           function ($user, $userId) {
//            return (int) $user->id === (int) $userId;
//        });
//        
//        Broadcast::channel('bookmarks.*',
//                           function ($user, $bookmarkID) {
//            dd('hey');
//            return (int) $user->id === (int) Bookmark::find($bookmarkID)->user_id;
//        });
    }

}
