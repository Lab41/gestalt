angular.module("login-controller", [])

.controller("loginCtrl", ["$scope", "$rootScope", "$state", "authenticationService", "contentService", function ($scope, $rootScope, $state, authenticationService, contentService) {
    
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
        
        // post user login
        authenticationService.postLogin(user, pw).success(function(request, httpstatus) {

	    if (request.response == false) {
            
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
			
			// go to default
	         
		}
        }).error(function(response) {
        	
        	// capture error message
            $scope.error = response.message;
		
        });  
    };

}]);