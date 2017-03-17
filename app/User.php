<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Socialite;
use Hash;

class User extends Authenticatable {

    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'f_name', 'l_name', 'google_id', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'remember_token', 'password_reset_token', 'google_id',
    ];

    /**
     * A user has many bookmarks
     *
     * @return HasMany
     */
    public function bookmarks()
    {
        return $this->hasMany('App\Bookmark');
    }

    /**
     * A user has many bookmarks
     *
     * @return HasMany
     */
    public function folders()
    {
        return $this->hasMany('App\Folder');
    }

    /**
     * Set the user's password.
     *
     * @param  string  $value
     * @return string
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    /**
     * Return user if exists; create and return if doesn't
     */
    public static function findOrCreateUserGoogle($user, $provider)
    {
        $existingUser = User::where($provider . '_id', $user->id)->first();
        if ($existingUser) {
            $existingUser->f_name = $user->user['name']['givenName'];
            $existingUser->l_name = $user->user['name']['familyName'];
            $existingUser->email = $user->email;
            $existingUser->attributes[$provider . '_id'] = $user->id;
            $existingUser->save();
            return $existingUser;
        } else {
            $existingUser = User::where('email', $user->email)->first();
            if ($existingUser) {
                $existingUser->f_name = $user->user['name']['givenName'];
                $existingUser->l_name = $user->user['name']['familyName'];
                $existingUser->email = $user->email;
                $existingUser->attributes[$provider . '_id'] = $user->id;
                $existingUser->save();
                return $existingUser;
            }
            $newUser = new User;
            $newUser->f_name = $user->user['name']['givenName'];
            $newUser->l_name = $user->user['name']['familyName'];
            $newUser->email = $user->email;
            $newUser->attributes[$provider . '_id'] = $user->id;
            $newUser->save();
            return $newUser;
        }
    }

}
