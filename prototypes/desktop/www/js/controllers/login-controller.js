var loginCtrl = function($scope, $state, authenticationService, layoutService, $rootScope) {
    var _this = this;
    _this.authenticationService = authenticationService;
    _this.layoutService = layoutService;

    authenticationService.getData("").then(function(data) {
        $scope.content = data;
    });

    $scope.login = function(personaId, personaName) {
        _this.login();
    }
}

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

    // get credentials from local storage
    _this.authenticationService.postCredentials(personaId, personaName).then(function(persona) {
        
        var backendUrl = "persona/" + persona.id + "/";
        var objs = { multi: "workspaces", single: "workspace" };
        var check = { key: "is_default", value: true };
        
        // get single workspace
        _this.layoutService.getStructure(true, objs, backendUrl, check).then(function(singleWorkspace) {
>>>>>>> avoiding scope soup

            // TODO: I am here right now
            var workspace = singleWorkspace;

            // transition to default workspace
            $state.go("app.panel.visual", {
                workspace: workspace.url_name,
                panel: workspace.default_panel,
                grid: visual_config.tilemap
            });

            console.log("end of login-controller");

        });
        
    });
            
};

loginCtrl.$inject = ["$scope", "$state", "authenticationService", "layoutService", "$rootScope"];
angular.module("login-controller", []).controller("loginCtrl", loginCtrl);