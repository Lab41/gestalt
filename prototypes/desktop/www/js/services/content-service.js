angular.module("content-service", [])

.factory("contentService", ["$http", "$q", function($http, $q) {
	
	var backendBaseUrl = api_config.content_service_uri;
	
	return {
		
		// data storage
		content: "",
		
		// single http request stored in a promise
		makeRequest: function(backendUrl) {
			
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
							
			// make request
			console.log("****** GET " + backendUrl + " ******");
			this.content = this.makeRequest(backendUrl);
			
			// return stored data
			return this.content;
			
		}
		
	};
	
}]);