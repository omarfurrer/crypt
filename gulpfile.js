var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function (mix) {
    mix
            .styles([
                '../bower_components/font-awesome/css/font-awesome.css',
                '../bower_components/bootstrap-social/bootstrap-social.css',
                '../bower_components/angular-loading-bar/build/loading-bar.min.css',
            ], "public/css/pure/")
            .sass('app.scss', 'public/css')
            .scripts([
                '../bower_components/jquery/dist/jquery.min.js',
                '../bower_components/angular/angular.js',
                '../bower_components/ngstorage/ngStorage.min.js',
                '../bower_components/angular-ui-router/release/angular-ui-router.min.js',
                '../bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                '../bower_components/satellizer/dist/satellizer.js',
                '../bower_components/angular-loading-bar/build/loading-bar.min.js',
                '../bower_components/ng-file-upload/ng-file-upload-all.min.js',
            ], 'public/js/app.js')
            .copy('resources/assets/bower_components/font-awesome/fonts/**', 'public/css/fonts')
            .copy('resources/assets/bower_components/bootstrap-sass/assets/fonts/**', 'public/fonts');



});
