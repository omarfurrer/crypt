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
                '../bower_components/angular-aside/dist/css/angular-aside.min.css'
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
                '../bower_components/angular-inview/angular-inview.js',
                '../bower_components/angular-aside/dist/js/angular-aside.js',
                '../bower_components/fsm-sticky-header/src/fsm-sticky-header.js',
                '../bower_components/angular-sanitize/angular-sanitize.js',
                '../bower_components/ng-idle/angular-idle.js',
                '../bower_components/pusher-js/dist/pusher.js',
                '../bower_components/pusher-angular/lib/pusher-angular.js',
                '../bower_components/angular-fontawesome/dist/angular-fontawesome.js'
            ], 'public/js/app.js')
//            .copy('resources/assets/bower_components/font-awesome/fonts/**', 'public/css/fonts')
//            .copy('resources/assets/bower_components/bootstrap-sass/assets/fonts/**', 'public/fonts')
            .copy('resources/assets/bower_components/font-awesome/fonts/**', 'public/build/css/fonts')
            .copy('resources/assets/bower_components/bootstrap-sass/assets/fonts/**', 'public/build/fonts')
            .scripts([
                './public/js/angular/app.js',
                './public/js/angular/shared/controllers/BaseController.js',
                './public/js/angular/shared/services/BaseService.js',
                './public/js/angular/shared/services/UsersService.js',
                './public/js/angular/shared/services/BookmarksService.js',
                './public/js/angular/shared/services/SecurityService.js',
                './public/js/angular/shared/services/FoldersService.js',
                './public/js/angular/shared/services/DashboardService.js',
                './public/js/angular/components/home/HomeController.js',
                './public/js/angular/components/dashboard/DashboardController.js',
                './public/js/angular/components/settings/SettingsController.js',
            ], 'public/js/angular/all.js')
            .version(["public/js/app.js", "public/css/pure/all.css", "public/css/app.css", "public/js/angular/all.js"])
//            .webpack('app.js', './public/js/webpack/app.js')
            ;




});
