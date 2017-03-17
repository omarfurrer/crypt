<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'bookmarks';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['url', 'title', 'description', 'image', 'security_clearance', 'folder_id', 'user_id'];

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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function getMetaData()
    {
        $url = urldecode($this->url);

//        $code = Helpers\Helper::getHttpResponseCode_using_curl($url);
//        dd($code);

        $validity = Helpers\Helper::isValidUrl($url);

        if ($validity === true) {
            $ch = curl_init();

            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36');
            curl_setopt($ch, CURLOPT_AUTOREFERER, true);
            curl_setopt($ch, CURLOPT_VERBOSE, 1);

            $data = curl_exec($ch);

//            dd($data);
//            echo $data;
//            dd();

            curl_close($ch);

            $page_content = $data;
            $title = null;
            $description = null;
            $image = null;
//            $icon = null;
            $dom_obj = new \DOMDocument();
            @$dom_obj->loadHTML($page_content);
//            dd($dom_obj);
            $meta_val = null;

//            $title = $dom_obj->getElementsByTagName('title')->item(0);
            if ($dom_obj->getElementsByTagName('title')->item(0) == null) {
                $title = 'TITLE NOT FOUND';
            } else {
                $title = $dom_obj->getElementsByTagName('title')->item(0)->textContent;
            }
//            $title = $dom_obj->getElementsByTagName('title');
//            dd($title);

            foreach ($dom_obj->getElementsByTagName('meta') as $meta) {
                if ($meta->getAttribute('property') == 'og:description') {
                    $meta_val = $meta->getAttribute('content');
                    $description = $meta_val;
                }
                if ($meta->getAttribute('property') == 'og:image') {
                    $meta_val = $meta->getAttribute('content');
                    $image = $meta_val;
                }
            }
//            foreach ($dom_obj->getElementsByTagName('link') as $link) {
//                if ($link->getAttribute('rel') == 'shortcut icon') {
//                    $icon = $link->getAttribute('href');
//                }
//            }


            if ($title != null) {
                $this->title = $title;
            }
            if ($description != null) {
                $this->description = $description;
            }

            if ($image != null) {
                $this->image = $image;
            }
//            if ($icon != null) {
//                $this->icon = $icon;
//            }
        } else {
            $this->title = $validity;
        }
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
