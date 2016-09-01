// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set plotly-factory application and register its factory
    angular
        .module("plotly-factory", [])
        .factory("plotlyFactory", plotlyFactory);

    // add additional services to be used within the factory
    plotlyFactory.$inject = ["$document", "$q", "$rootScope", "$window"];

    // define the factory
    function plotlyFactory($document, $q, $rootScope, $window) {
		
		var d = $q.defer();
		var plotlyFactory = {
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
	    return plotlyFactory;
		
		function onScriptLoad() {
			
			//load client in the browser
			$rootScope.$apply(function() {
				d.resolve($window.Plotly);
			});
			
		};
	
    }

})();