(function () {

    'use strict';
    angular


            .module('crypt', ['ui.router', 'ngSanitize', 'ngStorage', 'ui.bootstrap', 'satellizer', 'angular-loading-bar', 'ngFileUpload', 'angular-inview',
                'ngAside', 'fsm', 'pusher-angular', 'ngIdle', 'picardy.fontawesome'])
            .constant("customConfig", JSON.parse(customConfig))
            .config(function ($locationProvider, $stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide, IdleProvider, KeepaliveProvider) {
                // configure Idle settings
                IdleProvider.idle(30); // in seconds
                IdleProvider.timeout(9000); // in seconds
                KeepaliveProvider.interval(5000); // in seconds

                function redirectWhenLoggedOut($q, $injector, $rootScope) {

                    return {
                        responseError: function (rejection) {

                            // Need to use $injector.get to bring in $state or else we get
                            // a circular dependency error
                            var $state = $injector.get('$state');
                            // Instead of checking for a status code of 400 which might be used
                            // for other reasons in Laravel, we check for the specific rejection
                            // reasons to tell us if we need to redirect to the login state
                            var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];
                            // Loop through each rejection reason and redirect to the login
                            // state if one is encountered
                            angular.forEach(rejectionReasons, function (value, key) {

                                if (rejection.data.error === value) {

                                    // If we get a rejection corresponding to one of the reasons
                                    // in our array, we know we need to authenticate the user so
                                    // we can remove the current user from local storage
                                    // Remove the authenticated user from local storage
                                    localStorage.removeItem('user');
                                    // Flip authenticated to false so that we no longer
                                    // show UI elements dependant on the user being logged in
                                    $rootScope.authenticated = false;
                                    // Remove the current user info from rootscope
                                    $rootScope.currentUser = null;
                                    $state.go('home');
                                }
                            });
                            return $q.reject(rejection);
                        }
                    };
                }
                // Google
                $authProvider.google({
                    clientId: '1087260936038-u5v57plbt9ic8ei36jd9b645q8mqvsaj.apps.googleusercontent.com',
                    url: 'api/users/authenticate/google',
                    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
                    redirectUri: window.location.origin + '/' + 'crypt/public/login',
                    requiredUrlParams: ['scope'],
                    optionalUrlParams: ['display'],
                    scope: ['profile', 'email'],
                    scopePrefix: 'openid',
                    scopeDelimiter: ' ',
                    display: 'popup',
                    oauthType: '2.0',
                    popupOptions: {width: 452, height: 633}
                });
                // Setup for the $httpInterceptor
                $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);
                // Push the new factory onto the $http interceptor array
                $httpProvider.interceptors.push('redirectWhenLoggedOut');
                // Satellizer configuration that specifies which API
                // route the JWT should be retrieved from
                $authProvider.baseUrl = null;
                //$authProvider.httpInterceptor = true;
                $authProvider.loginUrl = 'api/users/authenticate';
                $authProvider.loginRedirect = null;
                // Redirect to the auth state if any other states
                // are requested other than users
                $urlRouterProvider.otherwise('/');
                $locationProvider.html5Mode(true);
                $stateProvider

                        .state('login', {
                            url: '/login'
                        })
                        .state('home', {
                            url: '/',
                            templateUrl: 'js/angular/components/home/index.html',
                            controller: 'HomeController as HomeCtrl'
                        })
                        .state('dashboard', {
                            url: '/mycrypt',
                            templateUrl: 'js/angular/components/dashboard/index.html',
                            controller: 'DashboardController as DashCtrl'
                        })
                        .state('settings', {
                            url: '/settings',
                            templateUrl: 'js/angular/components/settings/index.html',
                            controller: 'SettingsController as SettingsCtrl'
                        })


                        ;
            })

            .directive('ngReallyClick', ['$uibModal',
                function ($uibModal) {
                    var ModalInstanceCtrl = function ($scope, $uibModalInstance) {
                        $scope.ok = function () {
                            $uibModalInstance.close();
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    };
                    return {
                        restrict: 'A',
                        scope: {
                            ngReallyClick: "&",
                            item: "="
                        },
                        link: function (scope, element, attrs) {
                            element.bind('click', function () {
                                var message = attrs.ngReallyMessage || "Are you sure ?";
                                var modalHtml = '<div class="modal-body">' + message + '</div>';
                                modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';
                                var modalInstance = $uibModal.open({
                                    template: modalHtml,
                                    windowClass: 'delete-folder-box-modal',
                                    controller: ModalInstanceCtrl
                                });
                                modalInstance.result.then(function () {
                                    scope.ngReallyClick({item: scope.item}); //raise an error : $digest already in progress
                                }, function () {
                                    //Modal dismissed
                                });
                                //*/

                            });
                        }
                    };
                }
            ])
            .filter('trusted', ['$sce', function ($sce) {
                    return function (url) {
                        return $sce.trustAsResourceUrl(url);
                    };
                }])

            .run(['$rootScope', '$state', '$window', '$location', '$timeout', 'Idle', 'SecurityService', 'UsersService', 'customConfig',
                function ($rootScope, $state, $window, $location, $timeout, Idle,
                        SecurityService,
//                 UsersService,
                        customConfig) {


                    var user = JSON.parse(localStorage.getItem('user'));
                    if (user) {
                        Idle.watch();

                        var token = localStorage.getItem('satellizer_token');
                        window.client = new Pusher(customConfig.PUSHER_APP_KEY, {
                            authEndpoint: '/broadcasting/auth',
                            cluster: 'eu',
                            encrypted: true,
                            auth:
                                    {
                                        headers:
                                                {
                                                    'Authorization': 'Bearer ' + token
                                                }
                                    }
                        });




                        // The user's authenticated state gets flipped to
                        // true so we can now show parts of the UI that rely
                        // on the user being logged in
                        $rootScope.authenticated = true;
                        // Putting the user's data on $rootScope allows
                        // us to access it anywhere across the app. Here
                        // we are grabbing what is in local storage
                        $rootScope.currentUser = user;
                        SecurityService.update();
//                        if (user.security_clearance > 1) {
//                            UsersService.postchangeSecurityClearance('', 0);
//                        }
                    } else {
                        $rootScope.authenticated = false;
                        $rootScope.currentUser = null;
                    }


                    // $stateChangeStart is fired whenever the state changes. We can use some parameters
                    // such as toState to hook into details about the state as it is changing
                    $rootScope.$on('$stateChangeStart', function (event, toState) {
                        //scroll to top automatically

                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                        // Grab the user from local storage and parse it to an object
                        var user = JSON.parse(localStorage.getItem('user'));
                        // var allowed_states_for_guest = ['login'];
                        // If there is any user data in local storage then the user is quite
                        // likely authenticated. If their token is expired, or if they are
                        // otherwise not actually authenticated, they will be redirected to
                        // the auth state because of the rejected request anyway


                        if (user) {

                            // The user's authenticated state gets flipped to
                            // true so we can now show parts of the UI that rely
                            // on the user being logged in
                            $rootScope.authenticated = true;
                            // Putting the user's data on $rootScope allows
                            // us to access it anywhere across the app. Here
                            // we are grabbing what is in local storage
                            $rootScope.currentUser = user;
                            if (toState.name == 'home') {
                                // add state.go in a timeout function because it does not work properly in the run function
                                $timeout(function () {
                                    $state.go('dashboard');
                                });
                            }

                            if ($rootScope.currentUser.password == null && toState.name != 'settings') {
                                $timeout(function () {
                                    $state.go('settings');
                                });
                            }

                        } else {
                            if (toState.name == 'dashboard') {
                                // add state.go in a timeout function because it does not work properly in the run function
                                $timeout(function () {
                                    $state.go('home');
                                });
                            }

                            $rootScope.authenticated = false;
                            $rootScope.currentUser = null;
                        }
                    });
                }]);
})();
(function () {

    'use strict';

    angular.module('crypt').controller('BaseController', ['$scope', '$auth', '$state', '$stateParams', 'customConfig', '$rootScope', 'BaseService',
        '$window', 'UsersService', 'BookmarksService', 'FoldersService', 'SecurityService', '$uibModal', 'DashboardService'
                , BaseController]);

    function BaseController($scope, $auth, $state, $stateParams, customConfig, $rootScope, BaseService, $window, UsersService, BookmarksService, FoldersService, SecurityService, $uibModal, DashboardService) {

        var vm = this;
        vm.currentSecurityClearance = angular.copy(SecurityService.currentSecurityClearance);
        vm.currentSecurityClearanceName = angular.copy(SecurityService.currentSecurityClearanceName);
        vm.currentFolder = undefined;
        vm.bookmark = {};

        $rootScope.$on('IdleStart', function () {
            // the user appears to have gone idle
//            console.log('start');

        });

        $rootScope.$on('IdleWarn', function (e, countdown) {
            // follows after the IdleStart event, but includes a countdown until the user is considered timed out
            // the countdown arg is the number of seconds remaining until then.
            // you can change the title or display a warning dialog from here.
            // you can let them resume their session by calling Idle.watch()
//            console.log('warn');
        });

        $rootScope.$on('IdleTimeout', function () {
            // the user has timed out (meaning idleDuration + timeout has passed without any activity)
            // this is where you'd log them
            if (SecurityService.currentSecurityClearance > 1) {
                UsersService.postchangeSecurityClearance('', 0);
            }
        });

        $rootScope.$on('IdleEnd', function () {
            // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
//            console.log('back');
        });

        $rootScope.$on('Keepalive', function () {
            // do something to keep the user's session alive
//            console.log('help');
        });



        vm.store = function (bookmark) {
            if (vm.currentFolder != undefined) {
                bookmark.folder_id = vm.currentFolder.id;
            }
            BookmarksService.store(bookmark).then(function () {
                vm.bookmark = {};
            });
        };

        $scope.$watch(function () {
            return FoldersService.currentFolder;
        },
                function (newValue, oldValue) {
                    syncCurrentFolder();
                }, true);
        function syncCurrentFolder() {
            vm.currentFolder = angular.copy(FoldersService.currentFolder);
        }

        vm.openImportHtml = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'js/angular/shared/import/_html.html',
                async: true,
                controller: function ($scope, $uibModalInstance, BookmarksService) {

                    $scope.file = {};

                    $scope.import = function (file, autoRefresh) {
                        BookmarksService.importHtml(file, autoRefresh).then(function () {
                            $uibModalInstance.dismiss();
                        });
                    };
                    $scope.closeBox = function () {
                        $uibModalInstance.dismiss();
                    };
                },
                backdrop: true,
                windowClass: 'import-html-box-modal'
            });
        };

        $rootScope.$state = $state;

        vm.windowHeight = ($window.innerHeight) + 'px';

        vm.foldersCollapsed = angular.copy(DashboardService.foldersCollapsed);

        $scope.$watch(function () {
            return DashboardService.foldersCollapsed;
        },
                function (newValue, oldValue) {
                    vm.foldersCollapsed = angular.copy(DashboardService.foldersCollapsed);
                }, true);

        $scope.$watch(function () {
            return SecurityService.currentSecurityClearance;
        },
                function (newValue, oldValue) {
                    vm.currentSecurityClearance = angular.copy(SecurityService.currentSecurityClearance);
                    vm.currentSecurityClearanceName = angular.copy(SecurityService.currentSecurityClearanceName);

                }, true);

        vm.toggleCollapseFolders = function () {
            DashboardService.foldersCollapsed = !DashboardService.foldersCollapsed;


        };

        vm.changeSecurityClearance = function (level) {
            if ($rootScope.currentUser.password == null) {
                $state.go('settings');
            } else {
                if (level > $rootScope.currentUser.security_clearance) {

                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'js/angular/shared/authorization/_password.html',
                        async: true,
                        resolve: {
                            level: function () {
                                return level;
                            }
                        },
                        controller: function ($scope, $uibModalInstance, UsersService, level, SecurityService) {

                            $scope.password = '';
                            $scope.level = level;

                            $scope.changeSecurityClearance = function (password, level) {
                                if (password != '') {
                                    UsersService.postchangeSecurityClearance(password, level).then(function () {
                                        $uibModalInstance.dismiss();
                                    });
                                }
                            };
                            $scope.closeBox = function () {
                                $uibModalInstance.dismiss();
                            };
                        },
                        backdrop: true,
                        windowClass: 'authorization-box-modal'
                    });
                } else {
                    UsersService.postchangeSecurityClearance('', level);
                }
            }


        };

        vm.isActive = function (viewLocation) {
            return viewLocation === $state.current.name;
        };

        vm.authenticate = function (provider) {
            UsersService.authenticate(provider).then(function () {
                var token = localStorage.getItem('satellizer_token');

                window.client = new Pusher(customConfig.PUSHER_APP_KEY, {
                    authEndpoint: '/broadcasting/auth',
                    cluster: 'eu',
                    encrypted: true,
                    auth:
                            {
                                headers:
                                        {
                                            'Authorization': 'Bearer ' + token
                                        }
                            }
                });
            });
        };

        vm.logout = function () {
            $auth.logout().then(function () {

                UsersService.logout();
                BookmarksService.logout();
                FoldersService.logout();
                SecurityService.logout();

                // Remove the authenticated user from local storage
//                localStorage.removeItem('user');
                localStorage.clear();

                // Flip authenticated to false so that we no longer
                // show UI elements dependant on the user being logged in
                $rootScope.authenticated = false;

                // Remove the current user info from rootscope
                $rootScope.currentUser = null;

                $state.go('home');
            });
        };



    }

})();
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
(function () {

    angular.module('crypt').factory('UsersService', ['BaseService', 'FoldersService', 'BookmarksService', 'SecurityService', '$http', '$rootScope', '$auth', '$window', '$state', function (BaseService, FoldersService, BookmarksService, SecurityService, $http, $rootScope, $auth, $window, $state) {

            var service = {};
            var url = 'api/users';
            service.user = {};
            service.error = {};
            service.searchResults = [];

            service.logout = function () {
                service.user = {};
                service.error = {};
            }

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

            service.search = function (q) {
                BaseService.load();
                return $http.post(url + '/search', {q: q})
                        .success(function (data) {
                            service.searchResults = data.users;
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
(function () {

    angular.module('crypt').factory('BookmarksService', ['Upload', 'SecurityService', 'FoldersService', 'BaseService', '$http', '$rootScope', '$auth', '$window', '$state', function (Upload, SecurityService, FoldersService, BaseService, $http, $rootScope, $auth, $window, $state) {

            var service = {};
            var url = 'api/bookmarks';
            service.bookmarks = [];
            service.pagination = {};
            service.error = {};
            service.searchResults = [];
            service.searchInProgress = false;

            service.logout = function () {
                service.bookmarks = [];
                service.pagination = {};
                service.error = {};
                service.searchResults = [];
                service.searchInProgress = false;
            }



            service.index = function (page = 1, folder_id, order_by, order_by_attribute) {
                BaseService.load();
                var full_url = url + '?page=' + page;

                if (folder_id != undefined) {
                    full_url += '&folder_id=' + folder_id;
                }

                if (order_by != undefined) {
                    full_url += '&order_by=' + order_by;
                }

                if (order_by_attribute != undefined) {
                    full_url += '&order_by_attribute=' + order_by_attribute;
                }

                return $http.get(full_url)
                        .success(function (data) {
                            service.bookmarks = service.bookmarks.concat(data.bookmarks.data);
                            service.pagination = data.bookmarks;
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.indexSharedWithMe = function (page = 1) {
                BaseService.load();
                var full_url = url + '/shared/mine' + '?page=' + page;
                return $http.get(full_url)
                        .success(function (data) {
                            service.bookmarks = service.bookmarks.concat(data.bookmarks.data);
                            service.pagination = data.bookmarks;
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.indexSharedByMe = function (page = 1) {
                BaseService.load();
                var full_url = url + '/shared/others' + '?page=' + page;
                return $http.get(full_url)
                        .success(function (data) {
                            service.bookmarks = service.bookmarks.concat(data.bookmarks.data);
                            service.pagination = data.bookmarks;
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

//            service.indexFolder = function (id) {
//                BaseService.load();
//                return $http.get(url + '/folder/' + id)
//                        .success(function (data) {
//                            service.bookmarks = service.bookmarks.concat(data.bookmarks.data);
//                            service.pagination = data.bookmarks;
//                        })
//                        .error(function (error) {
//                            service.error = error;
//                        })
//                        .finally(function () {
//                            BaseService.unload();
//                        });
//            };

            service.store = function (bookmark) {
                BaseService.load();
                return $http.post(url, bookmark)
                        .success(function (data) {
                            service.bookmarks.splice(0, 0, data.bookmark);
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.storeFromShare = function (bookmark) {
                BaseService.load();
                return $http.post(url, bookmark)
                        .success(function (data) {
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.share = function (bookmark, user) {
                BaseService.load();
                return $http.post(url + '/share', {bookmark_id: bookmark.id, user_id: user.id})
                        .success(function (data) {
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };
            service.unshare = function (id) {
                BaseService.load();
                return $http.post(url + '/unshare', {id: id})
                        .success(function (data) {
                            service.bookmarks.splice(findInArrayByPivot(service.bookmarks, id), 1);
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.search = function (q) {
                BaseService.load();
                service.searchInProgress = true;
                return $http.post(url + '/search', {q: q})
                        .success(function (data) {
                            service.searchResults = data.bookmarks;
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            service.searchInProgress = false;
                            BaseService.unload();
                        });
            };

            service.update = function (bookmark) {
                BaseService.load();
                return $http.patch(url + '/' + bookmark.id, bookmark)
                        .success(function (data) {
                            var id = bookmark.id;
                            id = findInArray(service.bookmarks, id);
                            if (id == null) {
                                return false;
                            }
                            service.bookmarks[id] = data.bookmark;
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

//            service.delete = function (bookmark) {
//                BaseService.load();
//                return $http.delete(url + '/' + bookmark.id)
//                        .success(function (data) {
//                            service.bookmarks.splice(findInArray(service.bookmarks, bookmark.id), 1);
//                        })
//                        .error(function (error) {
//                            service.error = error;
//                        })
//                        .finally(function () {
//                            BaseService.unload();
//                        });
//            };

            service.deleteAll = function (bookmarks) {
                BaseService.load();
                return $http.post(url + '/all/delete', {bookmarks: bookmarks})
                        .success(function (data) {
                            for (var i = 0; i < bookmarks.length; i++) {
                                service.bookmarks.splice(findInArray(service.bookmarks, bookmarks[i].id), 1);
                            }
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.changeFolderAll = function (id, bookmarks) {
                BaseService.load();
                return $http.post(url + '/all/move', {id: id, bookmarks: bookmarks})
                        .success(function (data) {
                            if (typeof FoldersService.currentFolder !== 'undefined') {
                                for (var i = 0; i < bookmarks.length; i++) {
                                    service.bookmarks.splice(findInArray(service.bookmarks, bookmarks[i].id), 1);
                                }
                            } else {
                                for (var i = 0; i < bookmarks.length; i++) {
                                    service.bookmarks[findInArray(service.bookmarks, bookmarks[i].id)] = data.bookmarks[i];
                                }

                            }
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };


            service.refresh = function (bookmarks) {
                BaseService.load();
                return $http.post(url + '/all/refresh', {bookmarks: bookmarks})
                        .success(function (data) {
//                            for (var i = 0; i < data.bookmarks.length; i++) {
//                                service.bookmarks[findInArray(service.bookmarks, data.bookmarks[i].id)] = data.bookmarks[i];
//                            }
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.changeSecurityClearanceAll = function (level, bookmarks) {
                BaseService.load();
                return $http.post(url + '/all/security/clearance/change', {level: level, bookmarks: bookmarks})
                        .success(function (data) {
                            if ($rootScope.currentUser.security_clearance < level) {
                                for (var i = 0; i < bookmarks.length; i++) {
                                    service.bookmarks.splice(findInArray(service.bookmarks, bookmarks[i].id), 1);
                                }
                            } else {
                                for (var i = 0; i < bookmarks.length; i++) {
                                    service.bookmarks[findInArray(service.bookmarks, bookmarks[i].id)] = data.bookmarks[i];
                                }

                            }
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.importHtml = function (file, autoRefresh) {
                return  Upload.upload({
                    url: url + '/import/html',
                    data: {
                        file: file,
                        autoRefresh: autoRefresh
                    }})
                        .success(function (data) {

                            for (var i = 0; i < data.folders.length; i++) {
                                var folder = data.folders[i];
                                if (findInArray(FoldersService.folders, folder.id) === null) {
                                    FoldersService.folders.splice(0, 0, folder);
                                }
                            }

                            FoldersService.currentFolder = data.folders[data.folders.length - 1];
                            service.bookmarks = [];
                            service.index(1, FoldersService.currentFolder.id);
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.handleOpened = function (bookmark) {
                BaseService.load();
                return $http.patch(url + '/' + bookmark.id + '/opened', {})
                        .success(function (data) {

                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.get = function (id) {
                var id = id;
                id = findInArray(service.bookmarks, id);
                if (id == null) {
                    return false;
                }
                return service.bookmarks[id];
            };

            function findInArray(arraytosearch, valuetosearch) {
                for (var i = 0; i < arraytosearch.length; i++) {
                    if (arraytosearch[i].id == valuetosearch) {
                        return i;
                    }
                }
                return null;
            }
            function findInArrayByPivot(arraytosearch, valuetosearch) {
                for (var i = 0; i < arraytosearch.length; i++) {
                    if (arraytosearch[i].pivot.id == valuetosearch) {
                        return i;
                    }
                }
                return null;
            }

            return service;
        }]);
})();
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
//                console.log(service.currentSecurityClearance);
//                console.log(service.currentSecurityClearanceName);
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
(function () {

    angular.module('crypt').factory('FoldersService', ['SecurityService', 'BaseService', '$http', '$rootScope', '$auth', '$window', '$state', function (SecurityService, BaseService, $http, $rootScope, $auth, $window, $state) {

            var service = {};
            var url = 'api/folders';
            service.folders = [];
            service.currentFolder = undefined;
            service.error = {};

            service.logout = function () {
                service.folders = [];
                service.currentFolder = undefined;
            }


            service.index = function () {
                BaseService.load();
                return $http.get(url)
                        .success(function (data) {
                            service.folders = data.folders;
                            if (typeof service.currentFolder !== 'undefined') {
                                if (findInArray(service.folders, service.currentFolder.id) == null) {
                                    service.currentFolder = undefined;
                                }
                            }
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.store = function (folder) {
                BaseService.load();
                return $http.post(url, folder)
                        .success(function (data) {
                            service.folders.splice(0, 0, data.folder);
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.update = function (folder) {
                BaseService.load();
                return $http.patch(url + '/' + folder.id, folder)
                        .success(function (data) {
                            if (data.folder.security_clearance > $rootScope.currentUser.security_clearance) {
                                service.folders.splice(findInArray(service.folders, folder.id), 1);
                            } else {
                                service.folders[findInArray(service.folders, folder.id)] = data.folder;
                            }
                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };

            service.delete = function (folder) {
                BaseService.load();
                return $http.delete(url + '/' + folder.id)
                        .success(function (data) {
                            service.folders.splice(findInArray(service.folders, folder.id), 1);

                        })
                        .error(function (error) {
                            service.error = error;
                        })
                        .finally(function () {
                            BaseService.unload();
                        });
            };


            service.changeSecurityClearanceAll = function (level, bookmarks) {
                BaseService.load();
                return $http.post(url + '/all/security/clearance/change', {level: level, bookmarks: bookmarks})
                        .success(function (data) {
                            if ($rootScope.currentUser.security_clearance < level) {
                                for (var i = 0; i < bookmarks.length; i++) {
                                    service.bookmarks.splice(findInArray(service.bookmarks, bookmarks[i].id), 1);
                                }
                            }
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
(function () {

    'use strict';

    angular.module('crypt').controller('HomeController', ['$auth', '$state', '$stateParams', '$rootScope', 'BaseService', '$scope', HomeController]);

    function HomeController($auth, $state, $stateParams, $rootScope, BaseService, $scope) {

        var vm = this;


    }

})();
(function () {

    'use strict';

    angular.module('crypt').controller('DashboardController', ['$uibModalStack', '$auth', '$state', '$stateParams', '$pusher',
        '$window', '$rootScope', 'BaseService', '$scope', '$aside', 'SecurityService',
        'BookmarksService', 'FoldersService', 'DashboardService', '$uibModal', 'UsersService'
                , DashboardController]);


    function DashboardController($uibModalStack, $auth, $state, $stateParams, $pusher, $window, $rootScope, BaseService, $scope, $aside, SecurityService,
            BookmarksService, FoldersService, DashboardService, $uibModal, UsersService) {

        var vm = this;
        vm.bookmarks = [];
        vm.pagination = {};
        vm.folders = [];
        vm.currentFolder = undefined;
        vm.selected = [];
        vm.searchResults = [];
        vm.listBlocks = angular.copy(DashboardService.listBlocks);
        vm.isLoadingMore = false;
        vm.foldersCollapsed = angular.copy(DashboardService.foldersCollapsed);
        vm.editMode = false;
        vm.orderBy = undefined;
        vm.orderByAttribute = undefined;
        vm.playerVisible = angular.copy(DashboardService.playerVisible);
        vm.isPlaying = angular.copy(DashboardService.isPlaying);
        vm.sharing = {
            search: {
                q: ''
            }
        };


        $scope.$watch(function () {
            return DashboardService.listBlocks;
        },
                function (newValue, oldValue) {
                    vm.listBlocks = angular.copy(DashboardService.listBlocks);
                }, true);

        $scope.$watch(function () {
            return DashboardService.playerVisible;
        },
                function (newValue, oldValue) {
                    vm.playerVisible = angular.copy(DashboardService.playerVisible);
                }, true);

        $scope.$watch(function () {
            return DashboardService.isPlaying;
        },
                function (newValue, oldValue) {
                    vm.isPlaying = angular.copy(DashboardService.isPlaying);
                }, true);
        $scope.$watch(function () {
            return BookmarksService.pagination;
        },
                function (newValue, oldValue) {
                    vm.pagination = angular.copy(BookmarksService.pagination);
                }, true);

        $scope.$watch(function () {
            return BookmarksService.searchResults;
        },
                function (newValue, oldValue) {
                    vm.searchResults = angular.copy(BookmarksService.searchResults);
                }, true);

        $scope.$watch(function () {
            return BookmarksService.bookmarks;
        },
                function (newValue, oldValue) {
                    syncBookmarks();
                }, true);

        $scope.$watch(function () {
            return FoldersService.folders;
        },
                function (newValue, oldValue) {
                    syncFolders();
                }, true);

        $scope.$watch(function () {
            return FoldersService.currentFolder;
        },
                function (newValue, oldValue) {
                    syncCurrentFolder();
                    vm.selected = [];

                }, true);

        function syncBookmarks() {
            vm.bookmarks = angular.copy(BookmarksService.bookmarks);
        }
        function syncFolders() {
            vm.folders = angular.copy(FoldersService.folders);
        }
        function syncCurrentFolder() {
            vm.currentFolder = angular.copy(FoldersService.currentFolder);
        }

        vm.showPlayerBox = function () {
            DashboardService.playerVisible = true;
            var backdrop = angular.element(document.querySelector(".modal-backdrop"));
            var body = angular.element(document.querySelector(".modal-open"));
            var modal = angular.element(document.querySelector(".player-box-modal"));
            backdrop.removeClass('player-box-modal-backdrop-minmize');
            body.removeClass('player-box-modal-body-minmize');
            modal.removeClass('player-box-modal-minimize');
        };

        vm.switchView = function () {
            DashboardService.listBlocks = angular.copy(!DashboardService.listBlocks);
            localStorage.setItem('listBlocks', DashboardService.listBlocks);
        };

        vm.getFolder = function (folder_id) {
            if (folder_id != null) {
                var index = findInArray(FoldersService.folders, folder_id);
                if (index != null) {
                    return FoldersService.folders[index];
                }
            }
            return false;
        };

        vm.getSecurityClearance = function (security_clearance) {
            return SecurityService.securityClearances[security_clearance];
        };

        vm.typeAheadOptions = {
            debounce: {
                default: 500,
                blur: 250
            },
            getterSetter: true
        };

        vm.searchSelected = function ($item, $model, $label, $event) {
            $window.open($item.url, '_blank');
            vm.search.text = '';
        };

        vm.search = function (q) {
            return BookmarksService.search(q).then(function (data) {
                return data.data.bookmarks;
            });
        };

        vm.searchSelectedShare = function ($item, $model, $label, $event, bookmark) {
            return BookmarksService.share(bookmark, $item).then(function (data) {
                vm.sharing.search.q = '';
            });
        };

        vm.unshare = function (id) {
            return BookmarksService.unshare(id);
        };

        vm.searchUser = function (q) {
            return UsersService.search(q).then(function (data) {
                return data.data.users;
            });
        };

        var pusher = $pusher(window.client);

        var bookmarksStored = pusher.subscribe('private-users.' + $rootScope.currentUser.id + '.bookmarks');

        bookmarksStored.bind('bookmarks.stored',
                function (data) {
                    if (data.bookmark.security_clearance <= SecurityService.currentSecurityClearance) {
                        var index = findInArray(BookmarksService.bookmarks, data.bookmark.id);
                        if (index == null) {
                            if (typeof FoldersService.currentFolder === 'undefined') {
                                FoldersService.index().then(function () {
                                    BookmarksService.bookmarks.splice(0, 0, data.bookmark);
                                })
                            } else {
                                if (data.bookmark.folder_id == FoldersService.currentFolder.id) {
                                    BookmarksService.bookmarks.splice(0, 0, data.bookmark);
                                }
                            }
                        }
                    }
                }
        );

        bookmarksStored.bind('bookmarks.refreshed',
                function (data) {
                    if (data.bookmark.security_clearance <= SecurityService.currentSecurityClearance) {
                        var index = findInArray(BookmarksService.bookmarks, data.bookmark.id);
                        if (index != null) {
                            BookmarksService.bookmarks[index] = data.bookmark;
                        }
                    }
                }
        );

        vm.storeFromShare = function (bookmark) {
            BookmarksService.storeFromShare({url: bookmark.url});
        };

        $scope.$watch(function () {
            return DashboardService.foldersCollapsed;
        },
                function (newValue, oldValue) {
                    vm.foldersCollapsed = angular.copy(DashboardService.foldersCollapsed);
                    if (!vm.foldersCollapsed) {
                        var asideInstance = $aside.open({
                            templateUrl: 'js/angular/shared/folders/_index.html',
                            controllerAs: 'DashboardFoldersCtrl',
                            windowClass: 'folders-aside',
                            scope: $scope,
                            controller: function (folders, currentFolder) {
                                var vm = this;
                                vm.folders = folders;
                                vm.currentFolder = currentFolder;
                                vm.folder = {};

                                $scope.$watch(function () {
                                    return FoldersService.folders;
                                },
                                        function (newValue, oldValue) {
                                            syncFolders();
                                        }, true);

                                $scope.$watch(function () {
                                    return FoldersService.currentFolder;
                                },
                                        function (newValue, oldValue) {
                                            syncCurrentFolder();

                                        }, true);

                                function syncFolders() {
                                    vm.folders = angular.copy(FoldersService.folders);
                                }
                                function syncCurrentFolder() {
                                    vm.currentFolder = angular.copy(FoldersService.currentFolder);
                                }

                                vm.storeFolder = function (folder) {

                                    var modalInstance = $uibModal.open({
                                        animation: true,
                                        templateUrl: 'js/angular/shared/folders/_newFolder.html',
                                        async: true,
                                        controller: function ($scope, $uibModalInstance, FoldersService) {

                                            $scope.folder = {name: ''};

                                            $scope.store = function (folder) {
                                                if (folder.name != '') {
                                                    FoldersService.store(folder).then(function () {
                                                        $uibModalInstance.dismiss();
                                                    });
                                                }
                                            };
                                            $scope.closeBox = function () {
                                                $uibModalInstance.dismiss();
                                            };
                                        },
                                        backdrop: true,
                                        windowClass: 'new-folder-box-modal'
                                    });

                                };

                                vm.editFolder = function (folder) {

                                    var modalInstance = $uibModal.open({
                                        animation: true,
                                        templateUrl: 'js/angular/shared/folders/_editFolder.html',
                                        async: true,
                                        resolve: {
                                            folder: function () {
                                                return angular.copy(folder);
                                            }
                                        },
                                        controller: function ($scope, $uibModalInstance, FoldersService, folder) {

                                            $scope.folder = folder

                                            $scope.update = function (folder) {
                                                if (folder.name != '') {
                                                    FoldersService.update(folder).then(function () {
                                                        $uibModalInstance.dismiss();
                                                    });
                                                }
                                            };

                                            $scope.closeBox = function () {
                                                $uibModalInstance.dismiss();
                                            };
                                        },
                                        backdrop: true,
                                        windowClass: 'edit-folder-box-modal'
                                    });

                                };

                                vm.deleteFolder = function (folder) {
                                    FoldersService.delete(folder).then(function (data) {
                                        if (typeof FoldersService.currentFolder === 'undefined') {
                                            for (var i = 0; i < data.data.bookmarks.length; i++) {
                                                BookmarksService.bookmarks.splice(findInArray(BookmarksService.bookmarks, data.data.bookmarks[i]), 1);
                                            }
                                        } else if (FoldersService.currentFolder.id === folder.id) {
                                            FoldersService.currentFolder = undefined;
                                            BookmarksService.bookmarks = [];
                                            BookmarksService.index();
                                        }
                                    });
                                };

                            },
                            placement: 'left',
                            size: 'sm',
                            resolve: {
                                folders: function () {
                                    return vm.folders;
                                },
                                currentFolder: function () {
                                    return vm.currentFolder;
                                }
                            }
                        });
                        asideInstance.closed.then(function () {
                            DashboardService.foldersCollapsed = true;
                        });
                    }
                }, true);

        vm.editBookmark = function (id) {
            var bookmark = BookmarksService.get(id);
            if (bookmark != false) {
                var asideInstance = $aside.open({
                    templateUrl: 'js/angular/shared/bookmarks/_edit.html',
                    controllerAs: 'EditBookmarkCtrl',
                    windowClass: 'edit-bookmark-aside',
                    placement: 'right',
                    size: 'sm',
                    resolve: {
                        bookmark: function () {
                            return angular.copy(bookmark);
                        }
                    },
                    controller: function ($uibModalInstance, bookmark) {
                        var vm = this;
                        vm.bookmark = bookmark;

                        vm.update = function (bookmark) {
                            BookmarksService.update(bookmark).then(function (data) {
                                $uibModalInstance.dismiss();
                            });
                        };
                        vm.closeBox = function () {
                            $uibModalInstance.dismiss();
                        };
                    }

                });
            }
        };

        vm.openPlayer = function (bookmark) {

            if (vm.isPlaying) {
                $uibModalStack.dismissAll('playing different video');
            }

            var playerModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'js/angular/shared/player/_player.html',
                async: true,
                controllerAs: 'PlayerCtrl',
//                backdrop: true,
                backdrop: 'static',
                windowClass: 'player-box-modal',
                size: 'lg',
                resolve: {
                    bookmark: function () {
                        return angular.copy(bookmark);
                    }
                },
                controller: function ($uibModalInstance, bookmark, DashboardService) {
                    var vm = this;
                    vm.bookmark = bookmark;
                    vm.visible = angular.copy(DashboardService.playerVisible);
                    DashboardService.isPlaying = true;
                    vm.isPlaying = angular.copy(DashboardService.isPlaying);

                    $scope.$watch(function () {
                        return DashboardService.playerVisible;
                    },
                            function (newValue, oldValue) {
                                vm.visible = angular.copy(DashboardService.playerVisible);
                            }, true);

                    $scope.$watch(function () {
                        return DashboardService.isPlaying;
                    },
                            function (newValue, oldValue) {
                                vm.isPlaying = angular.copy(DashboardService.isPlaying);

                            }, true);

                    vm.closeBox = function () {
                        $uibModalInstance.close();
                    };

                    vm.hideBox = function () {
                        DashboardService.playerVisible = false;
                        var backdrop = angular.element(document.querySelector(".modal-backdrop"));
                        var body = angular.element(document.querySelector(".modal-open"));
                        var modal = angular.element(document.querySelector(".player-box-modal"));
                        backdrop.addClass('player-box-modal-backdrop-minmize');
                        body.addClass('player-box-modal-body-minmize');
                        modal.addClass('player-box-modal-minimize');

                    };

                }
            }).result.then(function () {
                //Get triggers when modal is closed
            }, function (reason) {


            }).finally(function () {
                DashboardService.playerVisible = true;
                DashboardService.isPlaying = false;
                var backdrop = angular.element(document.querySelector(".modal-backdrop"));
                var body = angular.element(document.querySelector(".modal-open"));
                var modal = angular.element(document.querySelector(".player-box-modal"));
                backdrop.removeClass('player-box-modal-backdrop-minmize');
                body.removeClass('player-box-modal-body-minmize');
                modal.removeClass('player-box-modal-minimize');
            });
        }



        vm.toggleSelectAll = function () {
            if (vm.selected.length == 0) {
                vm.selected = angular.copy(vm.bookmarks);
            } else {
                vm.selected = [];
            }
        };

        vm.index = function (page, folder, order_by, order_by_attribute) {
            var folder_id = folder;
            if (folder_id != undefined) {
                folder_id = folder.id;
            }

            if (folder != vm.currentFolder) {
                BookmarksService.bookmarks = [];
            }

            if (folder_id != undefined) {
                FoldersService.currentFolder = {id: folder_id};
            } else {
                FoldersService.currentFolder = folder_id;
            }

            vm.isLoadingMore = true;
            BookmarksService.index(page, folder_id, order_by, order_by_attribute).then(function () {
                vm.isLoadingMore = false;


                DashboardService.foldersCollapsed = true;
            });
            ;
        };

        vm.indexSharedWithMe = function (page) {
//            if (vm.currentFolder != 'Shared With Me') {
            BookmarksService.bookmarks = [];
//            }
            FoldersService.currentFolder = 'Shared With Me';
            BookmarksService.indexSharedWithMe(page).then(function () {
                DashboardService.foldersCollapsed = true;
            });
        };
        vm.indexSharedByMe = function (page) {
//            if (vm.currentFolder != 'Shared By Me') {
            BookmarksService.bookmarks = [];
//            }
            FoldersService.currentFolder = 'Shared By Me';
            BookmarksService.indexSharedByMe(page).then(function () {
                DashboardService.foldersCollapsed = true;
            });
        };

        vm.indexFolders = function () {
            FoldersService.index();
        };

        vm.selectBookmark = function ($event, bookmark) {
            if (vm.editMode) {
                var index = findInArray(vm.selected, bookmark.id);
                if (index == null) {
                    vm.selected.push(bookmark);
                } else {
                    vm.selected.splice(index, 1);
                }
            }
        };





        vm.refresh = function (selected) {
            BookmarksService.refresh(selected).then(function () {
                vm.selected = [];
            });
        };

        vm.changeFolder = function (id, selected) {
            BookmarksService.changeFolderAll(id, selected).then(function () {
                vm.selected = [];
            });
        };

//        vm.indexFolder = function (id) {
//            BookmarksService.indexFolder(id).then(function () {
//                FoldersService.currentFolder = {id: id};
//                DashboardService.foldersCollapsed = true;
//            });
//        };

//        vm.delete = function (bookmark) {
//            BookmarksService.delete(bookmark);
//        };

        function findInArray(arraytosearch, valuetosearch) {
            for (var i = 0; i < arraytosearch.length; i++) {
                if (arraytosearch[i].id == valuetosearch) {
                    return i;
                }
            }
            return null;
        }



        vm.deleteSelected = function (selected) {
            BookmarksService.deleteAll(selected).then(function () {
                vm.selected = [];
            });

        };

        vm.changeSecurityClearanceSelected = function (level, selected) {
            BookmarksService.changeSecurityClearanceAll(level, selected).then(function () {
                vm.selected = [];
            });
        };

        vm.isBookmarkSelected = function (id) {
            if (findInArray(vm.selected, id) == null) {
                return false;
            }
            return true;
        };

        vm.getCurrentFolder = function (id) {
            var index = findInArray(vm.folders, id);
            var folder = vm.folders[index];
            return folder;
        };

        vm.bookmarkOpened = function (bookmark) {
            BookmarksService.handleOpened(bookmark);
        };

        function findInArray(arraytosearch, valuetosearch) {
            for (var i = 0; i < arraytosearch.length; i++) {
                if (arraytosearch[i].id == valuetosearch) {
                    return i;
                }
            }
            return null;
        }

        vm.isEmpty = function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }
            return true;
        };

//        vm.index();
        vm.indexFolders();

    }

})();
(function () {

    'use strict';

    angular.module('crypt').controller('SettingsController', ['$auth', '$state', '$stateParams', '$rootScope', 'BaseService', 'UsersService', '$scope', SettingsController]);

    function SettingsController($auth, $state, $stateParams, $rootScope, BaseService, UsersService, $scope) {

        var vm = this;
        vm.password = {
            old: '',
            new : '',
            confirm_new: '',
            is_null: $rootScope.currentUser.password == null ? true : false

        };


        vm.changePassword = function (password) {
            UsersService.changePassword(password).then(function () {
                $state.go('dashboard');
            });
        };


    }

})();
//# sourceMappingURL=all.js.map
