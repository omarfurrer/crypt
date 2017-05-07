(function () {

    angular.module('crypt').factory('DashboardService', ['$rootScope', '$state',
        function ($rootScope, Flash, $state) {

            var service = {};
            service.foldersCollapsed = true;
            service.playerVisible = true;
            service.isPlaying = false;
            var listBlocksLocalStorage = localStorage.getItem('listBlocks');
            service.listBlocks = listBlocksLocalStorage == null ? false : listBlocksLocalStorage === 'true' ? true : false;






            return service;

        }]);

})();