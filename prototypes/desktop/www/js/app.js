var app = angular.module("app", [
    "ui.router",
	"angularMoment",
    "desktop.controllers",
    "desktop.directives",
    "desktop.services"
]);

/***********************/
/********* RUN *********/
/***********************/

app.run(function(amMoment, $rootScope) {
    
    /***********************/
	/**** DESKTOP PANEL ****/
	/***********************/
    
    // stop propagation of event to trigger menu
    // so menu doesn't auto hide after it's shown
    document.addEventListener("keyup", function(e) {

        if(e.keyCode === 27) {

            $rootScope.$broadcast("escapedPressed", e.target);

        };

    });

    document.addEventListener("click", function(e) {

        $rootScope.$broadcast("documentClicked", e.target);

    });
    
    /****************/
	/**** MOMENT ****/
	/****************/

	//calendar time format
	amMoment.changeLocale('en', {
		calendar : {
			lastDay : '[Yesterday]',
			sameDay : '[Today]',
			nextDay : '[Tomorrow]',
			lastWeek : '[Last] dddd',
			nextWeek : '[Next] dddd',
			sameElse : 'D MMMM YYYY'
		}
	});
    
});

/**************************/
/********* CONFIG *********/
/**************************/

app.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
    
    $compileProvider.debugInfoEnabled(false);

	/****************/
	/**** ROUTES ****/
	/****************/

	$stateProvider
	
	// login
    .state("login", {
        url: "/login?:t",
        templateUrl: "templates/login.html",
        controller: "loginController",
		params: {
			t: themeConfig.ui.start
		}
    })
    
    // main
    .state("app", {
        url: "/{currentWorkspaceUrl}?:t",
        abstract: true,
        templateUrl: "templates/app.html",
		controller: "appController",
        resolve: {
			authorized: ["$state", "authenticationService", function($state, authenticationService) {
				if(authenticationService.getCurrentPersona() === null) {
                    $state.go("login");
				} 
			}]
		},
		params: {
			t: themeConfig.ui.start
		}
    })
    
    // panel
    .state("app.panel", {
        url: "/{currentPanelUrl}",
        views: {
    		"panel": {
    			templateProvider: function($http, $stateParams) {
                    // url_name is linked to the template being used
                    return $http.get("templates/panels/" + $stateParams.currentPanelUrl + ".html").then(function(template) {
                        return template.data;
                    });
                },
    			controller: "panelController"
    		},
            "slide": {
                templateUrl: "templates/slide-panel.html"
            }
    	}
    })

    // story
    .state("app.panel.story", {
        url:"/{currentStoryUrl}",
        views: {
            "story": {
                templateProvider: function($http, $stateParams) {
                    // url_name is linked to the template being used
                    return $http.get("templates/stories/" + $stateParams.currentStoryUrl + ".html").then(function(template) {
                        return template.data;
                    });                   
                },
                controller: "storyController"
            }
        }
    })
	
	// visual
    .state("app.panel.story.visual", {
    	url: "/{currentVisualUrl}?:si?:sc",
    	views: {
    		"visual": {
				templateProvider: function($http, $stateParams) {
                    // url_name is linked to the template being used
                    return $http.get("templates/visualizations/" + $stateParams.currentVisualUrl + ".html").then(function(template) {
                        return template.data;
                    });
                },
				controller: "visController"
			}
    	}
    })

    // heuristics visual
    .state("app.heuristics", {
        url:"/{currentPanelUrl}/{currentVisualUrl}/{currentHeuristicUrl}",
        views: {
            "panel" : {
                templateUrl: "templates/visualizations/visualization-standard.html",
                controller: "visController"
            },
            "slide":  {
                templateUrl: "templates/slide-panel.html"
            }
        }
    })

    $urlRouterProvider.otherwise("/login?t=" + themeConfig.ui.start);

});