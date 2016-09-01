// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set content-factory application and register its factory
    angular
        .module("content-factory", [])
        .factory("contentFactory", contentFactory);

    // add additional services to be used within the factory
    contentFactory.$inject = ["$http", "$q"];

    // define the factory
    function contentFactory($http, $q) {
		
		var urlBase = api_config.content_uri;
		
		// return a contentFactory instance
		return {
			
			// data storage
			content: "",
			
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
			getData: function(name) {
					
				var apiUrl = name;
				
				// make request
				console.log("****** GET " + apiUrl + " ******");
				this.content = this.makeRequest(apiUrl);
				
				// return stored data
				return this.content;
				
			}
		
    	}	

    }

})();