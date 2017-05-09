(function () {

    'use strict';

    angular.module('crypt').controller('HomeController', HomeController);

    function HomeController($auth, BookmarksService, $state, $stateParams, $rootScope, BaseService, $scope) {

        var vm = this;

        BookmarksService.discover().then(function (data) {
            var onMobile = false;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
                onMobile = true;
            }

            if ((onMobile === false)) {
                console.log(data.data.bookmarks.length);
                // Init plugin
                $('canvas').constellation({bookmarks: data.data.bookmarks, length: data.data.bookmarks.length});
            } else {
            }
        });
    }

})();