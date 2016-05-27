angular.module("follow-button-directive", [])

.directive("followButton", ["detailService", "$rootScope", function(detailService, $rootScope) {
	return {
		restrict: "E",
		scope: {
			content: "="
		},
		template: "<button ng-click='sendPost();' class='unfollowed'><span>{{ text }}</span></button>",
		link: function(scope, element, attrs) {
			
			var content = scope.content;
			var followed = content.followed;
			
			// get elements to apply class to
			var button = angular.element(element.find("button")[0]);
			var isFollowed = followed == "true" ? true : false;
			
			// check follow isFollowed
			isFollowed ? scope.text = "unfollow" : scope.text = "follow";
	
			// button click
			scope.sendPost = function() {
				
				var isFollowed = scope.content.followed == "true" ? true : false;
				
				// check follow isFollowed
				isFollowed ? scope.text = "unfollow" : scope.text = "follow";
				
				// data to pass to task $post
				var user = $rootScope.globals.currentUser.username;
                        
            	// post the task to server
            	detailService.postFollow(content["_id"], user, "story")
            	
            		// success
            		.then(function(response) {
            			
            			if (!isFollowed) {
            				
            				// change state 
            				button.removeClass("unfollowed");
		                	button.addClass("followed");
		                	scope.text = "unfollow";
		                
            			} else {
            				
            				// change state
            				button.removeClass("followed");
            				button.addClass("unfollowed");
            				scope.text = "follow";
            				
            			};
                
				    // error
				  	}, function(response) {
				  		
				  		// TODO figure out something to do for an error to notify the user
				  		console.log("error :(");
				    
				 	});
            
        	};
			
		}
		
	};
}]);