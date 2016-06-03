var app = angular.module("app", [
    "ui.router",
	"ngCookies",
	"angularMoment",
    "desktop.controllers",
    "desktop.directives",
    "desktop.services"
]);

/***********************/
/********* RUN *********/
/***********************/

app.run(function(amMoment, $rootScope) {
	
	/****************/
	/**** VALUES ****/
	/****************/
	
	// if cookie exists, set scope
	//if (cookieUser !== undefined) {
	
		// set globals
        $rootScope.globals = {
            currentUser: {
                username: "undefined"
            }
        };
        
    //};
    
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

app.config(function($stateProvider, $urlRouterProvider) {

	/****************/
	/**** ROUTES ****/
	/****************/

	$stateProvider
	
	// login
    .state("login", {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "loginCtrl"
    })
    
    // main
    .state("app", {
        url: "/{workspace}",
        abstract: true,
        templateUrl: "templates/app.html",
		controller: "appCtrl"/*,
    	resolve: {
			authorized: ["$q", "$cookies", function($q, $cookies) {
				if($cookies.get("user") === undefined) {
					return $q.reject("requires login");
				};
			}]
		}*/
    })
    
    // panel
    .state("app.panel", {
        url: "/{panel}",
        views: {
    		"panel": {
    			templateUrl: "templates/panel.html",
    			controller: "panelCtrl"
    		}
    	}
    })
	
	// story
    .state("app.story", {
    	url: "/detail/{id}",
    	views: {
    		"panel": {
    			templateUrl: "templates/story.html",
    			controller: "storyCtrl"
    		}
    	}
    });

    $urlRouterProvider.otherwise("/stories/navitem1");

});