// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set panel-controller application and register its controller
    angular
        .module("panel-controller", [])
        .controller("panelController", panelController);

    // add additional services to be used within the controller
    panelController.$inject = ["$rootScope", "$scope",  "$state", "$stateParams", "authenticationFactory", "contentFactory", "layoutFactory"];

    // define the controller
    function panelController($rootScope, $scope, $state, $stateParams, authenticationFactory, contentFactory, layoutFactory) {
        
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
        layoutFactory.getStructure(panelParam, objs, endpoint, check).then(function(panelData) {

            // get all stories for panel and persona
            contentFactory.getData("story/persona/" + panelData.persona_id + "/panel/" + panelData.panel_id + "/").then(function(data) {

                // set scope
                $scope.content = data;

            });

        }); 
    	
    }

})();
