(function () {

    'use strict';

    angular.module('crypt').controller('DashboardController', DashboardController);

    function DashboardController($auth, $state, $stateParams, $pusher, $window, $rootScope, BaseService, $scope, $aside, SecurityService, BookmarksService, FoldersService, DashboardService, $uibModal) {

        var vm = this;
        vm.bookmarks = [];
        vm.pagination = {};
        vm.folders = [];
        vm.currentFolder = undefined;
        vm.selected = [];
        vm.listBlocks = false;
        vm.isLoadingMore = false;
        vm.foldersCollapsed = angular.copy(DashboardService.foldersCollapsed);
        vm.editMode = false;
        vm.orderBy = undefined;
        vm.orderByAttribute = undefined;

        var pusher = $pusher(window.client);

        var bookmarksStored = pusher.subscribe('private-users.' + $rootScope.currentUser.id + '.bookmarks');

        bookmarksStored.bind('bookmarks.stored',
                function (data) {
                    if (data.bookmark.security_clearance <= SecurityService.currentSecurityClearance) {
                        var index = findInArray(BookmarksService.bookmarks, data.bookmark.id);
                        if (index == null) {
                            if (typeof FoldersService.currentFolder === 'undefined') {
                                BookmarksService.bookmarks.splice(0, 0, data.bookmark);
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

        $scope.$watch(function () {
            return BookmarksService.pagination;
        },
                function (newValue, oldValue) {
                    vm.pagination = angular.copy(BookmarksService.pagination);
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
            console.log(bookmark.custom_title);
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
                        console.log(bookmark.custom_title);

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
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'js/angular/shared/player/_player.html',
                async: true,
                controllerAs: 'PlayerCtrl',
                backdrop: true,
                windowClass: 'player-box-modal',
                size: 'lg',
                resolve: {
                    bookmark: function () {
                        return angular.copy(bookmark);
                    }
                },
                controller: function ($uibModalInstance, bookmark) {
                    var vm = this;
                    vm.bookmark = bookmark;

                    vm.closeBox = function () {
                        $uibModalInstance.dismiss();
                    };
                }
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

            vm.isLoadingMore = true;
            BookmarksService.index(page, folder_id, order_by, order_by_attribute).then(function () {
                vm.isLoadingMore = false;
                if (folder_id != undefined) {
                    FoldersService.currentFolder = {id: folder_id};
                } else {
                    FoldersService.currentFolder = folder_id;
                }

                DashboardService.foldersCollapsed = true;
            });
            ;
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

//        vm.index();
        vm.indexFolders();

    }

})();