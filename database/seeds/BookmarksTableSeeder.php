<?php

use Illuminate\Database\Seeder;

class BookmarksTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        App\Bookmark::create(['url' => 'https://www.google.com', 'user_id' => 1]);
        App\Bookmark::create(['url' => 'https://www.youtube.com', 'user_id' => 1]);
        App\Bookmark::create(['url' => 'https://www.youtube.com/watch?v=mIrt5MkGpy0', 'user_id' => 1]);
        App\Bookmark::create(['url' => 'https://www.laravel.com', 'user_id' => 1]);
        App\Bookmark::create(['url' => 'https://www.thepiratebay.se', 'security_clearance' => 1, 'user_id' => 1]);
        App\Bookmark::create(['url' => 'https://www.primewire.ag', 'security_clearance' => 2, 'user_id' => 1]);
        App\Bookmark::create(['url' => 'https://www.9gag.com', 'security_clearance' => 3, 'user_id' => 1]);
        App\Bookmark::create(['url' => 'https://www.microsoft.com', 'security_clearance' => 4, 'user_id' => 1]);
    }

}
