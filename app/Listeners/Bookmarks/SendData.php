<?php

namespace App\Listeners\Bookmarks;

use App\Events\Bookmarks\MetaRefreshed;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendData
{
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
     * @param  MetaRefreshed  $event
     * @return void
     */
    public function handle(MetaRefreshed $event)
    {
        //
    }
}
