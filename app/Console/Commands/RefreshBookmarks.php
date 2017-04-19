<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Bookmark;
use App\Jobs\Bookmark\refresh;

class RefreshBookmarks extends Command {

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bookmarks:refresh {--id=*} {--count=} {--user_id=} {--folder_id=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refresh bookmarks';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        ini_set('memory_limit', '256M');
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $bookmarks = [];

        $ids = $this->option('id');
        if (!empty($ids)) {
            $bookmarks = Bookmark::find($ids);
            $this->info('ids have been selected');
            $this->info(print_r($ids, true));

//            $this->info(print_r($bookmarks->toArray(), true));
            $total = count($bookmarks);
            $count = 1;
            foreach ($bookmarks as $bookmark) {
                $this->info($count . '/' . $total);
                $this->info('Dispatching refresh for bookmark id : ' . $bookmark->id);
                dispatch(new refresh($bookmark));
                $count++;
            }
            return;
        }

        $bookmarks = \DB::table('bookmarks');

        $count = $this->option('count');
        if ($count != null) {
            $bookmarks->take($count);
            $this->info('count not null');
            $this->info(print_r($count, true));
        }

        $user_id = $this->option('user_id');
        if ($user_id != null) {
            $bookmarks->where('user_id', $user_id);
            $this->info('user_id not null');
            $this->info(print_r($user_id, true));
        }

        $folder_id = $this->option('folder_id');
        if ($folder_id != null) {
            $bookmarks->where('folder_id', $folder_id);
            $this->info('folder_id not null');
            $this->info(print_r($folder_id, true));
        }

        $bookmarks = $bookmarks->latest()->get();

//        $this->info(print_r($bookmarks->toArray(), true));
        $total = count($bookmarks);
        $count = 1;
        foreach ($bookmarks as $bookmark) {
            $this->info($count . '/' . $total);
            $this->info('Dispatching refresh for bookmark id : ' . $bookmark->id);
            dispatch(new refresh($bookmark));
            $count++;
        }
    }

}
