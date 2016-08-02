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
    $scope.leftVisible = false;
    $scope.rightVisible = false;
    
    function setScope(user, workspaces, workspace) {
        
        // set scope
        $scope.user = user;
        $scope.workspaces = workspaces;
        $scope.workspace = workspace;
        
        // set menu content
        $scope.menu = {
            user: user,
            theme: theme,
            workspaces: workspaces,
            workspaceParam: workspaceParam
        };
        
    };
    
    // detect login
    $rootScope.$on("login", function(event, args) {
        
        // get data passed from login
        var user = args.user;
        var workspaces = args.workspaces;
        var workspace = args.workspace;
        
        // set scope and global menu values
        setScope(user, workspaces, workspace);
        
    });
    
    // if not entering state from login
    // get credentials from local storage
    authenticationService.getCredentials().then(function(userData) {
        
        var user = userData;
        var endpoint = "persona/" + user.id + "/";
        var objs = { multi: "workspaces", single: "workspace" };
        var check = { key: "url_name", value: workspaceParam};

        // get workspaces
        layoutService.getCurrent(endpoint, objs, check).then(function(allWorkspaces) {
            
            var workspaces = allWorkspaces;
            
            // get single workspace
            layoutService.getStructure(workspaceParam, objs).then(function(singleWorkspace) {
                
                var workspace = singleWorkspace;
                
                // set scope
                setScope(user, workspaces, workspace);
                
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
	
}]);