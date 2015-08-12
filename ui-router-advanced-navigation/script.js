(function () {
    angular.module('myApp.services', ['ngResource', 'ngAnimate']);
    angular.module('myApp.controllers', []);

    var myApp = angular.module('myApp', [
		'long2know',
        'myApp.services',
        'myApp.controllers',
        'ngSanitize',
        'ui.bootstrap',
        'ui.router',
        'ui']);

    var watchCountService = function () {
        // I return the count of watchers on the current page.
        function getWatchCount() {
            var total = 0;
            angular.element(".ng-scope").each(

            function countWatchers() {
                var scope = $(this).scope();
                total += scope.$$watchers ? scope.$$watchers.length : 0;
            });

            return (total);
        }

        return {
            getWatchCount: getWatchCount
        };
    };

    var menuService = function ($rootScope, $q, $state, $sce, dialogService) {
        var menuItems = [
            {
                name: 'state1', heading: "State1",
                route: "app.state1",
                active: false
            }, {
                name: 'state2',
                heading: "State2",
                route: "app.state2",
                active: false
            }, {
                name: 'state3',
                heading: "State3",
                route: "app.state3",
                active: false
            }, {
                name: 'state4',
                heading: "State4",
                route: "app.state4",
                active: false
            }];
        var
        currentMenuItem,
        onNavigateFn,
        validationFn,
        resetMenuItem = function (menuItem) {
            menuItem.active = false;
        },
        resetMenuItems = function () {
            for (var i = 0; i < menuItems.length; i++) {
                resetMenuItem(menuItems[i]);
            }
        },
        findMenuItem = function (routeName) {
            var criteriaFunction = function (c) {
                return c.route === routeName || routeName.indexOf(c.route) != -1;
            };
            return menuItems.filter(criteriaFunction)[0];
        };

        function resetCallbacks() {
            onNavigateFn = null;
            validationFn = function () { return true; };
        };

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            var valdatinFnResponse = validationFn();
            if ((valdatinFnResponse !== true || valdatinFnResponse.error === true)) {
                var errorTitle = 'Validation Error!';
                var errorBody = (valdatinFnResponse.errorMessage) ? valdatinFnResponse.errorMessage : 'Please correct the form errors listed!';
                dialogService.openDialog("modalErrorTemplate.html", ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                    $scope.modalHeader = $sce.trustAsHtml(errorTitle);
                    $scope.modalBody = $sce.trustAsHtml(dialogService.stringFormat("<p><strong>{0}</strong></p>", errorBody));
                    $scope.ok = function () {
                        $modalInstance.close();
                    };
                    $scope.hasCancel = false;
                }]);
                event.preventDefault();
                return;
            };

            if (!onNavigateFn) {
                resetCallbacks();
                currentMenuItem = findMenuItem(toState.name, toParams);
                return;
            }

            event.preventDefault();

            $q.when(onNavigateFn()).then(
                function (result) {
                    resetCallbacks();
                    $state.go(toState, toParams);
                },
                function (error) {
                    return; // we just don't change state
                }
            );
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            currentMenuItem = findMenuItem(toState.name, toParams);
            if (currentMenuItem) {
                currentMenuItem.active = true;
                prevMenuItem = findMenuItem(fromState.name);
                if (prevMenuItem && prevMenuItem.name !== currentMenuItem.name) {
                    prevMenuItem.active = false;
                }
            } else {
                for (var i = 0; i < menuItems.length; i++) {
                    menuItems[i].active = false;
                }
            }
        });

        resetCallbacks();

        return {
            menuItems: menuItems,
            currentMenuItem: currentMenuItem,
            setOnNavigateCallback: function (onNavigateCb) {
                onNavigateFn = onNavigateCb;
            },
            setValidationCallback: function (validationCb) {
                validationFn = validationCb;
            }
        };
    };

    var state1Controller = function (menuService, dialogService) {
        var vm = this,
           isFormValid = function () {
               return vm.myForm.$valid === true;
           },
           isFormDirty = function () {
               return vm.myForm.$dirty === true;
           },
           navigateCallback = function () {
               if (isFormDirty()) {
                   return dialogService.openDiscardChangesDialog();
               } else {
                   return true;
               };
           },
           init = function () {
           };

        init();
    };

    var state2Controller = function (menuService, dialogService) {
        var vm = this,
            isFormValid = function () {
                return vm.myForm.$valid === true;
            },
            isFormDirty = function () {
                return vm.myForm.$dirty === true;
            },
            navigateCallback = function () {
                if (isFormDirty()) {
                    return dialogService.openDiscardChangesDialog();
                } else {
                    return true;
                };
            },
            init = function () {
                menuService.setValidationCallback(isFormValid);
            };

        init();
    };

    var state3Controller = function (menuService, dialogService) {
        var vm = this,
            isFormValid = function () {
                return vm.myForm.$valid === true;
            },
            isFormDirty = function () {
                return vm.myForm.$dirty === true;
            },
            navigateCallback = function () {
                if (isFormDirty()) {
                    return dialogService.discardChangesDialog();
                } else {
                    return true;
                };
            },
            init = function () {
                menuService.setOnNavigateCallback(navigateCallback);
            };

        init();
    };

    var state4Controller = function (menuService, dialogService) {
        var vm = this,
            isFormValid = function () {
                return vm.myForm.$valid === true;
            },
            isFormDirty = function () {
                return vm.myForm.$dirty === true;
            },
            navigateCallback = function () {
                if (isFormDirty()) {
                    return dialogService.openDiscardChangesDialog();
                } else {
                    return true;
                };
            },
            init = function () {
                menuService.setOnNavigateCallback(navigateCallback);
                menuService.setValidationCallback(isFormValid);
            };

        init();
    };

    var menuController = function ($state, $scope, menuService, watchCountService) {
        var vm = this;
        vm.menuItems = menuService.menuItems;
        vm.watchCount = 0;

        $scope.$watch(

        function watchCountExpression() {
            return (watchCountService.getWatchCount());
        },

        function handleWatchCountChange(newValue) {
            vm.watchCount = newValue;
        });
        vm.getRouteSref = function (menuItem) {
            if (!menuItem) {
                menuItem = vm.menuItems[0]
            };
            return $state.href(menuItem.route);
        };
    };   

    menuService.$inject = ['$rootScope', '$q', '$state', '$sce', 'dialogService'];
    angular.module('myApp.services')
        .factory('menuService', menuService);

    state1Controller.$inject = ['menuService', 'dialogService'];
    angular.module('myApp.controllers')
        .controller('state1Ctrl', state1Controller);

    state2Controller.$inject = ['menuService', 'dialogService'];
    angular.module('myApp.controllers')
        .controller('state2Ctrl', state2Controller);

    state3Controller.$inject = ['menuService', 'dialogService'];
    angular.module('myApp.controllers')
        .controller('state3Ctrl', state3Controller);

    state4Controller.$inject = ['menuService', 'dialogService'];
    angular.module('myApp.controllers')
        .controller('state4Ctrl', state4Controller);

    menuController.$inject = ['$state', '$scope', 'menuService', 'watchCountService'];
    angular.module('myApp.controllers')
        .controller('menuCtrl', menuController);

    angular.module('myApp.services')
        .factory('watchCountService', watchCountService);

    myApp.config(['$modalProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider',

    function ($modalProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
        $modalProvider.options = {
            dialogFade: true,
            backdrop: 'static',
            keyboard: false
        };
        $locationProvider.html5Mode(false);

        $urlRouterProvider.when('/', '/state1')
            .otherwise("/state1");

        $stateProvider.state('app', {
            abstract: true,
            url: '/',
            views: {
                'main': {
                    template: '<div ui-view>/div>'
                }
            }
        })
        .state('app.state1', {
            url: 'state1',
            templateUrl: 'state1.html',
            controller: 'state1Ctrl',
            controllerAs: 'vm',
            reloadOnSearch: false
        })
        .state('app.state2', {
            url: 'state2',
            templateUrl: 'state2.html',
            controller: 'state2Ctrl',
            controllerAs: 'vm',
            reloadOnSearch: false
        })
        .state('app.state3', {
            url: 'state3',
            templateUrl: 'state3.html',
            controller: 'state3Ctrl',
            controllerAs: 'vm',
            reloadOnSearch: false
        })
            .state('app.state4', {
                url: 'state4',
                templateUrl: 'state4.html',
                controller: 'state4Ctrl',
                controllerAs: 'vm',
                reloadOnSearch: false
            })
    }]);

    myApp.run(['$log', function ($log) {
        $log.log("Start.");
    }]);
})()