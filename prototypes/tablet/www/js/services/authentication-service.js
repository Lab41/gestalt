angular.module("authentication-service", [])

.factory("authenticationService", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

    var urlBase = api_config.authentication_service_uri;
    var loginKey = "gestaltUser";
    
    return {
		
		// data storage
		content: "",
        user: "",
		
		// single http request stored in a promise
		makeRequest: function(url) {
			
			// create deferred object
			var deferred = $q.defer();
			
			// make $http request
			$http.get(urlBase + url).then(function(response) {
				deferred.resolve(response.data);
			});
			
			// expose the promise data
			return deferred.promise;
			
		},
		
		// unique data requests
		getData: function(path) {
				
			var apiUrl = path;
            
            // check for existing stored data
            if (!this.content) {
			
                // make request
                console.log("****** GET " + apiUrl + " ******");
                this.content = this.makeRequest(apiUrl);
                
            };
			
			// return stored data
			return this.content;
			
		},
        
        // post credentials
        postCredentials: function(user, id) {
            
            var userObj = {
                user: user,
                id: id
            };

            // store in local storage
            localStorage.setItem(loginKey, JSON.stringify(userObj));
           
            // put in promise for app session
            this.user = userObj;

        },
        
        // get credentials
        getCredentials: function() {
            
            // check for existing stored data
            if (!this.user) {
            
                // retrieve login from local storage
                var userObj = JSON.parse(localStorage.getItem(loginKey));
                
                // put in promise for app session
                this.user = userObj;
                
            };
            
            return this.user;
            
        },
        
        // clear login
        clearCredentials: function() {
            
            // remove info from storage
            localStorage.removeItem(loginKey);
            
        }
		
	};

}]);
