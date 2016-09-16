// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set panel-controller application and register its controller
    angular
        .module("story-controller", [])
        .controller("storyController", storyController);

    // add additional services to be used within the controller
    storyController.$inject = ["$scope", "contentService", "layoutService"];

    // define the controller
    function storyController($scope, contentService, layoutService) {
        // --------------------------------------------------------------------
        // define bindable members
        $scope.listOfIdeas;

        // --------------------------------------------------------------------
        // call functions   
        activate();

        // --------------------------------------------------------------------
        // define functions    
        function activate() {
            console.log("WOOT WOOT in story-controller activate function");

        }

    }

})();