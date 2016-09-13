// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set panel-controller application and register its controller
    angular
        .module("panel-controller", [])
        .controller("panelController", panelController);

    // add additional services to be used within the controller
    panelController.$inject = ["$scope", "contentFactory", "layoutFactory"];

    // define the controller
    function panelController($scope, contentFactory, layoutFactory) {
        // --------------------------------------------------------------------
        // define bindable members
        $scope.listOfStories;

        // --------------------------------------------------------------------
        // call functions   
        activate();

        // --------------------------------------------------------------------
        // define functions    
        function activate() {
            var currentWorkspaceId = layoutFactory.getCurrentWorkspace().id;
            var currentPanelId = layoutFactory.getCurrentPanel().id;
            
            // get all stories from a panel
            getListOfStories(currentWorkspaceId, currentPanelId);

        }

        function getListOfStories(workspaceId, panelId) {
            contentFactory
                .getAllStories(workspaceId, panelId)
                .then(function(listOfStories) {
                    $scope.listOfStories = listOfStories;
                });
                          
        }
    	
    }

})();
