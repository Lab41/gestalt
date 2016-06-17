angular.module("app-controller", [])

.controller("appCtrl", ["$scope", "$rootScope", "$state", "$stateParams", "$ionicPopup", "layoutService", function($scope, $rootScope, $state, $stateParams, $ionicPopup, layoutService) {
    
    var workspace = $stateParams.workspace;
    
    // encode url spaces
    function beautyEncode(str) {
		str = str.replace(/ /g, '-');
		return str;
	};
    
    // data objects
    $scope.panels;
    $scope.workspaces;
    $scope.workspace;
    $scope.workspacePanel = workspace;
    
	// get LAYOUT data stored in service
    layoutService.getStructures("").then(function(data) {

        // set scope
        $scope.workspaces = data;

    });
    
    // get LAYOUT data stored in service
    layoutService.getStructures(workspace).then(function(data) {
        
        var workspace = data[0];

        // set scope
        $scope.workspace = workspace;
        $scope.panels = workspace.panels;

    });
    
    // change workspace
    $scope.changeWorkspace = function(workspace, panel, panelType) {
        
        // transition state
        $state.go("app.panel", {
            workspace: beautyEncode(workspace),
            panel: beautyEncode(panel)
        });
		
		// set active workspace
		$scope.workspacePanel = workspace;
        
        // get LAYOUT data stored in service
        layoutService.getStructures("panel/" + panelType).then(function(data) {

            // set scope
            $scope.panels = data;

        });
        
    };
	
}]);