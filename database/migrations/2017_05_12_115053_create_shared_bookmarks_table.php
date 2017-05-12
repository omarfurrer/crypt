<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSharedBookmarksTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shared_bookmarks',
                       function (Blueprint $table) {
            $table->increments('id');
            
            $table->integer('shared_with_id')->unsigned()->index();
            $table->foreign('shared_with_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->integer('shared_by_id')->unsigned()->index();
            $table->foreign('shared_by_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->integer('bookmark_id')->unsigned()->index();
            $table->foreign('bookmark_id')->references('id')->on('bookmarks')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shared_bookmarks');
    }

}
