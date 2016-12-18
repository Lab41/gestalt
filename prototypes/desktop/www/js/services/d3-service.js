// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set d3-service application and register its service
    angular
        .module("d3-service", [])
        .service("d3Service", d3Service);

    // add additional services to be used within the service
    d3Service.$inject = ["$document", "$q", "$rootScope", "$window"];

    // define the service
    function d3Service($document, $q, $rootScope, $window) {
    	
		var d = $q.defer();
		var d3service = {
			d3: function() {
				return d.promise;
			}
		};
		
		//create script tag for d3 source
		var scriptTag = $document[0].createElement("script");
		scriptTag.type = "text/javascript";
		scriptTag.async = true;
		scriptTag.src = "lib/d3.js";
		scriptTag.onreadystatechange = function() {
			
			//check state
			if(this.readyState == "complete") {
				
				onScriptLoad();
				
			};
			
		};
		
		scriptTag.onload = onScriptLoad;
		
		//add script tage to document
		var s = $document[0].getElementsByTagName("body")[0];
		s.appendChild(scriptTag);
		
		//return d3 object
	    return d3service;
		
		function onScriptLoad() {
			
			//load client in the browser
			$rootScope.$apply(function() {
				d.resolve($window.d3);
			});
			
		};
	
    }

})();
