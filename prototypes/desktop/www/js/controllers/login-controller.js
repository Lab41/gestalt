// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set login-controller application and register its controller
    angular
        .module("login-controller", [])
        .controller("loginController", loginController);

    // add additional services to be used within the controller
    loginController.$inject = ["$scope", "$state", "authenticationFactory", "layoutFactory"];

    // define the controller
    function loginController($scope, $state, authenticationFactory, layoutFactory) {
        console.log("")

        // --------------------------------------------------------------------
        // define bindable members
        $scope.listOfPersonas = [];
        $scope.login = login;

        // ----------------------------- F---------------------------------------
        // call functions
        activate(); 

        // --------------------------------------------------------------------
        // define functions
        function activate() {
            // get a list of all personas to be displayed
            authenticationFactory.getAllPersonas()
                                 .then(function(listOfPersonas) { 
                                    $scope.listOfPersonas = listOfPersonas; 
                                 });

        }

        function login(personaId, personaName) {
            // TODO: refactor this because the functionality is similar to slide-panel-directive's changeWorkspace function         
            var getDefaultWorkspace = function(personaId) {
                // get the persona's default workspace to be passed in to the transition function
                return layoutFactory.getDefaultWorkspace(personaId) 
                                    .then(function(defaultWorkspace) {
                                        return defaultWorkspace.id;
                                    });
            };
            var getDefaultPanel = function(workspaceId) {
                // get the workspace's default panel to be passed in to the transition function
                return layoutFactory.getDefaultPanel(workspaceId) 
                                    .then(function(defaultPanel) {
                                        return workspaceId, defaultPanel.id;
                                    });
            };
            var transition = function(workspaceId, panelId) {
                // set current persona
                authenticationFactory.setCurrentPersona(personaId, personaName);
                // set current workspace
                layoutFactory.setCurrentWorkspaceId(workspaceId);
                // set current panel
                layoutFactory.setCurrentPanelId(panelId);

                // transition to the persona's default workspace and the workspace's default panel
                $state.go("app.panel.visual", {
                    workspace: workspaceId,
                    panel: panelId,
                    grid: visual_config.tilemap
                });

            };

            // get the persona's default workspace and the workspace's default panel 
            // in order to transition
            getDefaultWorkspace(personaId)
                .then(getDefaultPanel)
                .then(transition);
        
        }

    }

})();



