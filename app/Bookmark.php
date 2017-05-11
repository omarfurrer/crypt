<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Elasticquent\ElasticquentTrait;
use App\Events\Bookmarks\MetaRefreshed;
use Carbon;

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
     * The elasticsearch settings.
     *
     * @var array
     */
    protected $indexSettings = [
        'analysis' => [
            'char_filter' => [
                'replace' => [
                    'type' => 'mapping',
                    'mappings' => [
                        '&=> and '
                    ],
                ],
            ],
            'filter' => [
                'word_delimiter' => [
                    'type' => 'word_delimiter',
                    'split_on_numerics' => false,
                    'split_on_case_change' => true,
                    'generate_word_parts' => true,
                    'generate_number_parts' => true,
                    'catenate_all' => true,
                    'preserve_original' => true,
                    'catenate_numbers' => true,
                ]
            ],
            'analyzer' => [
                'default' => [
                    'type' => 'custom',
                    'char_filter' => [
                        'html_strip',
                        'replace',
                    ],
                    'tokenizer' => 'whitespace',
                    'filter' => [
                        'lowercase',
                        'word_delimiter',
                    ],
                ],
            ],
        ],
    ];
//    protected $mappingProperties = array(
//        'title' => array(
//            'type' => 'string'
////            'analyzer' => 'standard'
//        ),
//        'url' => array(
//            'type' => 'string'
////            'analyzer' => 'standard'
//        )
//    );

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
        $this->addToIndex();
    }

    function getIndexDocumentData()
    {
        $data = $this->toArray();
        return $data;
    }

    public function getCreatedAtAttribute($date)
    {
        return Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $date)->format('Y-m-d');
    }

    public function getUpdatedAtAttribute($date)
    {
        return Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $date)->format('Y-m-d');
    }

}
