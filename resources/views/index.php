<!DOCTYPE html>
<html lang="en">
    <head>
        <base href="<?php echo env('BASE_PATH', '/crypt/public/') ?>">
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Crypt</title>

        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="css/app.css">
        <link rel="stylesheet" href="css/pure/all.css">

    </head>
    <body ng-app="crypt" ng-controller="BaseController as base">

    <ng-include ng-if="!$state.includes('home')"  src="'js/angular/shared/navbar/_navbar.html'"></ng-include>

    <div   ui-view></div>


    <script src="js/app.js"></script>
    <script src="js/angular/app.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.js"></script>

    <script src="js/angular/shared/controllers/BaseController.js"></script>
    <script src="js/angular/shared/services/BaseService.js"></script>
    <script src="js/angular/shared/services/UsersService.js"></script>
    <script src="js/angular/shared/services/BookmarksService.js"></script>
    <script src="js/angular/shared/services/SecurityService.js"></script>
    <script src="js/angular/shared/services/FoldersService.js"></script>
    <script src="js/angular/components/home/HomeController.js"></script>
    <script src="js/angular/components/dashboard/DashboardController.js"></script>
    <script src="js/angular/components/settings/SettingsController.js"></script>
</body>
</html>
