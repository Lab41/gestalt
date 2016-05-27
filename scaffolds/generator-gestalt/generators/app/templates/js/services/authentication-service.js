angular.module("authentication-service", [])

.factory("authenticationService", ["$http", "$cookies", "$rootScope", "base64", function ($http, $cookies, $rootScope, base64) {

    var urlBase = api_config.authentication_service_uri;
    var authenticationService = {};

    // post user credentials
    authenticationService.postLogin = function(user, pw) {

        // set up valid object
        var user = {
            "username": user,
            "password": pw
        };

        // post it real good
        return $http.post(urlBase + "authenticate/", user);

    };

    // put info in cookies
    authenticationService.setCredentials = function(user, pw) {

        // encode the data
        var authdata = base64.encode(user + ':' + pw);

        // set globals
        $rootScope.globals = {
            currentUser: {
                username: user,
                authdata: authdata
            }
        };

        // set header
        $http.defaults.headers.common['Authorization'] = 'Basic' + authdata;
        	$cookies.put("user", user);

    };

    // clear info from cookies
    authenticationService.clearCredentials = function() {

        $rootScope.globals = {};
        $cookies.remove("user"); // remove user cookie
        $http.defaults.headers.common.Authorization = 'Basic';

    };

    return authenticationService;

}]);
