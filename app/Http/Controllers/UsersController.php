<?php

namespace App\Http\Controllers;

use App\User;
use Exception;
use Illuminate\Database\QueryException;
use App\Repositories\UsersRepository;
use Illuminate\Http\Request;
use JWTAuth;
use Socialite;

class UsersController extends Controller {

    /**
     * Users Repository
     * 
     * @var UsersRepository
     */
    protected $usersRepository;

    public function __construct(UsersRepository $usersRepository)
    {
        parent::__construct();

        $this->usersRepository = $usersRepository;
        $this->middleware('jwt.auth', ['except' => []]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response2
     */
    public function postChangeSecurityClearance(\App\Http\Requests\ChangeSecurityClearance $request)
    {
        try {

            $user = JWTAuth::parseToken()->authenticate();
            $user->security_clearance = $request->level;
            $user->save();

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
    public function patchChangePassword(\App\Http\Requests\ChangePasswordRequest $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $user->password = $request->new;
            $user->save();



            return response()->json(compact('user'), 200);
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
    public function postAuthenticateGoogle(Request $request)
    {
        try {
            $provider = 'google';

            $user = Socialite::driver($provider)->stateless()->user();

            $user = User::findOrCreateUserGoogle($user, $provider);

            $user->save();

            $user = User::find($user->id);


            $token = JWTAuth::fromUser($user);

            return response()->json(compact('user', 'token'), 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e], 500);
        } catch (QueryException $e) {
            return response()->json(['error' => $e], 500);
        }
    }

}
