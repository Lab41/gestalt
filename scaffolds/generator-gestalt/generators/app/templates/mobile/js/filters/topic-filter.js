angular.module("topic-filter", [])

.filter("displayTopic", ["layoutService", function(layoutService) {
    return function(input, all) {
    	
    	var topics = {
			"Natural_disasters": "Natural Disasters",
			"Epidemics": "Epidemics",
			"2016_Summer_Olympics": "Olympics",
			"Syria": "Syria",
			"Nuclear_proliferation": "Nuclear",
			"Venezuela": "Venezuela",
			"Refugees": "Refugees",
			"Protests": "Protests",
			"Yemen": "Yemen",
			"Russia": "Russia",
			"Terrorism": "Terrorism",
			"Red_Sox": "Red Sox",
			"Iran": "Iran",
			"Central_Intelligence_Agency": "CIA",
			"North_Korea": "North Korea"
		};
    	
		return topics[input];
		
    }
}]);