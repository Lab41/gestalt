angular.module("panel-controller", [])

.controller("panelCtrl", ["$scope", "$stateParams", "$state", "contentService", "layoutService", "$ionicLoading", "authenticationService", "$rootScope", function($scope, $stateParams, $state, contentService, layoutService, $ionicLoading, authenticationService, $rootScope) {
    
    var workspace = $stateParams.workspace;
    var panelParam = $stateParams.panel;
	
	// data objects
	$scope.content;
    $scope.busyLoadingData = false; // prevent loading more while async is loading more
   
    // block UI show loading
    $ionicLoading.show({
    	template: "<ion-spinner icon='dots'></ion-spinner><p>Loading...</p>"
    });
    
    // get persona 
    authenticationService.getCredentials().then(function(userData) {
        
        var user = userData;
        
        layoutService.getStructure(panelParam, "panel", "panels").then(function(panelData) {
                   
            // check for stories
            if (panelData.panel == "story") {

                // get all stories for persona
                contentService.getData("stories/" + user.id).then(function(data) {

                    // set scope
                    $scope.content = data;

                    // hide UI loading
                    $ionicLoading.hide();

                });

            } else {

                // get all stories for panel and persona
                contentService.getData("stories/" + panelParam + "/persona/" + user.id).then(function(data) {

                    // set scope
                    $scope.content = data;

                    // hide UI loading
                    $ionicLoading.hide();

                });

            };
            
        });
        
    });
	
}]);