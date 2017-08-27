(function () {

    'use strict';

    angular.module('crypt').controller('BaseController', ['$scope', '$state', '$rootScope',
        '$window', 'UsersService', 'FoldersService', 'SecurityService', 'DashboardService'
                , BaseController]);

    function BaseController($scope, $state, $rootScope, $window, UsersService, FoldersService, SecurityService, DashboardService) {

        var vm = this;
        vm.currentSecurityClearance = angular.copy(SecurityService.currentSecurityClearance);
        vm.currentSecurityClearanceName = angular.copy(SecurityService.currentSecurityClearanceName);
        vm.currentFolder = undefined;
        vm.bookmark = {};

        $rootScope.$state = $state;

        vm.windowHeight = ($window.innerHeight) + 'px';

        vm.foldersCollapsed = angular.copy(DashboardService.foldersCollapsed);


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

        $scope.$watch(function () {
            return FoldersService.currentFolder;
        },
                function (newValue, oldValue) {
                    syncCurrentFolder();
                }, true);

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

        function syncCurrentFolder() {
            vm.currentFolder = angular.copy(FoldersService.currentFolder);
        }

        vm.toggleCollapseFolders = function () {
            DashboardService.foldersCollapsed = !DashboardService.foldersCollapsed;
        };

        vm.isActive = function (viewLocation) {
            return viewLocation === $state.current.name;
        };

        vm.authenticate = function (provider) {
            UsersService.authenticate(provider).then(function () {
                var token = localStorage.getItem('satellizer_token');

                window.client = new Pusher(JSON.parse(customConfig).PUSHER_APP_KEY, {
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





    }

})();