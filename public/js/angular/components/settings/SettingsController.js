(function () {

    'use strict';

    angular.module('crypt').controller('SettingsController', SettingsController);

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