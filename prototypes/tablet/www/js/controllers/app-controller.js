angular.module("app-controller", [])

.controller("appCtrl", ["$scope", "$stateParams", "$state", "layoutService", "authenticationService", "$rootScope", function($scope, $stateParams, $state, layoutService, authenticationService, $rootScope) {
    
    var workspaceParam = $stateParams.workspace;
    var panelID = $stateParams.panel;
    var storyPanelTitle = "all stories";
    
    // data objects
    $scope.panels;
    $scope.panel;
    $scope.user;
    $scope.workspaces;
    $scope.workspace;
    $scope.workspaceParam = workspaceParam;
    
    $rootScope.$on("login", function(event, args) {
        
        // scope
        $scope.user = args.user;
        $scope.workspaces = args.workspaces;
        
    });
    
    // get persona 
    authenticationService.getCredentials().then(function(userData) {
        
        var user = userData;
        
        // set scope
        $scope.user = userData;
            
        // get workspaces for persona in local storage (i.e. user)
        layoutService.getStructures("persona/" + user.id, "workspaces").then(function(data) {
    
            // set scope
            $scope.workspaces = data;

        });
        
        // get single workspace
        layoutService.getStructures(workspaceParam + "/persona/" + user.id, "workspaces").then(function(data) {

            var workspace = data[0];
            
            // set scope
            $scope.workspace = workspace;
            $scope.panels = workspace.panel == "story" ? [{name: storyPanelTitle}] : workspace.panels;

        });
        
        // store panels for later
        layoutService.getStructures("panel", "panels").then(function(data) {
            
        });
        
    });
    
    // change workspace
    $scope.changeWorkspace = function(workspaceID, workspaceParam, panelParam, panelType) {
        
        // transition state
        $state.go("app.panel", {
            workspace: workspaceParam,
            panel: panelParam
        });
		
		// set active workspace
		$scope.workspaceParam = workspaceParam;
        
        // get current workspace panels
        layoutService.getStructures(workspaceID + "/panel/" + panelType, "panels").then(function(data) {

            // set scope
            $scope.panels = panelType == "story" ? [{name: storyPanelTitle}] : data;

        });
        
    };
    
    // log out
    $scope.logout = function() {
        
        // clear credentials
        authenticationService.clearCredentials();
                
        // transition state
        $state.go("login", {
			t: $state.params.t
		}, {
			reload: false,
			notify: true
		});
        
    };
	
}]);