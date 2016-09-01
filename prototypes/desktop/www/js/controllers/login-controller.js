// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set login-controller application and register its controller
    angular
        .module("login-controller", [])
        .controller("loginController", loginController);

    // add additional services to be used within the controller
    loginController.$inject = ["$scope", "$state", "authenticationService", "layoutService"];

    // define the controller
    function loginController($scope, $state, authenticationService, layoutService) {
        $scope.listOfPersonas;
        $scope.login = login;

        // call functions
        getListOfPersonas();

        // define functions
        function getListOfPersonas() {
            authenticationService.callBackend()
                .then(function(listOfPersonas){ 
                    $scope.listOfPersonas = listOfPersonas; 
                });
        }

        function login(personaId) {
            // TODO: need to clean this function more
            authenticationService.setPersonaId(personaId);
            var endpoint = "persona/" + personaId + "/";
            var objs = { multi: "workspaces", single: "workspace" };
            var check = { key: "is_default", value: true };
            
            layoutService.getStructure(true, objs, endpoint, check).then(function(singleWorkspace) {

                var workspace = singleWorkspace;

                for(var i in workspace) {
                    console.log("workspace[" + i + "]: " + workspace[i]);
                }


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



