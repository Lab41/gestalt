// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set login-controller application and register its controller
    angular
        .module("login-controller", [])
        .controller("loginController", loginController);

    // add additional services to be used within the controller
    loginController.$inject = ["$scope", "$state", "$templateCache", "authenticationService", "layoutService", "contentService"];

    // define the controller
    function loginController($scope, $state, $templateCache, authenticationService, layoutService, contentService) {
        // --------------------------------------------------------------------
        // define bindable members
        $scope.listOfPersonas = [];
        $scope.login = login;

        // --------------------------------------------------------------------
        // call functions
        activate(); 

        // --------------------------------------------------------------------
        // define functions
        function activate() {
            // get a list of all personas to be displayed
            authenticationService
                .getAllPersonas()
                .then(function(listOfPersonas) { 
                    $scope.listOfPersonas = listOfPersonas; 
                });

        }

        function login(personaId, personaName) {
            // TODO: refactor this because the functionality is similar to slide-panel-directive's changeWorkspace function         
            var getDefaultWorkspace = function(personaId) {
                // get the persona's default workspace to be passed in to the transition function
                return layoutService
                        .getDefaultWorkspace(personaId) 
                        .then(function(defaultWorkspace) {
                            // set current workspace
                            layoutService.setCurrentWorkspace(defaultWorkspace.id, defaultWorkspace.url_name);
                            return defaultWorkspace.id;
                        });
            };
            var getDefaultPanel = function(workspaceId) {
                // get the workspace's default panel to be passed in to the transition function
                return layoutService
                        .getDefaultPanel(workspaceId) 
                        .then(function(defaultPanel) {
                            // set current panel
                            layoutService.setCurrentPanel(defaultPanel.id, defaultPanel.url_name);
                            return { workspaceId: workspaceId, panelId: defaultPanel.id };
                        });
            };
            var getDefaultStory = function(input) {
                // get the panel's default story to be passed into the transition function
                return contentService
                       .getDefaultStory(input.workspaceId, input.panelId)
                       .then(function(defaultStory) {
                            // set current story
                            contentService.setCurrentStory(defaultStory.id, defaultStory.url_name);
                            console.log("currentStory: " + angular.toJson(contentService.getCurrentStory()));
                            console.log(angular.toJson(defaultStory));
                            return defaultStory.id;
                       });
            };
            var transition = function() {                
                // transition to the persona's default workspace and the workspace's default panel
                $state.go("app.panel.story.visual", {
                    currentWorkspaceUrl: layoutService.getCurrentWorkspace().url_name,
                    currentPanelUrl: layoutService.getCurrentPanel().url_name,
                    currentStoryUrl: contentService.getCurrentStory().url_name,
                    // TODO: figure out which visual template to use?
                    currentVisualUrl: "visual-standard"
                });

            };

            // set current persona
            authenticationService.setCurrentPersona(personaId, personaName);

            // get the persona's default workspace and the workspace's default panel 
            // in order to transition
            getDefaultWorkspace(personaId)
                .then(getDefaultPanel)
                .then(getDefaultStory)
                .then(transition);
        }

    }

})();



