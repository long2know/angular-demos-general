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
    
    var timerService = function ($rootScope, $timeout, $log) {
        var idleTimer = null,
        		expireTime = 10000,
            startTimer = function () {
                $log.log('Starting timer');
                idleTimer = $timeout(timerExpiring, expireTime);
            },
            stopTimer = function () {
                if (idleTimer) {
                    $timeout.cancel(idleTimer);
                }
            },
            resetTimer = function (timeoutSeconds) {
            		expireTime = typeof (timeoutSeconds) === 'undefined' ? 10000 : timeoutSeconds * 1000;
                stopTimer();
                startTimer();
            },
            timerExpiring = function () {
                stopTimer();
                $rootScope.$broadcast('timeoutExpired');
                $log.log('Timer expiring ..');
            };

        startTimer();
        
        return {
            startTimer: startTimer,
            stopTimer: stopTimer,
            resetTimer: resetTimer
        };
    };

    timerService.$inject = ['$rootScope', '$timeout', '$log'];
    angular.module('long2know.services')
        .factory('timerService', timerService);
})()

