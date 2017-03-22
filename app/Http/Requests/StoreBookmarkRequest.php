<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use JWTAuth;

class StoreBookmarkRequest extends FormRequest {

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if ($this->has('user_id')) {
            $user_id = $this->user_id;
        } else {
            $user = JWTAuth::parseToken()->authenticate();
            $user_id = $user->user_id;
        }

        return [
            'url' => 'required|url|unique:bookmarks,url,NULL,id,user_id,' . $user_id,
        ];
    }

}
