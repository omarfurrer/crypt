(function () {

    angular.module('crypt').factory('BookmarksService', ['Upload', 'SecurityService', 'FoldersService', 'BaseService', '$http', '$rootScope', '$auth', '$window', '$state', function (Upload, SecurityService, FoldersService, BaseService, $http, $rootScope, $auth, $window, $state) {

            var service = {};
            var url = 'api/bookmarks';
            service.bookmarks = [];
            service.pagination = {};
            service.error = {};
            service.searchResults = [];
            service.searchInProgress = false;

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
                            for (var i = 0; i < data.bookmarks.length; i++) {
                                service.bookmarks[findInArray(service.bookmarks, data.bookmarks[i].id)] = data.bookmarks[i];
                            }
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

            return service;
        }]);
})();