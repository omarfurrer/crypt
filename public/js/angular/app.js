(function () {

    'use strict';
    angular


            .module('crypt', ['ui.router', 'ngSanitize', 'ngStorage', 'ui.bootstrap', 'satellizer', 'angular-loading-bar', 'ngFileUpload', 'angular-inview', 'ngAside', 'fsm', 'pusher-angular', 'ngIdle'])
            .config(function ($locationProvider, $stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide) {
                // configure Idle settings
                IdleProvider.idle(30); // in seconds
                IdleProvider.timeout(9000); // in seconds
                KeepaliveProvider.interval(5000); // in seconds

                function redirectWhenLoggedOut($q, $injector, $rootScope) {

                    return {
                        responseError: function (rejection) {

                            // Need to use $injector.get to bring in $state or else we get
                            // a circular dependency error
                            var $state = $injector.get('$state');
                            // Instead of checking for a status code of 400 which might be used
                            // for other reasons in Laravel, we check for the specific rejection
                            // reasons to tell us if we need to redirect to the login state
                            var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];
                            // Loop through each rejection reason and redirect to the login
                            // state if one is encountered
                            angular.forEach(rejectionReasons, function (value, key) {

                                if (rejection.data.error === value) {

                                    // If we get a rejection corresponding to one of the reasons
                                    // in our array, we know we need to authenticate the user so
                                    // we can remove the current user from local storage
                                    // Remove the authenticated user from local storage
                                    localStorage.removeItem('user');
                                    // Flip authenticated to false so that we no longer
                                    // show UI elements dependant on the user being logged in
                                    $rootScope.authenticated = false;
                                    // Remove the current user info from rootscope
                                    $rootScope.currentUser = null;
                                    $state.go('home');
                                }
                            });
                            return $q.reject(rejection);
                        }
                    };
                }
                // Google
                $authProvider.google({
                    clientId: '1087260936038-u5v57plbt9ic8ei36jd9b645q8mqvsaj.apps.googleusercontent.com',
                    url: 'api/users/authenticate/google',
                    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
                    redirectUri: window.location.origin + '/' + 'crypt/public/login',
                    requiredUrlParams: ['scope'],
                    optionalUrlParams: ['display'],
                    scope: ['profile', 'email'],
                    scopePrefix: 'openid',
                    scopeDelimiter: ' ',
                    display: 'popup',
                    oauthType: '2.0',
                    popupOptions: {width: 452, height: 633}
                });
                // Setup for the $httpInterceptor
                $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);
                // Push the new factory onto the $http interceptor array
                $httpProvider.interceptors.push('redirectWhenLoggedOut');
                // Satellizer configuration that specifies which API
                // route the JWT should be retrieved from
                $authProvider.baseUrl = null;
                //$authProvider.httpInterceptor = true;
                $authProvider.loginUrl = 'api/users/authenticate';
                $authProvider.loginRedirect = null;
                // Redirect to the auth state if any other states
                // are requested other than users
                $urlRouterProvider.otherwise('/');
                $locationProvider.html5Mode(true);
                $stateProvider

                        .state('login', {
                            url: '/login'
                        })
                        .state('home', {
                            url: '/',
                            templateUrl: 'js/angular/components/home/index.html',
                            controller: 'HomeController as HomeCtrl'
                        })
                        .state('dashboard', {
                            url: '/mycrypt',
                            templateUrl: 'js/angular/components/dashboard/index.html',
                            controller: 'DashboardController as DashCtrl'
                        })
                        .state('settings', {
                            url: '/settings',
                            templateUrl: 'js/angular/components/settings/index.html',
                            controller: 'SettingsController as SettingsCtrl'
                        })


                        ;
            })

            .directive('ngReallyClick', ['$uibModal',
                function ($uibModal) {
                    var ModalInstanceCtrl = function ($scope, $uibModalInstance) {
                        $scope.ok = function () {
                            $uibModalInstance.close();
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    };
                    return {
                        restrict: 'A',
                        scope: {
                            ngReallyClick: "&",
                            item: "="
                        },
                        link: function (scope, element, attrs) {
                            element.bind('click', function () {
                                var message = attrs.ngReallyMessage || "Are you sure ?";
                                var modalHtml = '<div class="modal-body">' + message + '</div>';
                                modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';
                                var modalInstance = $uibModal.open({
                                    template: modalHtml,
                                    windowClass: 'delete-folder-box-modal',
                                    controller: ModalInstanceCtrl
                                });
                                modalInstance.result.then(function () {
                                    scope.ngReallyClick({item: scope.item}); //raise an error : $digest already in progress
                                }, function () {
                                    //Modal dismissed
                                });
                                //*/

                            });
                        }
                    };
                }
            ])
            .filter('trusted', ['$sce', function ($sce) {
                    return function (url) {
                        return $sce.trustAsResourceUrl(url);
                    };
                }])

            .run(['$rootScope', '$state', '$window', '$location', '$timeout', 'Idle', 'SecurityService', 'UsersService',
                function ($rootScope, $state, $window, $location, $timeout, Idle, SecurityService, UsersService) {


                    var user = JSON.parse(localStorage.getItem('user'));
                    if (user) {
                        Idle.watch();

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




                        // The user's authenticated state gets flipped to
                        // true so we can now show parts of the UI that rely
                        // on the user being logged in
                        $rootScope.authenticated = true;
                        // Putting the user's data on $rootScope allows
                        // us to access it anywhere across the app. Here
                        // we are grabbing what is in local storage
                        $rootScope.currentUser = user;
                        SecurityService.update();
                        if (user.security_clearance > 1) {
                            UsersService.postchangeSecurityClearance('', 0);
                        }
                    } else {
                        $rootScope.authenticated = false;
                        $rootScope.currentUser = null;
                    }


                    // $stateChangeStart is fired whenever the state changes. We can use some parameters
                    // such as toState to hook into details about the state as it is changing
                    $rootScope.$on('$stateChangeStart', function (event, toState) {
                        //scroll to top automatically

                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                        // Grab the user from local storage and parse it to an object
                        var user = JSON.parse(localStorage.getItem('user'));
                        // var allowed_states_for_guest = ['login'];
                        // If there is any user data in local storage then the user is quite
                        // likely authenticated. If their token is expired, or if they are
                        // otherwise not actually authenticated, they will be redirected to
                        // the auth state because of the rejected request anyway


                        if (user) {

                            // The user's authenticated state gets flipped to
                            // true so we can now show parts of the UI that rely
                            // on the user being logged in
                            $rootScope.authenticated = true;
                            // Putting the user's data on $rootScope allows
                            // us to access it anywhere across the app. Here
                            // we are grabbing what is in local storage
                            $rootScope.currentUser = user;
                            if (toState.name == 'home') {
                                // add state.go in a timeout function because it does not work properly in the run function
                                $timeout(function () {
                                    $state.go('dashboard');
                                });
                            }

                            if ($rootScope.currentUser.password == null && toState.name != 'settings') {
                                $timeout(function () {
                                    $state.go('settings');
                                });
                            }

                        } else {
                            $rootScope.authenticated = false;
                            $rootScope.currentUser = null;
                        }
                    });
                }]);
})();