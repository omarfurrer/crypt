<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider {

    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'App\Events\Bookmarks\Stored' => [
            'App\Listeners\Bookmarks\RefreshMeta',
        ],
        'App\Events\Bookmarks\MetaRefreshed' => [
            'App\Listeners\Bookmarks\SendData',
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }

}
