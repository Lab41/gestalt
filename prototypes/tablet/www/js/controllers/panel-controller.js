angular.module("panel-controller", [])

.controller("panelCtrl", ["$scope", "$stateParams", "$state", "contentService", "layoutService", "$ionicLoading", "$rootScope", function($scope, $stateParams, $state, contentService, layoutService, $ionicLoading, $rootScope) {
    
    var workspace = $stateParams.workspace;
    var panel = $stateParams.panel;
	
	// data objects
	$scope.content;
	$scope.panel;
	$scope.workspace = workspace;
	$scope.moreDataExists = true; // for infinite scroll
    $scope.busyLoadingData = false; // prevent loading more while async is loading more
    $scope.$parent.$parent.panelParam = panel[0].toUpperCase() + panel.substring(1, panel.length);
   
    // block UI show loading
    $ionicLoading.show({
    	template: "<ion-spinner icon='dots'></ion-spinner><p>Loading...</p>"
    });
	
	// get CONTENT data stored in service
	contentService.getData(panel).then(function(data) {
		
		// set scope
		$scope.content = data.length > 0 ? data : [{ title: "Nothing Found.", content: "Sorry but can't find any content.", poster: "None" }];
		
		// hide loading
		$ionicLoading.hide();
		
	});
	
	// get LAYOUT data stored in service	
	layoutService.getStructure(panel).then(function(data) {
		
		// set scope
		$scope.panel = data;
		
	});
    
    // show panel navigation
	//$rootScope.$broadcast("hideNav", { "val": false });
	
}]);