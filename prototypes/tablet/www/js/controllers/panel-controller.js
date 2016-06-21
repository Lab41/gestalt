angular.module("panel-controller", [])

.controller("panelCtrl", ["$scope", "$stateParams", "$state", "contentService", "layoutService", "$ionicLoading", "authenticationService", "$timeout", function($scope, $stateParams, $state, contentService, layoutService, $ionicLoading, authenticationService, $timeout) {
    
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
    var user = authenticationService.getCredentials();
    
    $timeout(function() {
        
        // get CONTENT data stored in service
        contentService.getData("stories/" + panelParam + "/persona/" + user.id).then(function(data) {

            // check for story workspace
            // TODO make less hacky
            /*if ($scope.$parent.$parent.workspace.panel == "story") {

                // get stories
                contentService.getData("stories/" + user.id).then(function(storyData) {

                    // set scope
                    $scope.content = storyData;

                });

            } else {*/

                // set scope
                $scope.content = data;

            //};

            // hide loading
            //$ionicLoading.hide();

        });
        
    });
	
}]);