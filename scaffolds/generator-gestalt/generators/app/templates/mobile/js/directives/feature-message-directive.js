angular.module("feature-message-directive", [])

.directive("featureMessage", ["contentService", "feedbackService", "$rootScope", "$state", "$timeout", function(contentService, feedbackService, $rootScope, $state, $timeout) {
	return {
		restrict: "E",
		link: function(scope, element, attrs) {
			
			scope.$on("contentReady", function(event, args) {
				
				// get LAYOUT data stored in service	
				contentService.getMessages($rootScope.globals.currentUser.username, $state.params.panel).then(function(data) {
					
					// check for messages
					if (data.length > 0) {
						
						// slight delay so it's smoother
						$timeout(function() {
							
							var div = angular.element("<div class='close'></div>");
						
							element.append(div);
							
							// animate message
							$timeout(function() {
	
								div.removeClass("close");							
								div.addClass("show");
								
								$timeout(function() {
									
									// animate message box
									var messageBox = angular.element("<div><i class='ion-ios-information-outline'></i><p>" + data[0].message + "</p></div><i class='ion-close-round'></i>");
									
									div.append(messageBox);
									
									$timeout(function() {
										
										// delay showing close button
										var close = angular.element(div.find("i")[1]);
										
										close.addClass("show");
										
										// close message
										close.on("click", function(event) {
											
											div.removeClass("show");
											div.addClass("close");
											
											// post seen status
											feedbackService.postSeen(data[0].message_id, $rootScope.globals.currentUser.username);
											
										});
									
									}, 3000);
									
								}, 500);
								
							}, 1000);
					
						}, 500);
						
					};
				
				});
				
			});
			
		}
		
	};
}]);