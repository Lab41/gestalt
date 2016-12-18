// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set dynamic-directive-directive application and register its directive
    angular
    	.module("dynamic-directive-directive", [])
    	.directive("dynamicDirective", dynamicDirective);


    // add additional services to be used within the directive
    dynamicDirective.$inject = ["$compile", "$timeout"];

    function dynamicDirective($compile, $timeout) {
    	// return a dynamicDirective instance
    	var dynamicDirective = {
	    	//priority: 1001,
			//terminal: true,
			restrict: 'E',
			replace: true,
			scope: {
				dir: "=",
				data: "="
			},
	        link: link
    	};
    	return dynamicDirective;

        // --------------------------------------------------------------------
        // define functions
    	function link(scope, element, attrs) {
    		console.log("yo, in the link function!");
            console.log(angular.toJson(scope));
            console.log(angular.toJson(element));
            console.log(angular.toJson(attrs));

            console.log("scope.dir: " + scope.dir);

            $timeout(function() {return;}, 2000000000000000000000); 
			// add directive
            console.log("calling");
    		var customDirective = angular.element("<" + "bar-chart" + "></" + "bar-chart" + ">");
			console.log("finish call");
            // add attributes
			customDirective.attr("vizData", "data");
            console.log("calling vizData");
			// compile the custom directive
			$compile(customDirective)(scope);
			// add custom directive
			element.append(customDirective);
    	}

	}
    

})();