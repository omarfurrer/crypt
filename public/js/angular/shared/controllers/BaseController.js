(function () {

    'use strict';

    angular.module('crypt').controller('BaseController', BaseController);

    function BaseController($scope, $auth, $state, $stateParams, $rootScope, BaseService, $window, UsersService, SecurityService, $uibModal) {

        var vm = this;
        vm.currentSecurityClearanceName = angular.copy(SecurityService.currentSecurityClearanceName);

        $rootScope.$state = $state;

        vm.windowHeight = ($window.innerHeight) + 'px';

        $scope.$watch(function () {
            return SecurityService.currentSecurityClearance;
        },
                function (newValue, oldValue) {
                    vm.currentSecurityClearanceName = angular.copy(SecurityService.currentSecurityClearanceName);

                }, true);

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
            UsersService.authenticate(provider);
        };

        vm.logout = function () {
            $auth.logout().then(function () {

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