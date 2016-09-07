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
            // get list of personas to be displayed
            authenticationFactory.getListOfPersonas()
                                 .then(function(listOfPersonas) { 
                                    $scope.listOfPersonas = listOfPersonas; 
                                 });

        }

        function login(personaId) {
            var getDefaultWorkspace = function(personaId) {
                // get the persona's default workspace to be passed in to the transition function
                return layoutFactory.getDefaultWorkspace(personaId) 
                                    .then(function(defaultWorkspace) {
                                        return defaultWorkspace.id;
                                    });
            };
            var getDefaultPanel = function(workspaceId) {
                console.log("getDefaultPanel");
                // get the workspace's default panel to be passed in to the transition function
                return layoutFactory.getDefaultPanel(workspaceId) 
                                    .then(function(defaultPanel) {
                                        console.log("workspaceId: " + workspaceId);
                                        console.log("defaultPanel.id: " + defaultPanel.id);
                                        return workspaceId, defaultPanel.id;
                                    });
            };
            var transition = function(defaultWorkspaceId, defaultPanelId) {
                console.log("transition");
                // transition to the persona's default workspace and the workspace's default panel
                $state.go("app.panel.visual", {
                    workspace: defaultWorkspaceId,
                    panel: defaultPanelId,
                    grid: visual_config.tilemap
                });

            };

            //identify the current persona by setting its id
            authenticationFactory.setPersonaId(personaId);
            getDefaultWorkspace(personaId)
                .then(getDefaultPanel)
                .then(transition);
        
        }

    }

})();



