(function () {   
    var appStates = function ($state) {
        var
            states = [
                { name: 'state1', heading: "Tab 1", route: "tabs.state1", active: false, isVisible: true, href: $state.href("tabs.state1") },
                { name: 'state2', heading: "Tab 2", route: "tabs.state2", active: false, isVisible: true, href: $state.href("tabs.state2") },
                { name: 'state3', heading: "Tab 3", route: "tabs.state3", active: false, isVisible: true, href: $state.href("tabs.state3") },
                { name: 'state4', heading: "Tab 4", route: "tabs.state4", active: false, isVisible: true, href: $state.href("tabs.state4") }
            ];

        return {
            states: states
        };
    };

    appStates.$inject = ['$state'];
    angular.module('long2know.services')
        .factory('appStates', appStates);
})()