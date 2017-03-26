(function () {

    angular.module('crypt').factory('UsersService', ['BaseService', 'FoldersService', 'BookmarksService', 'SecurityService', '$http', '$rootScope', '$auth', '$window', '$state', function (BaseService, FoldersService, BookmarksService, SecurityService, $http, $rootScope, $auth, $window, $state) {

            var service = {};
            var url = 'api/users';
            service.user = {};
            service.error = {};

            service.postchangeSecurityClearance = function (password, level) {
                BaseService.load();
                return $http.post(url + '/security/clearance/change', {password: password, level: level})
                        .success(function (data) {
                            SecurityService.changeSecurityClearance(level);

                            FoldersService.index().then(function () {
                                BookmarksService.bookmarks = [];
                                if (typeof FoldersService.currentFolder === 'undefined') {
                                    BookmarksService.index();
                                } else {
                                    BookmarksService.index(1, FoldersService.currentFolder.id);
                                }
                            });
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.authenticate = function (provider) {
                return $auth.authenticate(provider).then(function (data) {
                    var user = JSON.stringify(data.data.user);

                    // Set the stringified user data into local storage
                    localStorage.setItem('user', user);

                    // The user's authenticated state gets flipped to
                    // true so we can now show parts of the UI that rely
                    // on the user being logged in
                    $rootScope.authenticated = true;


                    // Putting the user's data on $rootScope allows
                    // us to access it anywhere across the app
                    $rootScope.currentUser = data.data.user;
                    SecurityService.update();

                    $state.go('dashboard')

                });
            };

            service.changePassword = function (password) {
                BaseService.load();
                return $http.patch(url + '/update/password', password)
                        .success(function (data) {
                            var user = JSON.stringify(data.user);
                            localStorage.setItem('user', user);
                            $rootScope.currentUser = data.user;
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
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