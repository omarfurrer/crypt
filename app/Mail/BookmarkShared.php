<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Bookmark;
use App\User;

class BookmarkShared extends Mailable implements ShouldQueue {

    use Queueable,
        SerializesModels;

    public $sharedBy;
    public $sharedWith;
    public $bookmark;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $sharedBy, User $sharedWith,
            Bookmark $bookmark)
    {
        $this->sharedBy = $sharedBy;
        $this->sharedWith = $sharedWith;
        $this->bookmark = $bookmark;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
                        ->subject($this->sharedBy->f_name . ' ' . $this->sharedBy->l_name . ' has shared a bookmark with you')
                        ->view('emails.bookmark.shared');
    }

}
