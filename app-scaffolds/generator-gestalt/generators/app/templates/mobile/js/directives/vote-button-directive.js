angular.module("vote-button-directive", [])

.directive("voteButton", ["$location", "$timeout", "feedbackService", "$rootScope", function($location, $timeout, feedbackService, $rootScope) {
	return {
		restrict: "E",
		scope: {
			text: "=",
			success: "=",
			content: "="
		},
		template: "<button ng-click='sendVote();'><span>{{ text }}</span><span> {{ message }}</span></button>",
		link: function(scope, element, attrs) {
	
			// button click
			scope.sendVote = function() {
				
				// data to pass to task $post
				var content = scope.content;
				var user = $rootScope.globals.currentUser.username;
				var type = scope.text == "more like this" ? "like" : "dislike";
				
				// get elements to apply class to
				var button = element.find("button")[0];

            	// post the task to server
            	feedbackService.postVote(content["_id"], user, type)
            	
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