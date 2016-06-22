angular.module("layout-service", [])

.factory("layoutService", ["$http", "$q", function($http, $q) {
	
	var urlBase = api_config.layout_service;
	
	return {
		
		// data storage
		workspaces: "",
		workspace: "",
        panels: "",
        panel: "",
		
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
		
		// all structures
		getStructures: function(path, obj) {
			
			// construct api call from supplied params
			var apiUrl = path;
				
            // make request
            console.log("****** GET " + apiUrl + " ******");
            this[obj] = this.makeRequest(apiUrl);
			
			// return stored data
			return this[obj];
			
		},
		
		// single structure
		getStructure: function(param, obj, objs) {
			
			// set service object so we can attach data to it
			var service = this;
			
			// return structure obj as a promise to service
			return this[objs].then(function(data) {
				
				// get single structure from stored data
				angular.forEach(data, function(value, key) {
					
					if (value.param == param) {
						
						service[obj] = value;
						
					};
					
				});
				
				// return stored data
				return service[obj];
			
			});
			
		}
		
	};
	
}]);