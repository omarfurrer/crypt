<!DOCTYPE html>
<html lang="en">
    <head>
        <base href="<?php echo env('BASE_PATH', '/crypt/public/') ?>">
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Crypt</title>

        <!--<link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">-->
        <link rel="stylesheet" href="{{ elixir('css/app.css')}}">
        <link rel="stylesheet" href="{{ elixir('css/pure/all.css')}}">
        <meta name="csrf-token" content="<?= csrf_token() ?>" />

    </head>
    <body ng-app="crypt" ng-controller="BaseController as base" >

    <ng-include ng-if="!$state.includes('home')"  src="'js/angular/shared/navbar/_navbar.html'"></ng-include>

    <div   ui-view></div>


    <script src="{{ elixir('js/app.js')}}"></script>

    <script>
        var customConfig = '{"PUSHER_APP_KEY": "{!! env('PUSHER_KEY') !!}"}';
    </script>

    <script src="//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.js"></script>
    @if(env('APP_ENV') == 'local')
    <script src="js/angular/app.js"></script>
    <script src="js/angular/shared/controllers/BaseController.js"></script>
    <script src="js/angular/shared/services/BaseService.js"></script>
    <script src="js/angular/shared/services/UsersService.js"></script>
    <script src="js/angular/shared/services/BookmarksService.js"></script>
    <script src="js/angular/shared/services/SecurityService.js"></script>
    <script src="js/angular/shared/services/FoldersService.js"></script>
    <script src="js/angular/shared/services/DashboardService.js"></script>
    <script src="js/angular/components/home/HomeController.js"></script>
    <!--<script src="js/webpack/app.js"></script>-->
    <script src="js/angular/components/dashboard/DashboardController.js"></script>
    <script src="js/angular/components/settings/SettingsController.js"></script>
    @else
    <script src="{{ elixir('js/angular/all.js')}}"></script>
    @endif

</body>
</html>
