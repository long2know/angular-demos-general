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

    var validationService = function ($timeout) {
        var processServerErrors = function (formCtrl, errors) {
            if (errors && errors.length > 0) {
                for (var i = 0; i < errors.length; i++) {
                    var key = errors[i].Key;
                    var name = key.split('.').slice(-1);
                    for (var j = 0; j < errors[i].Value.length; j++) {
                        var formElement = formCtrl[name];
                        if (formElement) {
                            var errorMessage = errors[i].Value[j];
                            formElement.$setValidity('server', false);
                            formElement.$error.serverMessage = errorMessage;
                        }
                    }
                }
            }
        };

        var clearServerErrors = function (formCtrl) {
            for (var key in formCtrl) {
                if (formCtrl.hasOwnProperty(key)) {
                    var formElement = formCtrl[key];
                    if (formElement && formElement.hasOwnProperty('$modelValue')) {
                        formElement.$setValidity('server', true);
                        formElement.$setValidity('serverMessage', true);
                    }
                };
            }
        };

        var isValidationError = function (error) {
            return error.status === 400 && (error.statusText == "validationException" || (error.data && error.data.length > 0 && error.data[0].Key));
        };

        return {
            processServerErrors: processServerErrors,
            clearServerErrors: clearServerErrors,
            isValidationError: isValidationError
        };
    };

    validationService.$inject = ['$timeout'];
    angular.module('long2know.services')
        .factory('validationService', validationService);
})()
