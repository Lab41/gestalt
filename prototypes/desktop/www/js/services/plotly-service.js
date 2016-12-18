// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set plotly-service application and register its service
    angular
        .module("plotly-service", [])
        .service("plotlyService", plotlyService);

    // add additional services to be used within the service
    plotlyService.$inject = ["$document", "$q", "$rootScope", "$window"];

    // define the service
    function plotlyService($document, $q, $rootScope, $window) {
		
		var d = $q.defer();
		var plotlyService = {
			Plotly: function() {
				return d.promise;
			}
		};
		
		//create script tag for plotly source
		var scriptTag = $document[0].createElement("script");
		scriptTag.type = "text/javascript";
		scriptTag.async = true;
		scriptTag.src = "https://cdn.plot.ly/plotly-latest.min.js";
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
		
		//return plotly object
	    return plotlyService;
		
		function onScriptLoad() {
			
			//load client in the browser
			$rootScope.$apply(function() {
				d.resolve($window.Plotly);
			});
			
		};
	
    }

})();