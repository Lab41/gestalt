angular.module("app-controller", [])

.controller("appCtrl", ["$scope", "$rootScope", "$state", "$window", "$stateParams", "$ionicPopup", "layoutService", "authenticationService", "$ionicHistory", "$ionicViewSwitcher", function($scope, $rootScope, $state, $window, $stateParams, $ionicPopup, layoutService, authenticationService, $ionicHistory, $ionicViewSwitcher) {
    
    var workspace = $stateParams.workspace;
    
    // data objects
    $scope.panels;
    $scope.navVisible = true;
    
	// get LAYOUT data stored in service	
	layoutService.getPanels($rootScope.globals.currentUser.username).then(function(data) {
		
		// set scope
		$scope.panels = data;
		
	});
    
    // confirm logout
    $scope.confirmLogout = function() {
        
        // construct popup
        var alertPopup = $ionicPopup.alert({
            title: "Goodbye!",
            template: "You have logged out."
        });
        
        // do something afterward
       alertPopup.then(function(res) {
           
           // clear cookies and log out user
           authenticationService.clearCredentials();
           
           // take user to welcome
           $state.go("login");
           
       });
        
    };
    
    // toggle navigation
    $scope.toggleNav = function() {
    	
    	// check visibility & set
    	$scope.navVisible = !$scope.navVisible ? true : false;
    	
    };
    
    // forced back history
	$scope.goBack = function() {
		
		$ionicHistory.goBack(1);
		
	};
	
	// change the pane via navigation
	$scope.changePanel = function(name) {
		
		$scope.panelParam = name;
		
	};
	
}]);