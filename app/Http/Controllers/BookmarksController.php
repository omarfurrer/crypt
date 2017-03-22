<?php

namespace App\Http\Controllers;

use App\Bookmark;
use App\Http\Requests;
//use Exception;
//use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBookmarkFromPluginRequest;
use Illuminate\Database\QueryException;
use JWTAuth;
use Validator;

class BookmarksController extends Controller {

    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['postStoreFromPlugin']]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function index()
    {
        try {

            $user = JWTAuth::parseToken()->authenticate();
            $bookmarks = $user->bookmarks()->where('security_clearance', '<=',
                                                   $user->security_clearance)->orderBy('id',
                                                                                       'DESC')->get();

            return response()->json(compact('bookmarks'), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function indexFolder(\App\Folder $folder)
    {
        try {

            $user = JWTAuth::parseToken()->authenticate();
            $bookmarks = $folder->bookmarks()->where('security_clearance', '<=',
                                                     $user->security_clearance)->orderBy('id',
                                                                                         'DESC')->get();

            return response()->json(compact('bookmarks'), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function store(Requests\StoreBookmarkRequest $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $bookmark = new Bookmark;
            $bookmark->url = $request->url;
            $bookmark->user_id = $user->id;
            $bookmark->security_clearance = $user->security_clearance;

            if ($request->has('folder_id')) {
                $bookmark->folder_id = $request->folder_id;
            }
            $bookmark->getMetaData();
            $bookmark->save();

            return response()->json(compact('bookmark'), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function postStoreFromPlugin(StoreBookmarkFromPluginRequest $request)
    {
        try {

            $user = \App\User::find($request->user_id);
            $bookmark = new Bookmark;
            $bookmark->url = $request->url;
            $bookmark->user_id = $user->id;
            $bookmark->security_clearance = $request->security_clearance;

            if ($request->has('folder_id')) {
                $bookmark->folder_id = $request->folder_id;
            }
            $bookmark->getMetaData();
            $bookmark->save();

            return response()->json(compact('bookmark'), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function postRefresh(Request $request)
    {
        try {

            $bookmarks = [];

            foreach ($request->bookmarks as $key => $value) {
                $bookmark = Bookmark::find($value);
                $bookmark->refreshMetaData();
                array_push($bookmarks, $bookmark);
            }

            return response()->json(compact('bookmarks'), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function postChangeFolderAll(Request $request)
    {
        try {


            if ($request->id == null) {
                foreach ($request->bookmarks as $key => $value) {
                    Bookmark::find($value)->update(['folder_id' => null]);
                }
            } else {
                foreach ($request->bookmarks as $key => $value) {
                    Bookmark::find($value)->update(['folder_id' => $request->id]);
                }
            }

            return response()->json(compact(''), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function destroy(Bookmark $bookmark)
    {
        try {

            $bookmark->delete();

            return response()->json(compact(''), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function postChangeSecurityClearanceAll(Request $request)
    {
        try {

            foreach ($request->bookmarks as $key => $value) {
                Bookmark::find($value)->update(['security_clearance' => $request->level]);
            }

            return response()->json(compact(''), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function postDestroyAll(Request $request)
    {
        try {

            Bookmark::destroy($request->bookmarks);

            return response()->json(compact(''), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function postImportHtml(Request $request)
    {
        try {


            ini_set('default_socket_timeout', 1200);
            $folders = [];
            $files = $request->file('file');


            foreach ($files as $key => $file) {

//                dd($file);
                $bookmarks = [];
                if ($file) {
                    $user = JWTAuth::parseToken()->authenticate();

                    $original_file_name = $file->getClientOriginalName();
                    libxml_use_internal_errors(true);
                    $page_content = file_get_contents($file);
                    $dom_obj = new \DOMDocument();
                    $dom_obj->loadHTML($page_content);
                    foreach ($dom_obj->getElementsByTagName('a') as $link) {
                        $url = $link->getAttribute('href');
                        array_push($bookmarks, $url);
                    }
                    $folder = \App\Folder::where('name', $original_file_name)->first();
                    if (!$folder) {
                        $folder = new \App\Folder;
                        $folder->name = $original_file_name;
                        $folder->security_clearance = $user->security_clearance;
                        $folder->user_id = $user->id;
                        $folder->save();
                    }

                    foreach ($bookmarks as $key => $value) {
                        $validator = Validator::make(['url' => $value],
                                                     [
                                    'url' => 'required|url|unique:bookmarks,url,NULL,id,user_id,' . $user->id,
                        ]);
                        if (!$validator->fails()) {
                            $bookmark = new Bookmark;
                            $bookmark->url = $value;
                            $bookmark->user_id = $user->id;
                            $bookmark->folder_id = $folder->id;

                            if ($request->autoRefresh == true) {
                                $bookmark->getMetaData();
                            }
                            $bookmark->save();
                        }
                    }
//                $folder->load('bookmarks');
                    array_push($folders, $folder);
                }
            }


            return response()->json(compact('folders'), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

}
