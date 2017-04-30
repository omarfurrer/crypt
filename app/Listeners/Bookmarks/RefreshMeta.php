<?php

namespace App\Listeners\Bookmarks;

use App\Events\Bookmarks\Stored;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Jobs\Bookmark\refresh;

class RefreshMeta {

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  Stored  $event
     * @return void
     */
    public function handle(Stored $event)
    {
        dispatch(new refresh($event->bookmark));
        
    }

}
