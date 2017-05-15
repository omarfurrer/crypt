(function () {

    angular.module('crypt').factory('FoldersService', ['SecurityService', 'BaseService', '$http', '$rootScope', '$auth', '$window', '$state', 'Notification',
        function (SecurityService, BaseService, $http, $rootScope, $auth, $window, $state, Notification) {

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
                                    if (service.currentFolder === 'Shared With Me') {
                                        service.currentFolder = 'Shared With Me';
                                    } else if (service.currentFolder === 'Shared By Me') {
                                        service.currentFolder = 'Shared By Me';
                                    } else {
                                        service.currentFolder = undefined;
                                    }
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
                            Notification.primary('<span class="fa fa-check-circle-o"></span>');

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
                            Notification.primary('<span class="fa fa-check-circle-o"></span>');

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
                            Notification.primary('<span class="fa fa-check-circle-o"></span>');

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
                            Notification.primary('<span class="fa fa-check-circle-o"></span>');

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