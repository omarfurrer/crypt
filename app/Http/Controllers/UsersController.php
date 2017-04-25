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
        $this->middleware('jwt.auth',
                          ['except' => ['postAuthenticateGoogle', 'postLogin']]);
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

            if ($user->security_clearance != 0) {
                $user->security_clearance = 0;
            }

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

    /**
     * Authenticates a user with JWT and sends back the token if successful
     *
     * @return Response
     */
    public function postLogin(Request $request)
    {
        $credentials = $request->only('email', 'password');
        try {

            // verify the credentials and create a token for the user
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }

            $user = JWTAuth::toUser($token);
            if ($user->security_clearance != 0) {
                $user->security_clearance = 0;
                $user->save();
            }
//            if (!$user->active) {
//                return response()->json(['error' => 'email_not_confirmed'], 403);
//            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        // if no errors are encountered we can return a JWT
        return response()->json(compact('token', 'user'));
    }

}
