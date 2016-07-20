angular.module("login-controller", [])

.controller("loginCtrl", ["$scope", "$state", "authenticationService", "layoutService", "$rootScope", function ($scope, $state, authenticationService, layoutService, $rootScope) {
        
	// get PERSONA CONTENT data stored in service
	authenticationService.getData("").then(function(data) {
		
        $scope.content = data;
		
	});
    
    // login with persona
    $scope.login = function(persona, personaID) {
        
        // post credentials to local storage
        authenticationService.postCredentials(persona, personaID).then(function(personaData) {
        
            // TODO make smarter so a default workspace is defined
            // vs. just taking the first one

            // get workspaces
            layoutService.getStructures("persona/" + personaID).then(function(data) {
                
                // broadcast so menu text will update
                $rootScope.$broadcast("login", { user: personaData, workspaces: data });

                var workspace = data[0];

                // transition to default workspace
                $state.go("app.panel.visual", {
                    workspace: workspace.param,
                    panel: workspace.default_panel,
					grid: visual_config.tilemap
                });

            });
            
        });
                
    };

}]);