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
    var navigationService = function ($rootScope, $location, $state, $sce, $log, $q, appStates, dialogService, idleService, idleListenService) {
        var
            states = appStates.states,
            currentState,
            previousState,
            validationFn,
            isDirtyFn,
            onNavigateFn,
            isDiscarded = false,

            isValid = function () {
                return validationFn();
            },

            isDirty = function () {
                return isDirtyFn();
            },

        resetState = function (state) {
            state.active = false;
        },

        resetAllStates = function () {
            for (var i = 0; i < states.length; i++) {
                resetState(states[i]);
            }
        },

        findState = function (routeName) {
            var criteriaFunction = function (c) {
                return c.route === routeName; // || routeName.indexOf(c.route) != -1;
            };
            return states.filter(criteriaFunction)[0];
        },

        findStatesByGroup = function (group) {
            var criteriaFunction = function (c) {
                return c.group === group;
            };
            return states.filter(criteriaFunction);
        };

        function resetCallbacks() {
            onNavigateFn = null;
            validationFn = function () { return true; };
            isDirtyFn = function () { return false; };
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            // Set initial state
            if (currentState) {
                currentState.href = decodeURIComponent($state.href(currentState.route, $location.search()));
                currentState.stateParams = $location.search();
            } else {
                currentState = findState(toState.name, toParams);
                if (currentState) {
                    currentState.href = decodeURIComponent($state.href(currentState.route, $location.search()));
                    currentState.stateParams = $location.search();
                }
            };

            var valdatinFnResponse = validationFn();
            if (((valdatinFnResponse !== true || valdatinFnResponse.error === true)) && toState.name !== 'error') {
                var errorTitle = 'Validation Error!';
                var errorBody = (valdatinFnResponse.errorMessage) ? valdatinFnResponse.errorMessage : 'Please correct the form errors listed!';
                var modal = dialogService.openDialog("modalError.html", ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.modalHeader = $sce.trustAsHtml(errorTitle);
                    $scope.modalBody = $sce.trustAsHtml(dialogService.stringFormat("<p><strong>{0}</strong></p>", errorBody));
                    $scope.ok = function () {
                        $uibModalInstance.close();
                    };
                    $scope.hasCancel = false;
                }]);
                event.preventDefault();
                return;
            }

            if (!onNavigateFn && !isDirty()) {
                resetCallbacks();
                currentState = findState(toState.name, toParams);
                return;
            }

            event.preventDefault();

            var discardCallback = isDirty() ?
                dialogService.openDiscardChangesDialog :
                function () { return true; };

            var navCallack = !onNavigateFn ?
                function () { return true; } :
                onNavigateFn;

            var discardPromise = $q.when(discardCallback());
            discardPromise.then(function () {
                var navigatePromise = $q.when(navCallack());
                navigatePromise.then(function () {
                    resetCallbacks();
                    $state.go(toState, toParams);
                });
            });
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (currentState && toState.name !== 'error') {
                currentState.active = true;
                previousState = findState(fromState.name);
                if (previousState && previousState.name !== currentState.name) {
                    previousState.active = false;
                }
            } else {
                resetAllStates();
                currentState = findState(toState.name);
                if (currentState) {
                    currentState.active = true;
                }
            }

            // Handle breadcrumbs by group reference - or if they have no group reference.
            if (currentState) {
                var index = states.indexOf(currentState);
                var group = currentState.group;
                var groupStates = findStatesByGroup(group);
                var groupIndex = 0;
                var isFirst = false;
                if (groupStates && groupStates.length > 0) {
                    isFirst = groupStates[0] == currentState;
                    for (var i = 0; i < groupStates.length; i++) {
                        if (groupStates[i] == currentState) {
                            groupIndex = i;
                            break;
                        }
                    }
                }

                // Set visibility keeping the first item in the group, if it's active non-visible
                for (var i = 0; i <= index; i++) {
                    if (states[i].group === group && !isFirst) {
                        states[i].isVisible = true;
                    } else {
                        states[i].isVisible = false;
                    }
                }

                // If we have a grouping of states, deal with it to make the proper states invisible
                // This effectively makes it possible to keep the items after the current state invisible
                if (groupStates && groupStates.length > 0) {
                    if (groupIndex < groupStates.length - 1) {
                        for (var i = groupIndex + 1; i <= groupStates.length - 1; i++) {
                            groupStates[i].isVisible = false;
                        }
                    }
                }
                else {
                    if (index < states.length - 1) {
                        for (var i = index + 1; i <= states.length - 1; i++) {
                            states[i].isVisible = false;
                        }
                    }
                }
            }
        });

        resetCallbacks();

        return {
            states: states,
            currentState: function () { return currentState; },
            previousState: function () { return previousState; },
            isDirty: isDirty,
            setOnNavigateCallback: function (onNavigateCb) {
                onNavigateFn = onNavigateCb;
            },
            setIsDirtyCallback: function (isDirtyCb) {
                isDirtyFn = isDirtyCb;
            },
            setValidationCallback: function (validationCb) {
                validationFn = validationCb;
            }
        };
    };

    navigationService.$inject = ['$rootScope', '$location', '$state', '$sce', '$log', '$q', 'appStates'];
    angular.module('long2know.services')
        .factory('navigationService', navigationService);
})()

