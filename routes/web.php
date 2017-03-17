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

Route::group(['prefix' => 'api'], function() {
    Route::patch('users/update/password', ['uses' => 'UsersController@patchChangePassword']);
    Route::post('users/security/clearance/change', ['uses' => 'UsersController@postChangeSecurityClearance']);
    Route::post('users/authenticate/google', ['uses' => 'UsersController@postAuthenticateGoogle']);


    Route::get('bookmarks/folder/{folders}', ['uses' => 'BookmarksController@indexFolder']);
    Route::post('bookmarks/all/refresh', ['uses' => 'BookmarksController@postRefresh']);
    Route::post('bookmarks/all/security/clearance/change', ['uses' => 'BookmarksController@postChangeSecurityClearanceAll']);
    Route::post('bookmarks/all/delete', ['uses' => 'BookmarksController@postDestroyAll']);
    Route::post('bookmarks/all/move', ['uses' => 'BookmarksController@postChangeFolderAll']);
    Route::post('bookmarks/import/html', ['uses' => 'BookmarksController@postImportHtml']);
    Route::post('bookmarks/plugin', ['uses' => 'BookmarksController@postStoreFromPlugin']);
    Route::resource('bookmarks', 'BookmarksController');

    Route::resource('folders', 'FoldersController');
});


Route::any('{all}', function() {
    return view('index');
})->where('all', '.+');
