angular.module("layout-service", [])

.factory("layoutService", ["$http", "$q", function($http, $q) {
	
	var backendBaseUrl = api_config.layout_service;
	
	return {
		
		// data storage
		workspaces: "",
		workspace: "",
        panels: "",
        panel: "",
		
		// single http request stored in a promise
		makeRequest: function(backendUrl) {
			console.log("layout-service's makeRequest");

			// create deferred object
			var deferred = $q.defer();
			
			// make $http request
			$http.get(backendBaseUrl + backendUrl).then(function(response) {
				deferred.resolve(response.data);
			});
			
			// expose the promise data
			return deferred.promise;
			
		},
		
		// all structures
		getStructures: function(backendUrl, obj) {
            console.log("layout-service's getStructures");
            console.log("backendUrl: " + backendUrl);
            for (var i in obj) {
                console.log("obj " + i + ": " + obj[i]);
            }
            // check for existing stored data
            if (!this[obj.multi]) {
                
                 // make request
                //console.log("****** GET " + apiUrl + " ******");
                this[obj.multi] = this.makeRequest(backendUrl);
                
            };

			// return stored data
			return this[obj.multi];
			
		},
		
		// single structure
		getStructure: function(param, obj, backendUrl, check) {
			// true, objs, endpoint, check
            /* 
            var endpoint = "persona/" + persona.id + "/";
            var objs = { multi: "workspaces", single: "workspace" };
            var check = { key: "is_default", value: true };
            */
            console.log("layout-service's getStructure");

			// set service object so we can attach data to it
			var service = this;
			
            // async check
            if (service[obj.multi] !== "") {
                console.log("multi is not empty: " + service[obj.multi]);

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
                
                console.log("calling getStructures")
                return service.getStructures(backendUrl, obj).then(function(data) {
                    
                    return service.getStructure(param, obj, backendUrl, check);
                    
                });
                
            };
			
		},
        
        // clear values
        clearValues: function(values) {
            console.log("layout-service's clearValues");

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