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
			t: theme_config.ui.start
		}
    })
    
    // main
    .state("app", {
        url: "/{currentWorkspaceUrl}?:t",
        abstract: true,
        templateUrl: "templates/app.html",
		controller: "appController",
        resolve: {
			authorized: ["$state", "authenticationFactory", function($state, authenticationFactory) {
				if(authenticationFactory.getCurrentPersona() === null) {
                    $state.go("login");
				} 
			}]
		},
		params: {
			t: theme_config.ui.start
		}
    })
    
    // panel
    .state("app.panel", {
        url: "/{currentPanelUrl}",
        views: {
    		"panel": {
    			templateUrl: "templates/panel.html",
    			controller: "panelController"
    		},
            "slide": {
                templateUrl: "templates/slide-panel.html"
            }
    	}
    })
	
	// visual
    .state("app.panel.visual", {
    	url: "/{visual}?:si?:sc",
    	views: {
    		"visual": {
				templateProvider: function($http, $stateParams) {
                    return $http.get("templates/visualizations/" + $stateParams.visual + ".html").then(function(template) {
                        return template.data;
                    });
                },
				controller: "vizController"
			}
    	}
    });

    $urlRouterProvider.otherwise("/login?t=" + theme_config.ui.start);

});