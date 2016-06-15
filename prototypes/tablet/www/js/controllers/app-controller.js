angular.module("app-controller", [])

.controller("appCtrl", ["$scope", "$rootScope", "$state", "$stateParams", "$ionicPopup", "layoutService", function($scope, $rootScope, $state, $stateParams, $ionicPopup, layoutService) {
    
    var persona = $stateParams.workspace;
    
    // data objects
    $scope.panels;
    $scope.workspaces;
	$scope.workspacePanel = persona;
    
	// get LAYOUT data stored in service
    function getMultiple(path, structure) {
        
        layoutService.getStructures(path, structure).then(function(data) {

            // set scope
            $scope[structure] = data;

        });
        
    };
    
    // get layout info
    getMultiple("workspaces", "workspaces");
    getMultiple(persona, "panels");
    
    // change workspace
    $scope.changeWorkspace = function(workspace, panel) {
        
        // transition state
        $state.go("app.panel", {
            workspace: workspace,
            panel: panel
        });
		
		// set active workspace
		$scope.workspacePanel = workspace;
        
        // populate panels
        getMultiple(workspace, "panels");
        
    };
	
}]);