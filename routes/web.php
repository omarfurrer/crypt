<?php

/*
  |--------------------------------------------------------------------------
  | Web Routes
  |--------------------------------------------------------------------------
  |
  | This file is where you may define all of the routes that are handled
  | by your application. Just tell Laravel the URIs it should respond
  | to using a Closure or controller method. Build something great!
  |
 */

Route::get('/', function () {
    return view('index');
});
Route::get('/mycrypt', function () {
    return view('index');
});
Route::get('/login', function () {
    return view('index');
});
Route::get('/settings', function () {
    return view('index');
});


//
//Route::group(['prefix' => 'api'], function() {
//   
//});

//
//Route::any('{all}', function() {
//    return view('index');
//})->where('all', '.+');
