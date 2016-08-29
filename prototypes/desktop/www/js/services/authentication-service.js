angular.module("authentication-service", [])

.factory("authenticationService", ["$http", "$q", "$timeout", function ($http, $q, $timeout) {

    var backendBaseUrl = api_config.authentication_service_uri;
    var loginKey = "gestaltUser";
    
    return {
		
		// data storage
        persona: "",
        content: "",

		// single http request stored in a promise
		makeRequest: function(backendUrl) {
			console.log("authentication-service's makeRequest");

			// create deferred object
			var deferred = $q.defer();
			
			// make $http request
			$http.get(backendBaseUrl + backendUrl).then(function(response) {
				deferred.resolve(response.data);
			});

			// expose the promise data
			return deferred.promise;
			
		},
		
		// unique data requests
		getData: function(backendUrl) {
			console.log("authentication-service's getData");

            // check for existing stored data
            if (!this.content) {
			
                // make request
                console.log("****** GET " + backendUrl + " ******");
                this.content = this.makeRequest(backendUrl);
                
            };

			// return stored data
			return this.content;
			
		},
        
        // post credentials
        postCredentials: function(personaId, personaName) {
            console.log("authentication-service's postCredentials");
            
            var persona = {
                id: personaId,
                name: personaName
            }

            // set up promise
            var localDeferred = $q.defer();
            
            $timeout(function() {
                
                // store in local storage
                localStorage.setItem(loginKey, JSON.stringify(persona));
                
                // put in promise for app session
                this.persona = persona;
                
                // resolve the promise to return immediately
                localDeferred.resolve(persona);
                
            });
            
            return localDeferred.promise;

        },
        
        // get credentials
        getCredentials: function() {
            console.log("authentication-service's getCredentials");

            // check for existing stored data
            if (!this.personaId) {
            
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
            console.log("authentication-service's clearCredentials");

            // remove info from storage
            localStorage.removeItem(loginKey);
            
        }
		
	};

}]);