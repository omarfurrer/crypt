<?php

namespace App\Events\Bookmarks;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Bookmark;

class Stored implements ShouldBroadcast {

    use InteractsWithSockets,
        SerializesModels;

    public $bookmark;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Bookmark $bookmark)
    {
        $this->bookmark = $bookmark;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
//        return new Channel('bookmarks.' . $this->bookmark->id);
        return new Channel('bookmarks');
    }

}
