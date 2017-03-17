<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookmarkFromPluginRequest extends FormRequest {

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
        $user_id = \Illuminate\Http\Request::get('user_id');

        return [
            'url' => 'required|url|unique:bookmarks,url,NULL,id,user_id,' . $user_id,
            'user_id' => 'required|exists:users,id'
        ];
    }

}
