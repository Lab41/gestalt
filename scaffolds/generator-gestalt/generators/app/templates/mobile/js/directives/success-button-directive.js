angular.module("success-button-directive", [])

.directive("successButton", ["$location", "$timeout", "feedbackService", "$rootScope", function($location, $timeout, feedbackService, $rootScope) {
	return {
		restrict: "E",
		scope: {
			text: "=",
			success: "=",
			content: "="
		},
		template: "<button ng-click='sendPost();'><span>{{ text }}</span><span> {{ message }}</span></button>",
		link: function(scope, element, attrs) {
	
			// button click
			scope.sendPost = function() {
				
				// data to pass to task $post
				var content = scope.content;
				var collection = $location.$$path.split("/")[1];
				var user = $rootScope.globals.currentUser.username;
				var sources = content.source.toString();
				
				var embassyList = "";

    			// format embassy list for HTML
			    angular.forEach(content.nearestEmbassies, function(value, key) {
			        
			        embassyList += "<p><span style='font-style: bold;font-weight: 800;'>" + value.name + "</span> is " + value.distance + "</p>";
			        
			    });
			    
			    // set the string to scope
			    var embassies = "<div>" + embassyList + "</div>";

				// get elements to apply class to
				var button = element.find("button")[0];

            	// post the task to server
            	feedbackService.postTaskFollow(content["_id"], user, collection, content.title, sources, embassies, content.content, scope.text)
            	
            		// success
            		.then(function(response) {
            			
            			scope.message = scope.success;
				    
					    // show success state
		                angular.element(button).addClass("state-success");
		                angular.element(button).attr("disabled", "disabled");
                
				    // error
				  	}, function(response) {
				  		
				  		scope.message = "Error";
				    	
				    	// show error state
		                angular.element(button).addClass("state-error");
		                
		                $timeout(function() {
		                	
		                	// reset button
		                	angular.element(button).removeClass("state-error");
		                	
		                }, 3000);
				    
				 	});
            
        	};
			
		}
		
	};
}]);