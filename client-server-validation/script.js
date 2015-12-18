(function () {
    angular.module('myApp.controllers', []);

    var myApp = angular.module('myApp', [
        'myApp.controllers',
        'long2know',
        'ngSanitize',
        'ui.bootstrap',
        'ui.router',
        'ui']);

    var state1Ctrl = function ($http, $filter, $timeout, $scope, $log, validationService) {
        var vm = this;

        vm.disabled = function (date, mode) {
            return (mode === 'day' && false); // (date.getDay() === 0 || date.getDay() === 6));
        };

        var init = function () {
            vm.firstname = '';
            vm.lastname = '';
            vm.email = '';
        };

        $scope.$watch('form', function () {
            vm.form.$setPristine();
            vm.form.$setUntouched();
            vm.isSubmitted = false;
        });

        vm.submit = function () {
            vm.isSubmitted = true;
            if (vm.form.$valid) {
                $http.post('https://long2know.azurewebsites.net/api/user')
                    .success(function (data, status, headers, config) {
                        $log.log("Success.");
                    })
                    .catch(function (error) {
                        // Note we use catch instead of error to make response same as $resource
                        $log.log("Error - calling validaiton server.");
                        if (validationService.isValidationError(error)) {
                            validationService.processServerErrors(vm.form, error.data);
                        }
                    });
            }
        }

        vm.discard = function () {
            init();
            vm.form.$setPristine();
            vm.form.$setUntouched();
            validationService.clearServerErrors();
            vm.isSubmitted = false;
        }

        init();
    };

    state1Ctrl.$inject = ['$http', '$filter', '$timeout', '$scope', '$log', 'validationService'];
    angular.module('myApp.controllers')
        .controller('state1Ctrl', state1Ctrl);

    myApp.config(['$locationProvider', '$stateProvider', '$urlRouterProvider',

        function ($locationProvider, $stateProvider, $urlRouterProvider) {

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
        }]);

    myApp.run(['$log', function ($log) {
        $log.log("Start.");
    }]);
})()