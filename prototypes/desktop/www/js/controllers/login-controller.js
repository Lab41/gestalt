// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set login-controller and register its controller
    angular
        .module("login-controller", [])
        .controller("loginController", loginController);

    // add additional services to be used within the controller
    loginController.$inject = ["$scope", "$state", "authenticationService", "layoutService"];

<<<<<<< 425b1cd370d0917d34c35e71b992e6be31f9a305
<<<<<<< da29128115c3ae1583d446f2b908a1d84c2660d0
                // transition to default workspace
                $state.go("app.panel.visual", {
                    workspace: workspace.url_name,
                    panel: workspace.default_panel,
                    visual: workspace.default_vis
                });
=======
loginCtrl.prototype.login = function(personaId, personaName) {
    var _this = this;
=======
    // define the controller
    function loginController($scope, $state, authenticationService, layoutService) {
>>>>>>> clean up front end login-controller and its respective services

        // define bindable members
        $scope.listOfPersonas;
        $scope.login = login;
        
<<<<<<< 425b1cd370d0917d34c35e71b992e6be31f9a305
        // get single workspace
        _this.layoutService.getStructure(true, objs, backendUrl, check).then(function(singleWorkspace) {
>>>>>>> avoiding scope soup
=======
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
>>>>>>> clean up front end login-controller and its respective services

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



