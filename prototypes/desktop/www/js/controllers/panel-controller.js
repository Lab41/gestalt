angular.module("panel-controller", [])

.controller("panelCtrl", ["$scope", "$stateParams", "$state", "contentService", "layoutService", "authenticationService", "$rootScope", function($scope, $stateParams, $state, contentService, layoutService, authenticationService, $rootScope) {
    
    var workspaceParam = $stateParams.workspace;
    var panelParam = $stateParams.panel;
	
	// data objects
	$scope.content;
    
    function setPanel(panelParam, workspace, user) {
        
        // pull panel from stored panels in service
        layoutService.getStructure(panelParam, "panel", "panels", workspace.id + "/panels/").then(function(panelData) {console.log(panelData);

            // get all stories for panel and persona
            contentService.getData("story/persona/" + user.id + "/panel/" + panelData.id + "/").then(function(data) {

                // set scope
                $scope.content = data;

            });

        }); 
        
    };
    
    // detect workspace change
    $rootScope.$on("workspaceChange", function(event, args) {
        
        // clear stored layout values
        layoutService.clearValues(["workspaces", "workspace", "panels", "panel"]);
        
        var user = args.user;
        var workspace = args.workspace;
        
        setPanel(panelParam, workspace, user);
        
    });
    
    // detect panel change
    $rootScope.$on("panelChange", function(event, args) {
        
        // clear stored layout values
        layoutService.clearValues(["panels", "panel"]);
        
        var user = args.user;
        var workspace = args.workspace;
        
        setPanel(panelParam, workspace, user);
        
    });
	
}]);