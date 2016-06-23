angular.module("app-controller", [])

.controller("appCtrl", ["$scope", "$stateParams", "$state", "layoutService", "authenticationService", "$rootScope", function($scope, $stateParams, $state, layoutService, authenticationService, $rootScope) {
    
    var workspaceParam = $stateParams.workspace;
    var panelID = $stateParams.panel;
    var storyPanelTitle = "all stories";
    
    // data objects
    $scope.panels;
    $scope.panel;
    $scope.user;
    $scope.workspaces;
    $scope.workspace;
    $scope.workspaceParam = workspaceParam;
    $scope.leftVisible = false;
    $scope.rightVisible = false;
    
    // detect login
    $rootScope.$on("login", function(event, args) {
        
        // scope
        $scope.user = args.user;
        $scope.workspaces = args.workspaces;
        
    });
    
    // get persona 
    authenticationService.getCredentials().then(function(userData) {
        
        var user = userData;
        
        // set scope
        $scope.user = userData;
            
        // get workspaces for persona in local storage (i.e. user)
        layoutService.getStructures("persona/" + user.id + "/", "workspaces").then(function(data) {
    
            // set scope
            $scope.workspaces = data;
            
            // set menu content
            $scope.menu = {
                user: user,
                theme: $scope.$parent.theme,
                workspaces: data,
                workspaceParam: workspaceParam
            };

        });
        
        // get single workspace
        layoutService.getStructures(workspaceParam + "/persona/" + user.id + "/", "workspaces").then(function(data) {

            var workspace = data[0];
            
            // set scope
            $scope.workspace = workspace;
            $scope.panels = workspace.panel == "story" ? [{name: storyPanelTitle}] : workspace.panels;

        });
        
        // store panels for later
        layoutService.getStructures("panel/", "panels").then(function(data) {
            
        });
        
    });
    
    function _close() {
        $scope.$apply(function() {
            $scope.closePanel(); 
        });
    };

    $scope.closePanel = function() {
        $scope.leftVisible = false;
        $scope.rightVisible = false;
    };

    $scope.showLeft = function(event) {
        $scope.leftVisible = true;
        event.stopPropagation();
    };

    $scope.showRight = function(event) {
        $scope.rightVisible = true;
        event.stopPropagation();
    };

    $rootScope.$on("documentClicked", _close);
    $rootScope.$on("escapedPressed", _close);
	
}]);