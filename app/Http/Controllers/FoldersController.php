<?php

namespace App\Http\Controllers;

use App\Bookmark;
use App\Folder;
use App\Http\Requests;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use JWTAuth;

class FoldersController extends Controller {

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
            $folders = $user->folders()->where('security_clearance', '<=', $user->security_clearance)->orderBy('id', 'DESC')->get();

            return response()->json(compact('folders'), 200);
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
    public function store(Requests\StoreFolderRequest $request)
    {
        try {


//            return $request->all();
            $user = JWTAuth::parseToken()->authenticate();
            $folder = new Folder;
            $folder->name = $request->name;
            $folder->security_clearance = $user->security_clearance;
            $folder->user_id = $user->id;
            $folder->save();


            return response()->json(compact('folder'), 200);
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
    public function update(Requests\UpdateFolderRequest $request, Folder $folder)
    {
//        return 'hi';
        try {


            $folder->name = $request->name;
            $folder->security_clearance = $request->security_clearance;
            $folder->save();


            return response()->json(compact('folder'), 200);
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
    public function destroy(Folder $folder)
    {
        try {

            $bookmarks = $folder->bookmarks()->pluck('id')->toArray();

            $folder->delete();

            return response()->json(compact('bookmarks'), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

}
