angular.module("panel-controller", [])

.controller("panelCtrl", ["$scope", "$stateParams", "$state", "contentService", "layoutService", "authenticationService", "$rootScope", function($scope, $stateParams, $state, contentService, layoutService, authenticationService, $rootScope) {
    
    var workspace = $stateParams.workspace;
    var panelParam = $stateParams.panel;
	
	// data objects
	$scope.content;
    
    // get persona 
    authenticationService.getCredentials().then(function(userData) {
        
        var user = userData;
        
        layoutService.getStructure(panelParam, "panel", "panels").then(function(panelData) {
                   
            // check for stories
            if (panelData.panel == "story") {

                // get all stories for persona
                contentService.getData("stories/" + user.id + "/").then(function(data) {

                    // set scope
                    $scope.content = data;

                });

            } else {

                // get all stories for panel and persona
                contentService.getData("stories/" + panelParam + "/persona/" + user.id + "/").then(function(data) {

                    // set scope
                    $scope.content = data;

                });

            };
            
        });
        
    });
	
}]);