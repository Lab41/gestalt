angular.module("login-controller", [])

.controller("loginCtrl", ["$scope", "$state", "authenticationService", "layoutService", "$rootScope", function ($scope, $state, authenticationService, layoutService, $rootScope) {
        
	// get PERSONA CONTENT data stored in service
	authenticationService.getData("").then(function(data) {
		
        $scope.content = data;
		
	});
    
    // login with persona
    $scope.login = function(persona, personaID) {
        
        // get credentials from local storage
        authenticationService.postCredentials(persona, personaID).then(function(personaData) {

            // get workspaces
            layoutService.getStructures("persona/" + personaID + "/", "workspaces").then(function(data) {
                
                // find default workspace to navigate to
                angular.forEach(data, function(value, key) {
                    
                    // check for default
                    if (value.is_default) {
                        
                        var workspace = value;
                        
                        // transition to default workspace
                        $state.go("app.panel.visual", {
                            
                            workspace: workspace.url_name,
                            panel: workspace.default_panel,
                            grid: visual_config.tilemap
                            
                        // after state transition
                        }).then(function() {
                            
                            // broadcast that workspace is defined for all other endpoint calls
                            // broadcast so menu text will update
                            $rootScope.$broadcast("login", { user: personaData, workspaces: data, workspace: workspace });
                            
                        });
                        
                    };
                    
                });

            });
            
        });
                
    };

}]);