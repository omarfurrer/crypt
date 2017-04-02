<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Meta extends Model {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'metas';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['attribute', 'value','bookmark_id'];

}
