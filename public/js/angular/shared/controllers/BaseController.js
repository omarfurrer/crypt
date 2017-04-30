(function () {

    'use strict';

    angular.module('crypt').controller('BaseController', BaseController);

    function BaseController($scope, $auth, $state, $stateParams, $rootScope, BaseService, $window, UsersService, BookmarksService, FoldersService, SecurityService, $uibModal, DashboardService) {

        var vm = this;
        vm.currentSecurityClearanceName = angular.copy(SecurityService.currentSecurityClearanceName);
        vm.currentFolder = undefined;
        vm.bookmark = {};

        $rootScope.$on('IdleStart', function () {
            // the user appears to have gone idle
            console.log('start');

        });

        $rootScope.$on('IdleWarn', function (e, countdown) {
            // follows after the IdleStart event, but includes a countdown until the user is considered timed out
            // the countdown arg is the number of seconds remaining until then.
            // you can change the title or display a warning dialog from here.
            // you can let them resume their session by calling Idle.watch()
            console.log('warn');
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
            console.log('back');
        });

        $rootScope.$on('Keepalive', function () {
            // do something to keep the user's session alive
            console.log('help');
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

                window.client = new Pusher('d1e5009554a0bcd357a4', {
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
                localStorage.removeItem('user');

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