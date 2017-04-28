(function () {

    angular.module('crypt').factory('SecurityService', ['BaseService', '$http', '$rootScope', '$auth', '$window', '$state', function (BaseService, $http, $rootScope, $auth, $window, $state) {
            var service = {};
            service.securityClearances = ['public', 'private', 'crypto'];

            service.logout = function () {
                service.currentSecurityClearance = undefined;
                service.currentSecurityClearanceName = undefined;
            };

            service.changeSecurityClearance = function (level) {
                service.currentSecurityClearance = level;
                service.currentSecurityClearanceName = service.securityClearances[service.currentSecurityClearance];
                $rootScope.currentUser.security_clearance = level;
                var user = JSON.stringify($rootScope.currentUser);
                localStorage.setItem('user', user);
            };

            service.update = function () {
                service.currentSecurityClearance = $rootScope.currentUser.security_clearance;
                service.currentSecurityClearanceName = service.securityClearances[service.currentSecurityClearance];
                console.log(service.currentSecurityClearance);
                console.log(service.currentSecurityClearanceName);
            };



            function findInArray(arraytosearch, valuetosearch) {
                for (var i = 0; i < arraytosearch.length; i++) {
                    if (arraytosearch[i].id == valuetosearch) {
                        return i;
                    }
                }
                return null;
            }

            return service;
        }]);
})();