angular.module("agent-service", [])

.factory("agentService", ["$http", "$q", function($http, $q) {
		
	return {
		
		// data storage
		content: "",
		
		// single request stored in a promise
		makeRequest: function() {
			
			// create deferred object
			var deferred = $q.defer();
			
			// TODO construct clean data obj for relevant user agent info
			// for now all we need is the device info
			
			// make request
			var info = navigator.userAgent.split(" ");
			var obj = {};
			obj["os"] = info[2] == "Android" ? info[2] : info[3];
			
			deferred.resolve(obj);
			
			// expose the promise data
			return deferred.promise;
			
		},
		
		// unique data requests
		getData: function() {
			
			// check for existing stored data
			if (!this.content) {
			
				// make request
				//console.log("****** GET " + navigator.userAgent + " ******");
				this.content = this.makeRequest();
				
			};
			
			// return stored data
			return this.content;
			
		}
		
	};
	
}]);