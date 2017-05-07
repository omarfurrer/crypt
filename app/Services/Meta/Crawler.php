<?php

namespace App\Services\Meta;

use App\Services\Url\Validator;

class Crawler {

    /**
     * URL of the page to crawl to
     * 
     * @var string 
     */
    protected $_url;

    /**
     * URL validator
     * 
     * @var Validator 
     */
    protected $_validator;

    /**
     * Default Constructor
     * 
     * @param string $url
     */
    public function __construct($url)
    {
        $this->_url = $url;
        $this->_init();
    }

    protected function _init()
    {
        $this->_validator = new Validator($this->_url);
    }

    public function crawl()
    {
        $validity = $this->_validator->validate();

        if (!$validity)
            return false;

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $this->_url);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_USERAGENT,
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36');        
        curl_setopt($ch, CURLOPT_REFERER, env('APP_URL'));
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_VERBOSE, 1);
        $page_content = curl_exec($ch);
        curl_close($ch);

        $dom_obj = new \DOMDocument();
        @$dom_obj->loadHTML($page_content);

        $data = [];

        $metaTags = $dom_obj->getElementsByTagName('meta');
        foreach ($metaTags AS $tag) {
            if ($tag->hasAttribute('name')) {
//                echo $tag->getAttribute('name') . " = " . $tag->getAttribute('content') . " <br />";
                $data[$tag->getAttribute('name')] = $tag->getAttribute('content');
            } elseif ($tag->hasAttribute('property')) {
//                echo $tag->getAttribute('property') . " = " . $tag->getAttribute('content') . " <br />";
                $data[$tag->getAttribute('property')] = $tag->getAttribute('content');
            }
        }

        if ($dom_obj->getElementsByTagName('title')->item(0) != null) {
            $data['title'] = $dom_obj->getElementsByTagName('title')->item(0)->textContent;
        }

//        foreach ($dom_obj->getElementsByTagName('meta') as $meta) {
//            if ($meta->getAttribute('property') == 'og:description') {
//                $data['description'] = $meta->getAttribute('content');
//            }
//            if ($meta->getAttribute('property') == 'og:image') {
//                $data['image'] = $meta->getAttribute('content');
//            }
//        }

        return $data;
    }

}
