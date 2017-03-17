(function () {

    angular.module('crypt').factory('BaseService', ['$rootScope', '$state',
        function ($rootScope, Flash, $state) {

            var service = {};

            $rootScope.$state = $state;

            service.load = function () {
                $rootScope.loading = true;
            };

            service.unload = function () {
                $rootScope.loading = false;
            };

            service.isEmpty = function (obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop))
                        return false;
                }

                return true && JSON.stringify(obj) === JSON.stringify({});
            }



            return service;

        }]);

})();