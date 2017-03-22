(function () {

    'use strict';

    angular.module('crypt').controller('DashboardController', DashboardController);

    function DashboardController($auth, $state, $stateParams, $rootScope, BaseService, $scope, BookmarksService, FoldersService, DashboardService, $uibModal) {

        var vm = this;
        vm.bookmarks = [];
        vm.folders = [];
        vm.folder = {};
        vm.currentFolder = undefined;
        vm.selected = [];
        vm.listBlocks = false;
        vm.foldersCollapsed = angular.copy(DashboardService.foldersCollapsed);
        vm.editMode = false;

        $scope.$watch(function () {
            return DashboardService.foldersCollapsed;
        },
                function (newValue, oldValue) {
                    vm.foldersCollapsed = angular.copy(DashboardService.foldersCollapsed);
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

        vm.toggleSelectAll = function () {
            if (vm.selected.length == 0) {
                vm.selected = angular.copy(vm.bookmarks);
            } else {
                vm.selected = []
            }
        };

        vm.index = function () {
            BookmarksService.index().then(function () {
                FoldersService.currentFolder = undefined;
                DashboardService.foldersCollapsed = true;
            });
            ;
        };

        vm.indexFolders = function () {
            FoldersService.index();
        };



        vm.selectBookmark = function ($event, bookmark) {
            if (vm.editMode)
            {
//                $event.stopPropagation();
                var index = findInArray(vm.selected, bookmark.id);
                if (index == null) {
                    vm.selected.push(bookmark);
                } else {
                    vm.selected.splice(index, 1);
                }
            }
        };



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

        vm.refresh = function (selected) {
            var bookmarks = [];
            for (var i = 0; i < selected.length; i++) {
                if (selected[i] == true) {
                    bookmarks.push(i);
                }
            }
            BookmarksService.refresh(bookmarks).then(function () {
                vm.selected = [];
            });

        };



        vm.changeFolder = function (id, selected) {
            var bookmarks = [];
            for (var i = 0; i < selected.length; i++) {
                if (selected[i] == true) {
                    bookmarks.push(i);
                }
            }
            BookmarksService.changeFolderAll(id, bookmarks).then(function () {
                vm.selected = [];
            });
        };

        vm.indexFolder = function (id) {
            BookmarksService.indexFolder(id).then(function () {
                FoldersService.currentFolder = {id: id};
                DashboardService.foldersCollapsed = true;
            });
        };

        vm.delete = function (bookmark) {
            BookmarksService.delete(bookmark);
        };

        function findInArray(arraytosearch, valuetosearch) {
            for (var i = 0; i < arraytosearch.length; i++) {
                if (arraytosearch[i].id == valuetosearch) {
                    return i;
                }
            }
            return null;
        }

        vm.deleteFolder = function (folder) {
            FoldersService.delete(folder).then(function (data) {
                if (typeof FoldersService.currentFolder === 'undefined') {
                    for (var i = 0; i < data.data.bookmarks.length; i++) {
                        BookmarksService.bookmarks.splice(findInArray(BookmarksService.bookmarks, data.data.bookmarks[i]), 1);
                    }
                } else if (FoldersService.currentFolder.id === folder.id) {
                    FoldersService.currentFolder = undefined;
                    BookmarksService.index();
                }
            });
        };



        vm.deleteSelected = function (selected) {
            var bookmarks = [];
            for (var i = 0; i < selected.length; i++) {
                if (selected[i] == true) {
                    bookmarks.push(i);
                }
            }
            BookmarksService.deleteAll(bookmarks).then(function () {
                vm.selected = [];
            });

        };



        vm.changeSecurityClearanceSelected = function (level, selected) {
            var bookmarks = [];
            for (var i = 0; i < selected.length; i++) {
                if (selected[i] == true) {
                    bookmarks.push(i);
                }
            }
            BookmarksService.changeSecurityClearanceAll(level, bookmarks).then(function () {
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

        function findInArray(arraytosearch, valuetosearch) {
            for (var i = 0; i < arraytosearch.length; i++) {
                if (arraytosearch[i].id == valuetosearch) {
                    return i;
                }
            }
            return null;
        }



        vm.index();
        vm.indexFolders();

    }

})();