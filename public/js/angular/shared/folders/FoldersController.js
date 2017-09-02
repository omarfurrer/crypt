(function () {

    'use strict';

    angular.module('crypt').controller('FoldersController', ['$scope', '$uibModal', 'BookmarksService', 'FoldersService', 'HelpersService', FoldersController]);

    function FoldersController($scope, $uibModal, BookmarksService, FoldersService, HelpersService) {

        var vm = this;

        /**
         * List of folders.
         */
        vm.folders;

        /**
         * Current folder Object
         */
        vm.currentFolder;

        init();

        // Watch list of folders
        $scope.$watch(function () {
            return FoldersService.folders;
        },
                function (newValue, oldValue) {
                    syncFolders();
                }, true);

        // Watch current folder
        $scope.$watch(function () {
            return FoldersService.currentFolder;
        },
                function (newValue, oldValue) {
                    syncCurrentFolder();

                }, true);

        /**
         * Open modal to create a new folder.
         *
         * @returns {void}
         */
        vm.createFolder = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'js/angular/shared/folders/_newFolder.html',
                async: true,
                controllerAs: 'StoreFoldersCtrl',
                controller: function ($scope, $uibModalInstance, FoldersService) {
                    var vm = this;

                    vm.newFolder = {name: ''};

                    /**
                     * Store folder to server.
                     *
                     * @param {Object} folder
                     * @returns {void}
                     */
                    vm.store = function (folder) {
                        if (folder.name != '') {
                            FoldersService.store(folder).then(function () {
                                $uibModalInstance.dismiss();
                            });
                        }
                    };

                    /**
                     * Close modal box.
                     *
                     * @returns {void}
                     */
                    vm.closeBox = function () {
                        $uibModalInstance.dismiss();
                    };

                },
                backdrop: true,
                windowClass: 'new-folder-box-modal'
            });

        };

        /**
         * Open modal to edit existing folder.
         *
         * @param {Object} folder
         * @returns {void}
         */
        vm.editFolder = function (folder) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'js/angular/shared/folders/_editFolder.html',
                async: true,
                controllerAs: 'UpdateFoldersCtrl',
                resolve: {
                    folder: function () {
                        return angular.copy(folder);
                    }
                },
                controller: function ($scope, $uibModalInstance, FoldersService, folder) {
                    var vm = this;

                    vm.folder = folder;

                    /**
                     * Push folder updates to server.
                     *
                     * @param {Object} folder
                     * @returns {void}
                     */
                    vm.update = function (folder) {
                        if (folder.name != '') {
                            FoldersService.update(folder).then(function () {
                                $uibModalInstance.dismiss();
                            });
                        }
                    };

                    /**
                     * Close modal box.
                     *
                     * @returns {void}
                     */
                    vm.closeBox = function () {
                        $uibModalInstance.dismiss();
                    };
                },
                backdrop: true,
                windowClass: 'edit-folder-box-modal'
            });

        };

        /**
         * Delete a specific folder.
         *
         * @param {Object} folder
         * @returns {void}
         */
        vm.deleteFolder = function (folder) {
            FoldersService.delete(folder).then(function (data) {
                // If user is not on a specific folder, loop on the bookmarks and delete them
                // If user is on the folder being deleted, take him to all bookmarks
                if (typeof FoldersService.currentFolder === 'undefined') {
                    for (var i = 0; i < data.data.bookmarks.length; i++) {
                        BookmarksService.bookmarks.splice(HelpersService.findInArray(BookmarksService.bookmarks, data.data.bookmarks[i]), 1);
                    }
                } else if (FoldersService.currentFolder.id === folder.id) {
                    FoldersService.currentFolder = undefined;
                    BookmarksService.bookmarks = [];
                    BookmarksService.index();
                }
            });
        };

        /**
         * Init funciton.
         *
         * @returns {void}
         */
        function init() {
            syncFolders();
            syncCurrentFolder();
        }

        /**
         * Sync folders list.
         *
         * @returns {void}
         */
        function syncFolders() {
            vm.folders = angular.copy(FoldersService.folders);
        }

        /**
         * Sync current folder.
         *
         * @returns {void}
         */
        function syncCurrentFolder() {
            vm.currentFolder = angular.copy(FoldersService.currentFolder);
        }

    }


})();