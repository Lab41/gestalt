angular.module("panel-controller", [])

.controller("panelCtrl", ["$scope", "$stateParams", "$state", "contentService", "layoutService", "$ionicLoading", "authenticationService", function($scope, $stateParams, $state, contentService, layoutService, $ionicLoading, authenticationService) {
    
    var workspace = $stateParams.workspace;
    var panelParam = $stateParams.panel;
	
	// data objects
	$scope.content;
    $scope.busyLoadingData = false; // prevent loading more while async is loading more
   
    // block UI show loading
    /*$ionicLoading.show({
    	template: "<ion-spinner icon='dots'></ion-spinner><p>Loading...</p>"
    });*/
    
    // get persona 
    // get persona 
    authenticationService.getCredentials().then(function(userData) {
        
        var user = userData;
        
        // check for story workspace
        // TODO make less hacky
        if (workspace == "fa9ee9a8f53af1d95b97a8ff9ee7572d") {
            
            // get all stories for persona
            contentService.getData("stories/" + user.id).then(function(data) {

                // set scope
                $scope.content = data;

            });
            
        } else {
            
            // get all stories for panel and persona
            contentService.getData("stories/" + panelParam + "/persona/" + user.id).then(function(data) {
                
                // set scope
                $scope.content = data;
                
            });
            
        };
        
    });
	
}]);