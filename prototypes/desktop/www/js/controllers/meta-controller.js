// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set meta-controller application and register its controller
    angular
        .module("meta-controller", [])
        .controller("metaController", metaController);

    // add additional services to be used within the controller
    metaController.$inject = ["$rootScope", "$scope", "$timeout"];

    // define the controller
    function metaController($rootScope, $scope, $timeout) {
        // --------------------------------------------------------------------
        // define bindable members
        $scope.theme = {
            current: theme_config.ui.start,
            opposite: theme_config.ui.opposite
        };
        $scope.changeTheme = changeTheme;

        // --------------------------------------------------------------------
        // define functions
        function changeTheme(opposite) {
            
            var transition = "all 1s";
            
            // elements to transition
            var menu = document.getElementsByClassName("left")[0];
            var html = document.getElementsByTagName("html")[0];
            var body = document.getElementsByTagName("body")[0];
            
            var originalTransition = menu.style.transition;
            
            // set smooth transition
            menu.style.transition = transition;
            html.style.transition = transition;
            body.style.transition = transition;
            
            var current = opposite;
            var opposite = $scope.theme.current;
            
            $scope.theme = {
                current: current,
                opposite: opposite
            };
            
            $timeout(function() {
                
                // reset transition on panel
                menu.style.transition = originalTransition;
                
            }, 1000);
            
            // broadcast so menu theme text will update
            $rootScope.$broadcast("themeChange", { theme: $scope.theme });
                            
        }
        
    }

})();