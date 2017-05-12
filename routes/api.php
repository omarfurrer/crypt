<?php

use Illuminate\Http\Request;

/*
  |--------------------------------------------------------------------------
  | API Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register API routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | is assigned the "api" middleware group. Enjoy building your API!
  |
 */

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:api');

 Route::patch('users/update/password', ['uses' => 'UsersController@patchChangePassword']);
    Route::post('users/search', ['uses' => 'UsersController@postSearch']);
    Route::post('users/security/clearance/change', ['uses' => 'UsersController@postChangeSecurityClearance']);
    Route::post('users/authenticate/google', ['uses' => 'UsersController@postAuthenticateGoogle']);
    Route::post('users/login', ['uses' => 'UsersController@postLogin']);


    Route::post('bookmarks/share', ['uses' => 'BookmarksController@postShare']);
    Route::get('bookmarks/shared/mine', ['uses' => 'BookmarksController@indexSharedWithMe']);
    Route::get('bookmarks/shared/others', ['uses' => 'BookmarksController@indexSharedByMe']);
    Route::post('bookmarks/search', ['uses' => 'BookmarksController@postSearch']);
    Route::get('bookmarks/exists', ['uses' => 'BookmarksController@getExists']);
    Route::get('bookmarks/folder/{folders}', ['uses' => 'BookmarksController@indexFolder']);
    Route::post('bookmarks/all/refresh', ['uses' => 'BookmarksController@postRefresh']);
    Route::post('bookmarks/all/security/clearance/change', ['uses' => 'BookmarksController@postChangeSecurityClearanceAll']);
    Route::post('bookmarks/all/delete', ['uses' => 'BookmarksController@postDestroyAll']);
    Route::post('bookmarks/all/move', ['uses' => 'BookmarksController@postChangeFolderAll']);
    Route::post('bookmarks/import/html', ['uses' => 'BookmarksController@postImportHtml']);
    Route::patch('bookmarks/{bookmarks}/opened', ['uses' => 'BookmarksController@patchHandleBookmarkOpened']);
    Route::resource('bookmarks', 'BookmarksController');

    Route::resource('folders', 'FoldersController');




