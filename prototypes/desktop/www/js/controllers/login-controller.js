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
        // define bindable members
        $scope.listOfPersonas;
        $scope.login = login;

        // call functions
        getListOfPersonas();

        // define functions
        function getListOfPersonas() {
            authenticationFactory.callBackend()
                .then(function(listOfPersonas){ 
                    $scope.listOfPersonas = listOfPersonas; 
                });
        }

        function login(personaId) {
            authenticationFactory.setPersonaId(personaId);

            /*
            var defaultWorkspace = layoutFactory.getDefaultWorkspace(personaId);
            var defaultPanel = layoutFactory.getDefaultPanel(defaultWorkspaceId);

            console.log("defaultWorkspace: " + defaultWorkspace);

            // transition to default workspace
            $state.go("app.panel.visual", {
                workspace: defaultWorkspace.id,
                panel: defaultPanel.id,
                grid: visual_config.tilemap
            });
            */
           
            var endpoint = "persona/" + personaId +  "/";
            var objs = { multi: "workspaces", single: "workspace" };
            var check = { key: "is_default", value: true };
            
            // get single workspace
            layoutFactory.getStructure(true, objs, endpoint, check).then(function(singleWorkspace) {

                var workspace = singleWorkspace;

                // transition to default workspace
                $state.go("app.panel.visual", {
                    workspace: workspace.url_name,
                    panel: workspace.default_panel,
                    grid: visual_config.tilemap
                });

            });
                
        }

    }

})();



