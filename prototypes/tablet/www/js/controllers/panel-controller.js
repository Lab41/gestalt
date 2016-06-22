angular.module("panel-controller", [])

.controller("panelCtrl", ["$scope", "$stateParams", "$state", "contentService", "layoutService", "$ionicLoading", "authenticationService", "$rootScope", function($scope, $stateParams, $state, contentService, layoutService, $ionicLoading, authenticationService, $rootScope) {
    
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
    authenticationService.getCredentials().then(function(userData) {
        
        var user = userData;
        
        function getPanels(panel, param) {
                    
            // check for stories
            if (panel == "story") {
                
                // get all stories for persona
                contentService.getData("stories/" + user.id).then(function(data) {

                    // set scope
                    $scope.content = data;

                    // hide UI loading
                    $ionicLoading.hide();

                });
                
            } else {
                
                // get all stories for panel and persona
                contentService.getData("stories/" + param + "/persona/" + user.id).then(function(data) {

                    // set scope
                    $scope.content = data;

                    // hide UI loading
                    $ionicLoading.hide();
                    
                });
                
            };
            
        };

        $rootScope.$on("workspaceSet", function(event, args) {
            
            getPanels(args.panelType, panelParam);

        });
        
    });
	
}]);