<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Hash;
use JWTAuth;

class ChangeSecurityClearance extends FormRequest {

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(\Illuminate\Http\Request $request)
    {

        $user = JWTAuth::parseToken()->authenticate();
        if ($request->level > $user->security_clearance) {
            return Hash::check($request->password, $user->password);
        } else {
            return true;
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(\Illuminate\Http\Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        if ($request->level > $user->security_clearance) {
            return [
                'password' => 'required'
            ];
        } else {
            return [
            ];
        }
    }

}
