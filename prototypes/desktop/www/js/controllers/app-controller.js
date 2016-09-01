// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set app-controller application and register its controller
    angular
        .module("app-controller", [])
        .controller("appController", appController);

    // add additional services to be used within the controller
    appController.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "authenticationService", "layoutService"];

    // define the controller
    function appController($rootScope, $scope, $state, $stateParams, authenticationService, layoutService) {
    
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
        $scope.leftVisible = false;
        $scope.rightVisible = false;
        
        function setScope(personaId, workspaces, workspace, panels) {
            
            // set scope
            $scope.personaId = personaId;
            $scope.workspaces = workspaces;
            $scope.workspace = workspace;
            $scope.panels = panels;
            
            // set menu content
            $scope.menu = {
                personaId: personaId,
                theme: $scope.$parent.theme,
                workspaces: workspaces,
                workspaceParam: workspaceParam
            };
            
        };
        
        // get credentials from local storage
        var personaId = authenticationService.getPersonaId();
            
        var endpoint = "persona/" + personaId + "/";
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
                    setScope(personaId, workspaces, workspace, panels);
                    
                });
                
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
    
    }

})();