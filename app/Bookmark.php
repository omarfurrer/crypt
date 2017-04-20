<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Elasticquent\ElasticquentTrait;

class Bookmark extends Model {

    use ElasticquentTrait;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'bookmarks';
    protected $appends = array('meta');

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['url', 'custom_title', 'title', 'description', 'image', 'security_clearance', 'folder_id', 'user_id', 'visit_count'];

    /**
     * A product can belong to many users
     *
     * @return BelongsToMany
     */
    public function folder()
    {
        return $this->belongsTo('App\Folder');
    }

    /**
     * A bookmark has many meta tags
     *
     * @return HasMany
     */
    public function metas()
    {
        return $this->hasMany('App\Meta');
    }

    public function getMetaAttribute()
    {
        $metas = ['player' => null, 'player_type' => null];

        $playerTag = $this->metas()->where('attribute', 'LIKE', '%player')->first();

        if ($playerTag) {

            $metas['player'] = $playerTag->value;
            return $metas;
        }

        $ogVideoTag = $this->metas()->where('attribute', '=', 'og:video')->first();

        if ($ogVideoTag) {
            $metas['player'] = $ogVideoTag->value;
            $ogVideoType = $this->metas()->where('attribute', '=',
                                                 'og:video:type')->first();
            if ($ogVideoType) {
                $metas['player_type'] = $ogVideoType->value;
            }
        }

        return $metas;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function getMetaData()
    {
        $crawler = new Services\Meta\Crawler($this->url);
        $data = $crawler->crawl();

        foreach ($data as $key => $value) {
            $this->metas()->updateOrCreate(['attribute' => $key],
                                           ['attribute' => $key, 'value' => $value]);
        }

        if (isset($data['og:description'])) {
            $this->description = $data['og:description'];
        }

        if (isset($data['og:image'])) {
            $this->image = $data['og:image'];
        }

        if (isset($data['title'])) {
            $this->title = $data['title'];
        }

//        $this->fill($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function refreshMetaData()
    {
        $this->getMetaData();
        $this->save();
    }

}
