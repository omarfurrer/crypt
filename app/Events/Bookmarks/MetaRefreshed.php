<?php

namespace App\Events\Bookmarks;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Bookmark;
use App\User;

class MetaRefreshed implements ShouldBroadcast {

    use InteractsWithSockets,
        SerializesModels;

    public $bookmark;
    public $user;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Bookmark $bookmark, User $user)
    {
        $this->bookmark = $bookmark;
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        if ($this->user->security_clearance >= $this->bookmark->security_clearance) {
            return new PrivateChannel('users.' . $this->bookmark->user_id . '.bookmarks');
        }
        return [];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'bookmarks.refreshed';
    }

}
