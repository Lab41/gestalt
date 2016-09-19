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

    // add additional services to be used within the controller
    slidePanelController.$inject = ["$rootScope", "$scope", "$state", "authenticationService", "layoutService"];

    function slidePanelController($rootScope, $scope, $state, authenticationService, contentService, layoutService) { 
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
            authenticationService.cleanup();
            layoutService.cleanup();
            contentService.cleanup();

            // transition state
            $state.go("login");
        }

        function changeWorkspace(newWorkspaceId, newWorkspaceUrlName) {   
            // TODO: refactor this because the functionality is similar to login-controller's login function         
            var getDefaultPanel = function(workspaceId, workspaceUrlName) {
                // get the workspace's default panel to be passed in to the transition function
                return layoutService.getDefaultPanel(workspaceId) 
                                    .then(function(defaultPanel) {
                                        // set current panel
                                        layoutService.setCurrentPanel(defaultPanel.id, defaultPanel.url_name);
                                        return defaultPanel.id;
                                    });
            };
            var transition = function() {      
                // transition to the new workspace and its respective default panel
                // triggers watchForPanelChange function in panel-nav-directive
                // TODO: need to handle visualParam
                $state.go("app.panel.story.visual", {
                    currentWorkspaceUrl: layoutService.getCurrentWorkspace().url_name,
                    currentPanelUrl: layoutService.getCurrentPanel().url_name,
                    currentStoryUrl: contentService.getCurrentStory().url_name,
                    // TODO: add the visual
                });

            };

            // set current workspace
            layoutService.setCurrentWorkspace(newWorkspaceId, newWorkspaceUrlName);

            // get the workspace's default panel 
            // in order to transition
            getDefaultPanel(newWorkspaceId, newWorkspaceUrlName)
                .then(transition);
      
        }
                
    }

})();