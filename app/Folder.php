<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'folders';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'security_clearance', 'user_id'];

    /**
     * A product can belong to many users
     *
     * @return BelongsToMany
     */
    public function bookmarks()
    {
        return $this->hasMany('App\Bookmark');
    }

}
