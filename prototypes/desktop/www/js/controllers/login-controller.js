angular.module("login-controller", [])

.controller("loginCtrl", ["$scope", "$state", "authenticationService", "layoutService",
    "economicService", "$rootScope", function ($scope, $state, authenticationService, layoutService, economicService, $rootScope) {
        
	// get PERSONA CONTENT data stored in service
	authenticationService.getData("").then(function(data) {
		
        $scope.content = data;
		
	});
    
    // login with persona
    $scope.login = function(persona, personaID) {

        // get credentials from local storage
        authenticationService.postCredentials(persona, personaID).then(function(personaData) {
            
            var user = personaData;
            var endpoint = "persona/" + user.id + "/";
            var objs = { multi: "workspaces", single: "workspace" };
            var check = { key: "is_default", value: true };
            
            // get single workspace
            layoutService.getStructure(true, objs, endpoint, check).then(function(singleWorkspace) {

                var workspace = singleWorkspace;

                // transition to default workspace
                $state.go("app.panel.visual", {
                    workspace: workspace.url_name,
                    panel: workspace.default_panel,
                    visual: workspace.default_vis
                });

            });
            
        });
                
    };

}]);
