// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set layout-service application and register its service
    angular
        .module("layout-service", [])
        .factory("layoutService", layoutService);

    // add additional services to be used within the service
    layoutService.$inject = ["$http", "$log", "$q"];

    // define the service
    function layoutService($http, $log, $q) {
        // for backend
        var backendBaseUrl = api_config.layout_service_uri; 
        
        // return a layoutService instance
        return {
            
            // data storage
            workspaces: "",
            workspace: "",
            panels: "",
            panel: "",
            
            callBackend: function(backendUrl = "") {
                var backendAbsoluteUrl = backendBaseUrl + backendUrl;
                $log.log("****** GET " + backendAbsoluteUrl + " ******");
                return $http.get(backendAbsoluteUrl)
                            .then(function(backendResponse) { return backendResponse.data; });
            },
            
            // all structures
            getStructures: function(path, obj) {
                
                // construct api call from supplied params
                var apiUrl = path;
                
                // check for existing stored data
                if (!this[obj.multi]) {
                    
                     // make request
                    //console.log("****** GET " + apiUrl + " ******");
                    this[obj.multi] = this.callBackend(apiUrl);
                    
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
        
    }

})();
