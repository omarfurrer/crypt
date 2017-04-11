<?php

namespace App\Http\Controllers;

use App\Bookmark;
use App\Folder;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBookmarkRequest;
use Illuminate\Database\QueryException;
use App\Repositories\BookmarksRepository;
use App\Criteria\LessThanSecurityClearanceCriteria;
use App\Criteria\EqualsFolderCriteria;
use App\Criteria\EqualsUserIDCriteria;
use JWTAuth;
use Validator;

class BookmarksController extends Controller {

    /**
     * Bookmarks Repository
     * 
     * @var BookmarksRepository
     */
    protected $bookmarksRepository;

    public function __construct(BookmarksRepository $bookmarksRepository)
    {
        parent::__construct();

        $this->bookmarksRepository = $bookmarksRepository;
        $this->middleware('jwt.auth',
                          ['except' => ['postStoreFromPlugin', 'store']]);
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


            $folder_id = \Request::get('folder_id');
            $order_by = \Request::get('order_by', 'DESC');
            $order_by_attribute = \Request::get('order_by_attribute', 'id');

            $bookmarks = $this->bookmarksRepository
                    ->pushCriteria(new LessThanSecurityClearanceCriteria($this->user->security_clearance))
                    ->pushCriteria(new EqualsUserIDCriteria($this->user->id));

            if ($folder_id != null) {
                $bookmarks->pushCriteria(new EqualsFolderCriteria($folder_id));
            }

            $bookmarks = $bookmarks
                    ->orderBy($order_by_attribute, $order_by)
                    ->paginate();

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
    public function indexFolder(Folder $folder)
    {
        try {

            $bookmarks = $this->bookmarksRepository->orderBy('id', 'DESC')->findWhere([
                ['security_clearance', '<=', $this->user->security_clearance],
                ['folder_id', '=', $folder->id]
            ]);

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
    public function store(StoreBookmarkRequest $request)
    {
        try {

            $data = [
                'user_id' => $request->has('user_id') ? $request->get('user_id') : $this->user->id,
                'security_clearance' => $request->has('security_clearance') ? $request->get('security_clearance') : $this->user->security_clearance,
            ];

            $bookmark = $this->bookmarksRepository->create(array_merge($data,
                                                                       $request->all()));
            $bookmark->refreshMetaData();

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
                $bookmark = $this->bookmarksRepository->find($value['id']);
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
            foreach ($request->bookmarks as $key => $value) {
                $this->bookmarksRepository->update(['folder_id' => $request->id],
                                                   $value['id']);
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

            $this->bookmarksRepository->delete($bookmark->id);

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
                $this->bookmarksRepository->update(['security_clearance' => $request->level],
                                                   $value['id']);
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
            Bookmark::destroy(collect($request->bookmarks)->pluck('id')->all());

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
                    $folder = \App\Folder::where('name', $original_file_name)->where('user_id',$user->id)->first();
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
                            $bookmark->security_clearance = $user->security_clearance;
                            $bookmark->save();
                            if ($request->autoRefresh == true) {
                                $bookmark->refreshMetaData();
                            }
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function patchHandleBookmarkOpened(Bookmark $bookmark)
    {
        try {
//            dd($bookmark);
            $bookmark = $this->bookmarksRepository->update(['visit_count' => ($bookmark->visit_count + 1)],
                                                           $bookmark->id);

            return response()->json(compact('bookmark'), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

    /**
     * Check if bookmark exists or not, mainly for the extension.
     * 
     * @param string $url
     */
    public function getExists(Request $request)
    {
        try {
            
            $url = urldecode($request->url);
            
//            dd($url);

            $bookmark = $this->bookmarksRepository->findWhere([
                ['user_id', '=', $this->user->id],
                ['url', '=', $url]
            ]);
            
//            dd($bookmark);

            if (count($bookmark) > 0) {
                return response()->json(1, 200);
            }

            return response()->json(0, 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

}
