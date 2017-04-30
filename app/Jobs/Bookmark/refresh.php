<?php

namespace App\Jobs\Bookmark;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Bookmark;
use App\Events\Bookmarks\MetaRefreshed;

class refresh implements ShouldQueue {

    use InteractsWithQueue,
        Queueable,
        SerializesModels;

    /**
     * Bookmark to be refreshed
     * 
     * @var Bookmark 
     */
    protected $bookmark;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Bookmark $bookmark)
    {
        $this->bookmark = $bookmark;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->bookmark->refreshMetaData();
        event(new MetaRefreshed($this->bookmark));
    }

}
