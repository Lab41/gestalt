angular.module("panel-controller", [])

.controller("panelCtrl", ["$scope", "$stateParams", "$state", "contentService", "layoutService", "authenticationService", "$rootScope","screenshotService", function($scope, $stateParams, $state, contentService, layoutService, authenticationService, $rootScope,screenshotService) {
    
    var workspaceParam = $stateParams.workspace;
    var panelParam = $stateParams.panel;
	
	// data objects
	$scope.content;
    $scope.iframeHeight;
    $scope.iframeHeight;

    // for hiding the animation when user is downloading screenshot.
    $scope.hideLoader=true;
	// get credentials from local storage
    authenticationService.getCredentials().then(function(userData) {
        
        var user = { user: userData.user, id: userData.id};
		var objs = { multi: "panels", single: "panel" };
		var endpoint = workspaceParam + "/panels/" + user.id + "/";
		var check = { key: "url_name", value: panelParam };

		// pull panel from stored panels in service
		layoutService.getStructure(panelParam, objs, endpoint, check).then(function(panelData) {

			// get all stories for panel and persona
			contentService.getData("story/persona/" + panelData.persona_id + "/panel/" + panelData.panel_id + "/").then(function(data) {

				// set scope
				$scope.content = data;

			});

		});
		
	});

	    // trigger screenshot
    $scope.takeScreenshot = function() {
        console.log("before taking screenshot");
        // post info for phantom
        screenshotService.postScreenCapture().then(function(data) {

        	// Force download for user.
            var link = document.createElement("a");
  			link.download = "data:image/png,myVis.png";
  			link.href = data.data;
  			document.body.appendChild(link);
  			link.click();
  			document.body.removeChild(link);
  			delete link;

  			// hide the loading animation. They are done downloading...
  			$scope.hideLoader=true;

            
        })
    
    };

}]);
