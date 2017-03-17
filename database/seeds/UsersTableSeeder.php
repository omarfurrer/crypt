<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        App\User::create([
            'f_name' => 'omar',
            'l_name' => 'furrer',
            'email' => 'theh2h@gmail.com',
            'password' => 'HIDATSHII',
            'google_id' => '105481667045019122810',
        ]);
    }

}
