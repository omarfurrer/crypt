(function () {

    'use strict';

    angular.module('crypt').controller('NavbarController', ['$scope', '$rootScope', '$state', '$auth', '$uibModal', 'SecurityService', 'UsersService'
                , 'BookmarksService', 'FoldersService', NavbarController]);

    function NavbarController($scope, $rootScope, $state, $auth, $uibModal, SecurityService, UsersService, BookmarksService, FoldersService) {

        var vm = this;
        vm.switchSecurityClearance;
        vm.newBookmark;

        init();

        // Watch security clearance
        $scope.$watch(function () {
            return SecurityService.currentSecurityClearance;
        },
                function (newValue, oldValue) {
                    syncSwitchSecurityClearance();
                }, true);


        /**
         * Store new bookmark to server and add it to dashboard.
         *
         * @param {Object} bookmark
         * @returns {void}
         */
        vm.store = function (bookmark) {
            if (FoldersService.currentFolder != undefined) {
                bookmark.folder_id = FoldersService.currentFolder.id;
            }
            BookmarksService.store(bookmark).then(function () {
                resetNewBookmark();
            });
        };

        /**
         * Handle bulk importing bookmarks using .html files.
         *
         * @returns {void}
         */
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

        /**
         * Handle user logging out.
         *
         * @returns {void}
         */
        vm.logout = function () {
            $auth.logout().then(function () {

                UsersService.logout();
                BookmarksService.logout();
                FoldersService.logout();
                SecurityService.logout();

                // Remove the authenticated user from local storage
                localStorage.clear();

                // Flip authenticated to false so that we no longer
                // show UI elements dependant on the user being logged in
                $rootScope.authenticated = false;

                // Remove the current user info from rootscope
                $rootScope.currentUser = null;

                $state.go('home');
            });
        };

        /**
         * Change security clearance using the switch in the navbar.
         *
         * @param {integer} level
         * @returns void
         */
        vm.changeSecurityClearance = function (level) {

            // If user didn't set a custom password yet, make him
            if ($rootScope.currentUser.password == null) {
                $state.go('settings');
            } else {
                // Only ask for password if going from public to private
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
                                    UsersService.postchangeSecurityClearance(password, level)
                                            .then(handleSuccessSecurityClearanceChange, handleFailedSecurityClearanceChange);
                                }
                            };

                            // When the modal finally closes, wether success or failure, sync switchSecurityClearance
                            $scope.$on('modal.closing', function (event, reason, closed) {
                                syncSwitchSecurityClearance();
                            });

                            /**
                             * handle closing password box
                             */
                            $scope.closeBox = function () {
                                $uibModalInstance.dismiss();
                            };

                            /**
                             * Handle in the event that a user requested a security clearance
                             * change and got an error like a wrong password.
                             *
                             * @returns {void}
                             */
                            function handleFailedSecurityClearanceChange() {
                            }

                            /**
                             * Handle in the event that a user requested a security clearance
                             * change and got a success.
                             *
                             * @returns {void}
                             */
                            function handleSuccessSecurityClearanceChange() {
                                $uibModalInstance.dismiss();
                            }
                        },
                        backdrop: true,
                        windowClass: 'authorization-box-modal'
                    });
                } else {
                    UsersService.postchangeSecurityClearance('', level);
                }
            }
        };

        /**
         * Init function
         *
         * @returns {void}
         */
        function init() {
            syncSwitchSecurityClearance();
            resetNewBookmark();
        }

        /**
         * Sync the navabr security clearnace with the security clearance service
         *
         * @returns {void}
         */
        function syncSwitchSecurityClearance() {
            vm.switchSecurityClearance = angular.copy(SecurityService.currentSecurityClearance);
        }

        /**
         * Reset new bookmark to empty.
         *
         * @returns {void}
         */
        function resetNewBookmark() {
            vm.newBookmark = {};
        }

    }

})();