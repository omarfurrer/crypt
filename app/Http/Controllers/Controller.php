<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use JWTAuth;

class Controller extends BaseController {

    use AuthorizesRequests,
        DispatchesJobs,
        ValidatesRequests;

    protected $user;

    public function __construct()
    {
        if (JWTAuth::getToken()) {
            $this->user = JWTAuth::parseToken()->authenticate();
        } else {
            $this->user = null;
        }
    }

}
