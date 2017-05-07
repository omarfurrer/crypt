(function () {

    angular.module('crypt').factory('DashboardService', ['$rootScope', '$state',
        function ($rootScope, Flash, $state) {

            var service = {};
            service.foldersCollapsed = true;
            service.playerVisible = true;
            service.isPlaying = false;




            return service;

        }]);

})();