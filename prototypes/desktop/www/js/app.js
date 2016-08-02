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
        controller: "loginCtrl",
		params: {
			t: theme_config.ui.start
		}
    })
    
    // main
    .state("app", {
        url: "/{workspace}?:t",
        abstract: true,
        templateUrl: "templates/app.html",
		controller: "appCtrl",
        resolve: {
			authorized: ["$q", function($q) {
				if(localStorage.getItem("gestaltUser") === null) {
					return $q.reject("requires login");
				};
			}]
		},
		params: {
			t: theme_config.ui.start
		}
    })
    
    // panel
    .state("app.panel", {
        url: "/{panel}",
        views: {
    		"panel": {
    			templateUrl: "templates/panel.html",
    			controller: "panelCtrl"
    		},
            "slide": {
                templateUrl: "templates/slide-panel.html"/*,
                controller: "appCtrl"*/
            }
    	}
    })
	
	// visual
    .state("app.panel.visual", {
    	url: "/{grid}",
    	views: {
    		"visual": {
				templateProvider: function($http, $stateParams) {
                    return $http.get("templates/visual.html").then(function(template) {
                        return template.data;
                    });
                },
				controller: "vizCtrl"
			}
    	}
    });

    $urlRouterProvider.otherwise("/login?t=" + theme_config.ui.start);

});