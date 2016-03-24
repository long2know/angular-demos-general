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

var myCtrl = function ($scope, $sce, $timeout, $animate, $log, timerService, dialogService) {               
        var vm = this,
            myTimeout,
            max = 10, // seconds
            interval = 0.0001, // seconds
            updateSeconds,
            timestamp,
            elapsedTime,
            startCounter = function() {
                vm.counter = 0;
                vm.percentage = 0;
                timestamp = new Date() / 1000.0;
                myTimeout = $timeout(incrementCounter, updateSeconds);
                timerService.resetTimer(max);
            },
            resetCounter = function() {
                vm.progressUpdateInterval = interval = Math.max(vm.progressUpdateInterval, 0.01);                                                
                updateSeconds = interval * 1000;
                max = vm.progressSeconds;                
                $timeout.cancel(myTimeout)
                startCounter();
            },            
            incrementCounter = function() {
                vm.counter += interval;
                vm.percentage = Math.min(parseInt((vm.counter / max) * 100), 100.0);
                var currentTimestamp = new Date() / 1000.0;
                vm.counter = currentTimestamp - timestamp;
                vm.percentage = Math.min(parseInt((vm.counter / max) * 100), 100.0);
                myTimeout = $timeout(incrementCounter, updateSeconds);
            },       
            init = function() {
                vm.progressUpdateInterval = interval = Math.max(interval, 0.01);
                updateSeconds = interval * 1000;
                vm.progressSeconds = max;
                startCounter();
                vm.resetCounter = resetCounter;
                $scope.$on('timeoutExpired', function() {
                    vm.percentage = 100.0;
                    $timeout.cancel(myTimeout)
                    var modalTitle = 'Done!';
                    var modalBody = 'Your wait has ended.  Relax!';
                    dialogService.openDialog("modalGeneral.html", ['$scope', '$uibModalInstance', function ($modalScope, $uibModalInstance) {
                        $modalScope.modalHeader = $sce.trustAsHtml(modalTitle);
                        $modalScope.modalBody = $sce.trustAsHtml(dialogService.stringFormat("<p><strong>{0}</strong></p>", modalBody));
                        $modalScope.ok = function () {
                            $uibModalInstance.close();
                            makeRequest();
                        };
                        $modalScope.hasCancel = false;
                        $modalScope.cancel = function () {
                            $uibModalInstance.close();
                        };
                    }]);
                });
            },
            makeRequest = function () {
                timerService.resetTimer();
                resetCounter();
            };
        init();
    };
    
    myCtrl.$inject = ['$scope', '$sce', '$timeout', '$animate', '$log', 'timerService', 'dialogService'];
    angular
        .module('long2know.controllers')
        .controller('myCtrl', myCtrl);
        
    var myApp = angular.module('myApp', [
        'long2know.services',
        'long2know.controllers',
        'ngSanitize',
        'ui.bootstrap',
        'ui.router',
        'ui'
    ]);

    myApp.config(['$modalProvider', '$locationProvider',
        function ($modalProvider, $locationProvider) {
            $modalProvider.options = { dialogFade: true, backdrop: 'static', keyboard: false };
            $locationProvider.html5Mode(false);
        }]);

    myApp.run(['$log', function ($log) { $log.log("Start."); }]);
    
 })()
