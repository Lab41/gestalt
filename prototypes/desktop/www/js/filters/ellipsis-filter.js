angular.module("ellipsis-filter", [])

.filter("ellipsis", [function() {
    return function(input, limit) {
    	
    	// async check
    	if (input !== undefined) {
    		
    		// check against limit
    		if (input.length > limit) {
    			
    			// add ellipsis
    			return input.substring(0, limit) + " ...";
    			
    		};
    		
    		return input;
			
		};
		
    }
}]);