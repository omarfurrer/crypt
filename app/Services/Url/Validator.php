<?php

namespace App\Services\Url;

class Validator {

    /**
     * URL of the page to crawl to
     * 
     * @var string 
     */
    protected $_url;

    /**
     * Default Constructor
     * 
     * @param string $url
     */
    public function __construct($url)
    {
        $this->_url = $url;
    }

    public function validate()
    {
        if ($this->_isEmpty($this->_url)) {
            return 'empty';
        }

        if (!$this->_isString($this->_url)) {
            return 'not a string';
        }

        $statusCode = $this->_getStatusCode($this->_url);
        if ($statusCode != 200) {
            return $statusCode;
        }

        return true;
    }

    protected function _isEmpty($url)
    {
        return empty($url);
    }

    protected function _isString($url)
    {
        return is_string($url);
    }

    protected function _getStatusCode($url, $followRedirect = true,
            $maxRedirects = 10)
    {
        $ch = @curl_init($url);

        if ($ch === false) {
            return false;
        }

        @curl_setopt($ch, CURLOPT_HEADER, true);    // we want headers
        @curl_setopt($ch, CURLOPT_NOBODY, true);    // dont need body
        @curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);    // catch output (do NOT print!)

        @curl_setopt($ch, CURLOPT_FOLLOWLOCATION, $followRedirect);
        @curl_setopt($ch, CURLOPT_MAXREDIRS, $maxRedirects);  // fairly random number, but could prevent unwanted endless redirects with followlocation=true
//      @curl_setopt($ch, CURLOPT_CONNECTTIMEOUT ,5);   // fairly random number (seconds)... but could prevent waiting forever to get a result
//      @curl_setopt($ch, CURLOPT_TIMEOUT        ,6);   // fairly random number (seconds)... but could prevent waiting forever to get a result
        @curl_setopt($ch, CURLOPT_USERAGENT,
                     "Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1");   // pretend we're a regular browser

        $results = explode("\n", trim(@curl_exec($ch)));

        if (@curl_errno($ch)) {   // should be 0
            @curl_close($ch);
            return false;
        }

        $type = null;

        foreach ($results as $line) {
            if (strtok($line, ':') == 'Content-Type') {
                $parts = explode(":", $line);
//                $type = trim($parts[1]);
                $type = explode(';', trim($parts[1]))[0];
            }
        }

        $code = @curl_getinfo($ch, CURLINFO_HTTP_CODE); // note: php.net documentation shows this returns a string, but really it returns an int
        @curl_close($ch);
//        if ($type === 'text/html') {
            return $code;
//        } else {
//            return $type;
//        }
    }

}
