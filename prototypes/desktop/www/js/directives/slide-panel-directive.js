// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set slide-panel-directive application and register its directive
    angular
        .module("slide-panel-directive", [])
        .directive("slidePanel", slidePanelDirective);

    function slidePanelDirective() {
        // return a slidePanelDirective instance
        var slidePanelDirective = {
    		restrict: "E",
            template: "<section ng-class='{ show: visible, left: alignment === \"left\", right: alignment === \"right\" }'><ui-view name='slide'></ui-view></section>",
    		scope: {
                visible: "=",
                alignment: "@",
                content: "="
            },
            controller: slidePanelController,
                		
    	};
        return slidePanelDirective;
        
    }

    slidePanelController.$inject = ["$rootScope", "$scope", "$state", "authenticationFactory", "layoutFactory"];


    function slidePanelController($rootScope, $scope, $state, authenticationFactory, layoutFactory) { 
        console.log("slidePanelController");
        // --------------------------------------------------------------------
        // define bindable members  
        $scope.logout = logout;
        $scope.changeWorkspace = changeWorkspace;
        // --------------------------------------------------------------------
        // call functions
        activate(); 

        // --------------------------------------------------------------------
        // define functions
        function activate() {
            console.log("in slidePanelController");

            // handle theme change
            $rootScope.$on("themeChange", function(event, args) {
                var oldContent = $scope.content;
                $scope.content = {
                    currentPersona: oldContent.currentPersona,
                    theme: args.theme,
                    currentWorkspaceId: oldContent.currentWorkspaceId,
                    listOfWorkspaces: oldContent.listOfWorkspaces
                };
            });

        }

        function logout() {
            // clear stored information
            authenticationFactory.cleanup();
            layoutFactory.cleanup();

            // transition state
            $state.go("login");
        }

        function changeWorkspace(newWorkspaceId) {   
            // TODO: refactor this because the functionality is similar to login-controller's login function         
            var getDefaultPanel = function(workspaceId) {
                // get the workspace's default panel to be passed in to the transition function
                return layoutFactory.getDefaultPanel(workspaceId) 
                                    .then(function(defaultPanel) {
                                        return workspaceId, defaultPanel.id;
                                    });
            };
            var transition = function(workspaceId, panelId) {      
                // set current workspace
                layoutFactory.setCurrentWorkspaceId(workspaceId);
                // set current panel
                layoutFactory.setCurrentPanelId(panelId);

                // transition to the new workspace and its respective default panel
                $state.go("app.panel.visual", {
                    workspace: workspaceId,
                    panel: panelId,
                });

            };

            // get the workspace's default panel 
            // in order to transition
            getDefaultPanel(newWorkspaceId)
                .then(transition);
      
        }
                
    }

})();