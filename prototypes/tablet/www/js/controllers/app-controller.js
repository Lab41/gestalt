angular.module("app-controller", [])

.controller("appCtrl", ["$scope", "$stateParams", "$state", "layoutService", "authenticationService", "$timeout", function($scope, $stateParams, $state, layoutService, authenticationService, $timeout) {
    
    var workspaceParam = $stateParams.workspace;
    var panelID = $stateParams.panel;
    var storyPanelTitle = "all stories";
    
    // data objects
    $scope.panels;
    $scope.panel;
    $scope.workspaces;
    $scope.workspace;
    $scope.workspaceParam = workspaceParam;
    
    // get persona 
    var user = authenticationService.getCredentials();
    
    $scope.user = user;
    
    $timeout(function() {
        
        // get workspaces for persona in local storage (i.e. user)
        layoutService.getStructures("persona/" + user.id).then(function(data) {
    
            // set scope
            $scope.workspaces = data;

        });
        
        // get single workspace
        layoutService.getStructures(workspaceParam + "/persona/" + user.id).then(function(data) {

            var workspace = data[0];
            
            // set scope
            $scope.workspace = workspace;
            $scope.panels = workspace.panel == "story" ? [{name: storyPanelTitle}] : workspace.panels;

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
        layoutService.getStructures(workspaceID + "/panel/" + panelType).then(function(data) {

            // set scope
            $scope.panels = panelType == "story" ? [{name: storyPanelTitle}] : data;

        });
        
    };
    
    // log out
    $scope.logout = function() {
        
        authenticationService.clearCredentials();console.log(localStorage.getItem("gestaltUser"));
        
        // transition state
        $state.go("login",{},{
            reload: true,
            notify: true
        });
        
    };
	
}]);