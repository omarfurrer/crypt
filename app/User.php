<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Socialite;
use Elasticquent\ElasticquentTrait;
use Hash;

class User extends Authenticatable {

    use Notifiable;
    use ElasticquentTrait;

    /**
     * The elasticsearch settings.
     *
     * @var array
     */
    protected $indexSettings = [
        'analysis' => [
            'char_filter' => [
                'replace' => [
                    'type' => 'mapping',
                    'mappings' => [
                        '&=> and '
                    ],
                ],
            ],
            'filter' => [
                'word_delimiter' => [
                    'type' => 'word_delimiter',
                    'split_on_numerics' => false,
                    'split_on_case_change' => true,
                    'generate_word_parts' => true,
                    'generate_number_parts' => true,
                    'catenate_all' => true,
                    'preserve_original' => true,
                    'catenate_numbers' => true,
                ]
            ],
            'analyzer' => [
                'default' => [
                    'type' => 'custom',
                    'char_filter' => [
                        'html_strip',
                        'replace',
                    ],
                    'tokenizer' => 'whitespace',
                    'filter' => [
                        'lowercase',
                        'word_delimiter',
                    ],
                ],
            ],
        ],
    ];

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

    function getIndexDocumentData()
    {
        $data = $this->toArray();
        return $data;
    }

    /**
     * A product can belong to many users
     *
     * @return BelongsToMany
     */
    public function sharedWithMe()
    {
        return $this->belongsToMany('App\Bookmark', 'shared_bookmarks',
                                    'shared_with_id', 'bookmark_id')->withTimestamps();
    }

    /**
     * A product can belong to many users
     *
     * @return BelongsToMany
     */
    public function sharedByMe()
    {
        return $this->belongsToMany('App\Bookmark', 'shared_bookmarks',
                                    'shared_by_id', 'bookmark_id')->withTimestamps();
    }

}
