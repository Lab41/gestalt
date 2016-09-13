// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set panel-nav-directive application and register its directive
    angular
        .module("panel-nav-directive", [])
        .directive("panelNav", panelNavDirective);

    function panelNavDirective() {
        // return a panelNavDirective instance
    	var panelNavDirective =  {
    		restrict: "E",
    		scope: {
    			panels: "="
    		},
    	    controller: panelNavController,
    		templateUrl: "templates/panel-nav.html",
    		link: watchForPanelChange
    	};
        return panelNavDirective;

        function watchForPanelChange(scope, element, attr) {
            scope.$watch("currentPanel", function(newPanel, oldPanel) {
                if (newPanel !== undefined) {
                    scope.currentPanel = newPanel;
                } 
                
            })
                    
        }

    }

    // add additional services to be used within the controller
    panelNavController.$inject = ["$scope", "$state", "contentFactory", "layoutFactory"];

    function panelNavController($scope, $state, contentFactory, layoutFactory) {
        // --------------------------------------------------------------------
        // define bindable members 
        $scope.currentPanel = layoutFactory.getCurrentPanel();
        $scope.listOfStories = [];
        $scope.changePanel = changePanel;

        // --------------------------------------------------------------------
        // call functions
        // NONE
        
        // --------------------------------------------------------------------
        // define functions
        function changePanel(panelId, panelUrlName) {
            // set current panel to the selected panel
            layoutFactory.setCurrentPanel(panelId, panelUrlName);
            $scope.currentPanel = layoutFactory.getCurrentPanel();
            // transition to the selected panel
            $state.go("app.panel", {
                currentWorkspaceUrl: layoutFactory.getCurrentWorkspace().url_name,
                currentPanelUrl: layoutFactory.getCurrentPanel().url_name,
            });
     
        }

                
    }

})();