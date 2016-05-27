angular.module("app-controller", [])

.controller("appCtrl", ["$scope", "$rootScope", "$stateParams", "layoutService", function($scope, $rootScope, $stateParams, layoutService) {
	
	var workspace = $stateParams.workspace;
    
    // data objects
    $scope.panels;
    
	// get LAYOUT data stored in service	
	layoutService.getPanels($rootScope.globals.currentUser.username).then(function(data) {
		
		// set scope
		$scope.panels = data;
		
	});
	
}]);