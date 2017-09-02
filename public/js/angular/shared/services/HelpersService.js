(function () {

    angular.module('crypt').factory('HelpersService', [
        function () {

            var service = {};

            service.findInArray = function (arraytosearch, valuetosearch) {
                for (var i = 0; i < arraytosearch.length; i++) {
                    if (arraytosearch[i].id == valuetosearch) {
                        return i;
                    }
                }
                return null;
            };

            return service;
        }]);
})();