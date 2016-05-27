angular.module("login-controller", [])

.controller("loginCtrl", ["$scope", "$rootScope", "$state", "authenticationService", "contentService", "$ionicLoading", function ($scope, $rootScope, $state, authenticationService, contentService, $ionicLoading) {
    
    // message to user
    $scope.loginMessage = {
        "title": "Login",
        "body": "Forgot? Email us at "
    };
    
    $scope.loadMessage = "Authenticating."
    
    // reset login status
    authenticationService.clearCredentials();
    
    // login user
    $scope.login = function(user, pw) {
        
        // block UI show loading
	    $ionicLoading.show({
	    	template: "<ion-spinner icon='dots'></ion-spinner><p>Authenticating.</p>"
    	});
        
        // post user login
        authenticationService.postLogin(user, pw).success(function(request, httpstatus) {

	    if (request.response == false) {
	           
	        // hide loading
			$ionicLoading.hide();
            
            // message to user
            $scope.loginMessage = {
                "title": "Something doesn't match",
                "body": "Contact us to reset credentials." 
            };
            
            // clear form
            $scope.password = null;
            $scope.username = null;
            
            // go back to login
            $state.go("login");

		} else {
		   
	           // set credentials
	           authenticationService.setCredentials(user, pw);
	           
	           // add user to rootscope
	           $rootScope.globals.currentUser.username = user;
            
        	   // hide loading
        	   $ionicLoading.hide();
        	   
        	   // get LAYOUT data stored in service
        	   contentService.getMessages($rootScope.globals.currentUser.username, "changelog").then(function(data) {
        	   	
        	   		// check for any messages
        	   		if (data.length > 0) {
	        	   			
	    	   			// go to changelog
	           			$state.go("menu.changelog");
	        	   		
	    	   		} else {
	    	   			
	    	   			// go to default
    	   				
	    	   		};
		           
	           });
	         
		}
        }).error(function(response) {
        	
        	// capture error message
            $scope.error = response.message;
            
            // hide loading
			$ionicLoading.hide();
		
        });  
    };

}]);
