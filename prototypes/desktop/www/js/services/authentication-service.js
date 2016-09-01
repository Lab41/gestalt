angular.module("authentication-service", [])

.factory("authenticationService", ["$http", "$q", "$timeout", function ($http, $q, $timeout) {

    var urlBase = api_config.authentication_service_uri;
    var loginKey = "gestaltUser";
    
    return {
		
		// data storage
		content: "",
        user: "",
		
		// single http request stored in a promise
		makeRequest: function(url) {
			
            console.log("url: " + url);

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
		getData: function(backend_url) {
			
            // check for existing stored data
            if (!this.content) {
			
                // make request
                console.log("****** GET " + backend_url + " ******");
                this.content = this.makeRequest(backend_url);
                
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
            
            // set up promise
            var localDeferred = $q.defer();
            
            $timeout(function() {
                
                // store in local storage
                localStorage.setItem(loginKey, JSON.stringify(userObj));
                
                // put in promise for app session
                this.user = userObj;
                
                // resolve the promise to return immediately
                localDeferred.resolve(userObj);
                
            });
            
            return localDeferred.promise;

        },
        
        // get credentials
        getCredentials: function() {
            
            // check for existing stored data
            if (!this.user) {
            
                // set up promise
                var localDeferred = $q.defer();
            
                $timeout(function() {

                    // retrieve from local storage
                    var data = JSON.parse(localStorage.getItem(loginKey));

                    // resolve the promise
                    localDeferred.resolve(data);

                });

                return localDeferred.promise;
                
            };
                        
        },
        
        // clear login
        clearCredentials: function() {
            
            // remove info from storage
            localStorage.removeItem(loginKey);
            
        }
		
	};

}]);