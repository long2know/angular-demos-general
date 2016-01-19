(function () {
    var long2know;
    try {
        long2know = angular.module("long2know")
    } catch (err) {
        long2know = null;
    }

    if (!long2know) {
        angular.module('long2know.services', ['ngResource', 'ngAnimate']);
        angular.module('long2know.controllers', []);
        angular.module('long2know.directives', []);
        angular.module('long2know.constants', []);
        angular.module('long2know',
            [
                'long2know.services',
                'long2know.controllers',
                'long2know.directives',
                'long2know.constants'
            ]);
    }

    var tabsCtrl = function ($state, $location, $filter, appStates, navigationService) {
        var
            vm = this,
            initialize = function () {
                vm.appStates = appStates.states;
            };
        vm.tabSelected = function (route) {
            $state.go(route);
        };
        initialize();
    };

    tabsCtrl.$inject = ['$state', '$location', '$filter', 'appStates', 'navigationService'];
    angular
        .module('long2know.controllers')
        .controller('tabsCtrl', tabsCtrl);

    var myApp = angular.module('myApp', [
        'long2know.services',
        'long2know.controllers',
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
                .state('tabs', {
                    abstract: true,
                    url: '/',
                    views: {
                        'tabs': {
                            controller: 'tabsCtrl as tc',
                            templateUrl: 'tabs.html',
                        }
                    }
                })
                .state('tabs.state1', {
                    url: 'state1',
                    templateUrl: 'state1.html',
                    controller: function () { },
                    reloadOnSearch: false
                })
                .state('tabs.state2', {
                    url: 'state2',
                    templateUrl: 'state2.html',
                    controller: function () { },
                    reloadOnSearch: false
                })
                .state('tabs.state3', {
                    url: 'state3',
                    templateUrl: 'state3.html',
                    controller: function () { },
                    reloadOnSearch: false
                })
                .state('tabs.state4', {
                    url: 'state4',
                    templateUrl: 'state4.html',
                    controller: function () { },
                    reloadOnSearch: false
                })
        }]);

    myApp.run(['$log', 'navigationService', function ($log, navigationService) {
        // Note, we need a reference to the navigationService so $state events are tracked.
        $log.log("Start.");
    }]);
})()
