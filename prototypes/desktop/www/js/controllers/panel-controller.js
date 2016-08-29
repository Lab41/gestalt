angular.module("panel-controller", [])

.controller("panelCtrl", ["$scope", "$stateParams", "$state", "contentService", "layoutService", "authenticationService", "$rootScope", function($scope, $stateParams, $state, contentService, layoutService, authenticationService, $rootScope) {
    
    console.log("in panel-controller");

    var workspaceParam = $stateParams.workspace;
    var panelParam = $stateParams.panel;
	
	// data objects
	$scope.content;
    
    //function setPanel(panelParam, workspace, user) {
    var objs = { multi: "panels", single: "panel" };
    var endpoint = workspaceParam + "/panels/";
    var check = { key: "url_name", value: panelParam };

    // pull panel from stored panels in service
    layoutService.getStructure(panelParam, objs, endpoint, check).then(function(panelData) {

        // get all stories for panel and persona
        contentService.getData("story/persona/" + panelData.persona_id + "/panel/" + panelData.panel_id + "/").then(function(data) {

            // set scope
            $scope.content = data;

        });

    }); 
	
}]);