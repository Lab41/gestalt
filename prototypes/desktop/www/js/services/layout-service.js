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
            if (!this[obj]) {
                
                 // make request
                console.log("****** GET " + apiUrl + " ******");
                this[obj.multi] = this.makeRequest(apiUrl);
                
            };
			
			// return stored data
			return this[obj.multi];
			
		},
		
		// single structure
		getStructure: function(param, obj) {
			
			// set service object so we can attach data to it
			var service = this;
			
            // async check
            if (service[obj.multi] !== "") {
                
                // return structure obj as a promise to service
                return this[obj.multi].then(function(data) {

                    // get single structure from stored data
                    angular.forEach(data, function(value, key) {

                        if (value.url_name == param) {

                            service[obj.single] = value;

                        };

                    });

                    // return stored data
                    return service[obj.single];

                });
                
            };
			
		},
        
        // clear values
        clearValues: function(values) {
            var service = this;
            
            // loop through values in service
            angular.forEach(values, function(value, key) {
                
                // set to empty string
                this[value] == "";
                
            });
            console.log("done clearing");console.log(service);
        },
        
        getCurrent: function(path, obj, check) {
            
            var service = this;
            
            // get all
            return service.getStructures(path, obj).then(function(data) {
                
                // check against current selected
                return angular.forEach(data, function(value, key) {

                    // check for values
                    if (value[check.key] == check.value) {

                        // store single in service
                        // create deferred object
                        var deferred = $q.defer();

                        // make $http request
                        deferred.resolve(value);

                        // expose the promise data
                        service[obj.single] = deferred.promise;
                        
                    };
                    
                    // create deferred object
                    var deferred = $q.defer();

                    // make $http request
                    deferred.resolve(value.panels);

                    // expose the promise data
                    service["panels"] = deferred.promise;

                });
                
            });
            
        }
		
	};
	
}]);