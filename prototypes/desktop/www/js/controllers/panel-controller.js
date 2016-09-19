// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set panel-controller application and register its controller
    angular
        .module("panel-controller", [])
        .controller("panelController", panelController);

    // add additional services to be used within the controller
    panelController.$inject = ["$scope", "contentService", "layoutService"];

    // define the controller
    function panelController($scope, contentService, layoutService) {
        // --------------------------------------------------------------------
        // define bindable members
        $scope.listOfStories;

        // --------------------------------------------------------------------
        // call functions   
        activate();

        // --------------------------------------------------------------------
        // define functions    
        function activate() {
            var currentWorkspaceId = layoutService.getCurrentWorkspace().id;
            var currentPanelId = layoutService.getCurrentPanel().id;
            
            // get all stories from a panel
            getListOfStories(currentWorkspaceId, currentPanelId);

        }

        function getListOfStories(workspaceId, panelId) {
            contentService
                .getAllStories(workspaceId, panelId)
                .then(function(listOfStories) {
                    $scope.listOfStories = listOfStories;
                });
                          
        }
    	
    }

})();