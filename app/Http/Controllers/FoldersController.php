<?php

namespace App\Http\Controllers;

use App\Folder;
use App\Http\Requests;
use Exception;
use Illuminate\Database\QueryException;
use App\Repositories\FoldersRepository;

class FoldersController extends Controller {

    /**
     * Folders Repository
     * 
     * @var FoldersRepository
     */
    protected $foldersRepository;

    public function __construct(FoldersRepository $foldersRepository)
    {
        parent::__construct();

        $this->foldersRepository = $foldersRepository;
        $this->middleware('jwt.auth', ['except' => []]);
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

            $folders = $this->foldersRepository->orderBy('id', 'DESC')->findWhere([['user_id', '=', $this->user->id], ['security_clearance', '<=', $this->user->security_clearance]]);

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

            $data = [
                'user_id' => $request->has('user_id') ? $request->get('user_id') : $this->user->id,
                'security_clearance' => $request->has('security_clearance') ? $request->get('security_clearance') : $this->user->security_clearance,
            ];

            $folder = $this->foldersRepository->create(array_merge($data,
                                                                   $request->all()));

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
        try {

            $data = [
                'security_clearance' => $request->has('security_clearance') ? $request->get('security_clearance') : $this->user->security_clearance
            ];
            $folder = $this->foldersRepository->update(array_merge($data,
                                                                   $request->all()),
                                                                   $folder->id);

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
