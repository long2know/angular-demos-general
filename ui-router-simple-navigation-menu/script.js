(function () {
    angular.module('myApp.services', ['ngResource', 'ngAnimate']);
    angular.module('myApp.controllers', []);

    var menuService = function ($rootScope) {
        var menuItems = [
                { name: 'state1', heading: "State1", route: "app.state1", active: false },
                { name: 'state2', heading: "State2", route: "app.state2", active: false },
                { name: 'state3', heading: "State3", route: "app.state3", active: false }
            ];
        var
            currentMenuItem,
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

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            currentMenuItem = findMenuItem(toState.name, toParams);
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (currentMenuItem) {
                currentMenuItem.active = true;
                prevMenuItem = findMenuItem(fromState.name);
                if (prevMenuItem && prevMenuItem.name !== currentMenuItem.name) {
                    prevMenuItem.active = false;
                }
            } else {
                for (var i = 0; i < currentMenuItem.length; i++) {
                    currentMenuItem[i].active = false;
                }
            }
        });

        return {
            menuItems: menuItems,
            currentMenuItem: currentMenuItem
        };
    };

    var menuController = function ($state, menuService) {
        var vm = this;
        vm.menuItems = menuService.menuItems;
       
        vm.getRouteSref = function(menuItem)
        {
            if (!menuItem) { menuItem = vm.menuItems[0] };
            return $state.href(menuItem.route);
        };
    };

    menuService.$inject = ['$rootScope'];
    angular.module('myApp.services')
        .factory('menuService', menuService);

    menuController.$inject = ['$state', 'menuService'];
    angular
    .module('myApp.controllers')
    .controller('menuCtrl', menuController);

    var myApp = angular.module('myApp', [
        'myApp.services',
        'myApp.controllers',
        'ngSanitize',
        'ui.bootstrap',
        'ui.router',
        'ui'
    ]);
    
    myApp.config(['$uibModalProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider',
        function ($uibModalProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
            $uibModalProvider.options = { animation: true, backdrop: 'static', keyboard: false };
            $locationProvider.html5Mode(false);

            $urlRouterProvider
                .when('/', '/state1')
                .otherwise("/state1");

            $stateProvider
                .state('app', {
                    abstract: true,
                    url: '/',
                    views: {
                        'main': { template: '<div ui-view>/div>' }
                    }
                })
                .state('app.state1', {
                    url: 'state1',
                    templateUrl: 'state1.html',
                    controller: function () { },
                    reloadOnSearch: false
                })
                .state('app.state2', {
                    url: 'state2',
                    templateUrl: 'state2.html',
                    controller: function () { },
                    reloadOnSearch: false
                })
				.state('app.state3', {
				    url: 'state3',
				    templateUrl: 'state3.html',
				    controller: function () { },
				    reloadOnSearch: false
				})
        }]);

    myApp.run(['$log', function ($log) {
        $log.log("Start.");
    }]);
})()
