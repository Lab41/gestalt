angular.module("app-controller", [])

.controller("appCtrl", ["$scope", "$stateParams", "$state", "layoutService", "authenticationService", "$rootScope", function($scope, $stateParams, $state, layoutService, authenticationService, $rootScope) {
    
    var workspaceParam = $stateParams.workspace;
    var panelID = $stateParams.panel;
    var theme = $stateParams.t;
    
    // data objects
    $scope.panels;
    $scope.panel;
    $scope.user;
    $scope.workspaces;
    $scope.workspace;
    $scope.workspaceParam = workspaceParam;
    
    function setScope() {

        // get credentials from local storage
        authenticationService.getCredentials().then(function(userData) {

            var user = userData;
            var endpoint = "persona/" + user.id + "/";
            var objs = { multi: "workspaces", single: "workspace" };
            var check = { key: "url_name", value: workspaceParam };

            // get workspaces
            layoutService.getStructures(endpoint, objs).then(function(allWorkspaces) {

                var workspaces = allWorkspaces;

                // get single workspace
                layoutService.getStructure(workspaceParam, objs, workspaceParam + "/", check).then(function(singleWorkspace) {

                    var workspace = singleWorkspace;
                    var objs = { multi: "panels", single: "panel" };

                    // get single workspace panels
                    layoutService.getStructures(workspaceParam + "/panels/", objs).then(function(workspacePanels) {

                        var panels = workspacePanels;

                        // set scope
                        $scope.user = user;
                        $scope.workspaces = workspaces;
                        $scope.workspace = workspace;
                        $scope.panels = panels;

                        // set menu content
                        $scope.menu = {
                            user: user,
                            theme: $scope.$parent.theme,
                            workspaces: workspaces,
                            workspaceParam: workspaceParam
                        };

                    });

                });

            });

        });

    };
    
    setScope();
    
    // change workspace
    $scope.changeWorkspace = function(workspaceID, workspaceParam, panelParam, personaID) {
        
        // clear stored layout values
        layoutService.clearValues(["workspace", "panels", "panel"]);
        
        // set active workspace
        $scope.workspaceParam = workspaceParam;

        var endpoint = "persona/" + personaID + "/";
        var objs = { multi: "workspaces", single: "workspace" };
        var check = { key: "url_name", value: workspaceParam };

        // transition state
        $state.go("app.panel", {
            workspace: workspaceParam,
            panel: panelParam
        });
        
        setScope();
        
    };
    
    // log out
    $scope.logout = function() {
        
        // clear credentials
        authenticationService.clearCredentials();
        
        // clear stored layout values
        layoutService.clearValues(["workspaces", "workspace", "panels", "panel"]);
                
        // transition state
        $state.go("login");
        
    };
	
}]);