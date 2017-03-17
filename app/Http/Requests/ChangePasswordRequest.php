<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use JWTAuth;
use Hash;

class ChangePasswordRequest extends FormRequest {

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(\Illuminate\Http\Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        if ($user->password == null) {
            return true;
        } else {
            return Hash::check($request->old, $user->password);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $password = $user->password;

        return [
//            'old' => 'required_unless,$password,null',
            'new' => 'required',
            'confirm_new' => 'same:new'
        ];
    }

}
