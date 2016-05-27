angular.module("layout-service", [])

.factory("layoutService", ["$http", "$q", function($http, $q) {
	
	var urlBase = api_config.layout_service;
	
	return {
		
		// data storage
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
		
		// all panels
		getPanels: function(path) {
			
			// construct api call from supplied params
			var apiUrl = path;
			
			// check for existing stored data
			if (!this.panels) {
				
				// make request
				console.log("****** GET " + apiUrl + " ******");
				this.panels = this.makeRequest(apiUrl);

			};
			
			// return stored data
			return this.panels;
			
		},
		
		// single panel
		getPanel: function(name) {
			
			// set service object so we can attach data to it
			var service = this;
			
			// return panel obj as a promise to service
			return this.panels.then(function(data) {
				
				// get single panel from stored data
				angular.forEach(data, function(value, key) {
					
					if (value.url.single == name) {
						
						service.panel = value;
						
					};
					
				});
				
				// return stored data
				return service.panel;
			
			});
			
		}
		
	};
	
}]);