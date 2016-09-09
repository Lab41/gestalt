// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set panel-controller application and register its controller
    angular
        .module("panel-controller", [])
        .controller("panelController", panelController);

    // add additional services to be used within the controller
    panelController.$inject = ["$scope", "$stateParams", "authenticationFactory", "contentFactory", "layoutFactory"];

    // define the controller
    function panelController($scope, $stateParams, authenticationFactory, contentFactory, layoutFactory) {
        // --------------------------------------------------------------------
        // define bindable members
        $scope.listOfStories = [];

        // --------------------------------------------------------------------
        // call functions   
        activate();

        // --------------------------------------------------------------------
        // define functions    
        function activate() {
            var currentPersonaId = authenticationFactory.getCurrentPersona().id;
            var currentPanelId = layoutFactory.getCurrentPanel().id;
            
            // get all stories from a panel
            getListOfStories(currentPersonaId, currentPanelId);

        }

        function getListOfStories(personaId, panelId) {
            contentFactory.getListOfStories(personaId, panelId)
                          .then(function(listOfStories) {
                                $scope.listOfStories = listOfStories;
                          });
                          
        }
    	
    }

})();
