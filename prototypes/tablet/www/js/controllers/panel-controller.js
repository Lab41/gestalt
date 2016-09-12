angular.module("panel-controller", [])

.controller("panelCtrl", ["$scope", "$stateParams", "$state", "contentService", "layoutService", "$ionicLoading", "authenticationService", "$rootScope", function($scope, $stateParams, $state, contentService, layoutService, $ionicLoading, authenticationService, $rootScope) {
    
    var workspaceParam = $stateParams.workspace;
    var panelParam = $stateParams.panel;
	
	// data objects
	$scope.content;
    $scope.busyLoadingData = false; // prevent loading more while async is loading more
   
    // block UI show loading
    /*$ionicLoading.show({
    	template: "<ion-spinner icon='dots'></ion-spinner><p>Loading...</p>"
    });*/
    
    authenticationService.getCredentials().then(function(userData) {
        
        var user = userData;
		var objs = { multi: "panels", single: "panel" };
		var endpoint = workspaceParam + "/panels/" + user.id;
		var check = { key: "url_name", value: panelParam };

		// pull panel from stored panels in service
		layoutService.getStructure(panelParam, objs, endpoint, check).then(function(panelData) {

			// get all stories for panel and persona
			contentService.getData("story/persona/" + panelData.persona_id + "/panel/" + panelData.panel_id).then(function(data) {

				// set scope
				$scope.content = data;

				// hide UI loading
				$ionicLoading.hide();

			});

		}); 
		
	});
	
}]);