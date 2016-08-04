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
            
            // check for existing stored data
            if (!this[obj.multi]) {
                
                 // make request
                //console.log("****** GET " + apiUrl + " ******");
                this[obj.multi] = this.makeRequest(apiUrl);
                
            };
			
			// return stored data
			return this[obj.multi];
			
		},
		
		// single structure
		getStructure: function(param, obj, path, check) {
			
			// set service object so we can attach data to it
			var service = this;
			
            // async check
            if (service[obj.multi] !== "") {
                
                // return structure obj as a promise to service
                return service[obj.multi].then(function(data) {

                    // get single structure from stored data
                    angular.forEach(data, function(value, key) {

                        if (value[check.key] == param) {
                            
                            // create deferred object
                            var deferred = $q.defer();

                            // create promise
                            deferred.resolve(value);

                            // expose the promise data
                            service[obj.single] = deferred.promise;

                        };

                    });

                    // return stored data
                    return service[obj.single];

                });
                
            } else {
                
                return service.getStructures(path, obj).then(function(data) {
                    
                    return service.getStructure(param, obj, path, check);
                    
                });
                
            };
			
		},
        
        // clear values
        clearValues: function(values) {
            var service = this;
            
            // loop through values in service
            angular.forEach(values, function(value, key) {
                
                // set to empty string
                delete service[value];
                service[value] = "";
                
            });
            
        }
		
	};
	
}]);