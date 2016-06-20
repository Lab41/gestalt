angular.module("panel-controller", [])

.controller("panelCtrl", ["$scope", "$stateParams", "$state", "contentService", "layoutService", "$ionicLoading", "$rootScope", function($scope, $stateParams, $state, contentService, layoutService, $ionicLoading, $rootScope) {
    
    var workspace = $stateParams.workspace;
    var panelParam = $stateParams.panel;
	
	// data objects
	$scope.content;
	$scope.panel;
    $scope.busyLoadingData = false; // prevent loading more while async is loading more
   
    // block UI show loading
    /*$ionicLoading.show({
    	template: "<ion-spinner icon='dots'></ion-spinner><p>Loading...</p>"
    });*/
    
	// get CONTENT data stored in service
	contentService.getData("stories/" + panelParam).then(function(data) {
		
		// set scope
		$scope.content = data;
		
		// hide loading
		//$ionicLoading.hide();
		
	});
    
    // show panel navigation
	//$rootScope.$broadcast("hideNav", { "val": false });
	
}]);