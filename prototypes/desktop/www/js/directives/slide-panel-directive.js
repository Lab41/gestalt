angular.module("slide-panel-directive", [])

.directive("slidePanel", ["$state", "authenticationService", "layoutService", "$rootScope", function($state, authenticationService, layoutService, $rootScope) {
	return {
		restrict: "E",
        template: "<section ng-class='{ show: visible, left: alignment === \"left\", right: alignment === \"right\" }'><ui-view name='slide'></ui-view></section>",
		scope: {
            visible: "=",
            alignment: "@",
            content: "="
        },
        controller: function($scope) {
            
            // get PERSONA CONTENT data stored in service
            authenticationService.getData("").then(function(data) {

                $scope.personas = data;

            });
            
            // log out
            $scope.logout = function() {

                // clear credentials
                authenticationService.clearCredentials();
                
                // clear stored layout values
                layoutService.clearValues(["workspaces", "workspace", "panels", "panel"]);

                // transition state
                $state.go("login", $state.params);

            };
            
            // change workspace
            $scope.changeWorkspace = function(workspaceID, workspaceParam, panelParam, personaID, visualParam) {
                
                // clear stored layout values
                layoutService.clearValues(["workspace", "panels", "panel"]);

                // set active workspace
                $scope.$parent.workspaceParam = workspaceParam;
                
                var endpoint = "persona/" + personaID + "/";
                var objs = { multi: "workspaces", single: "workspace" };
                var check = { key: "url_name", value: workspaceParam };
                        
                // transition state
                $state.go("app.panel.visual", {
                    workspace: workspaceParam,
                    panel: panelParam,
					visual: visualParam
                },{
					inherit: false
				});

            };
            
            $rootScope.$on("themeChange", function(event, args) {
                
                var oldContent = $scope.content;
        
                // set scope
                $scope.content = {
                    user: oldContent.user,
                    theme: args.theme,
                    workspaces: oldContent.workspaces,
                    workspaceParam: oldContent.workspaceParam
                };

            });
            
        }
		
	};
    
}]);