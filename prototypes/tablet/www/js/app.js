var app = angular.module("app", [
	"ionic",
	"angularMoment",
	"tablet.controllers",
    "tablet.directives",
    "tablet.services"
]);

/***********************/
/********* RUN *********/
/***********************/

app.run(function($http, $rootScope, $location, $ionicPlatform, amMoment, $state) {
    
    $rootScope.$on("$stateChangeError", function(e, toState, toParams, fromState, fromParams, error) {
    	
    	if (error === "requires login") {
	        
	        // prevent any other state to load
	        e.preventDefault();
	                   
	        // navigate to login
	        $state.go("login");
	        
	    };
        
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
    
    /****************/
	/**** IONIC ****/
	/****************/

	//ionic
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

/**************************/
/********* CONFIG *********/
/**************************/

app.config(function($stateProvider, $httpProvider,  $urlRouterProvider, $ionicConfigProvider, $compileProvider) {
    
    // config to ensure platform specific styles are uniform across devices
    $ionicConfigProvider.navBar.alignTitle('center');

	$httpProvider.defaults.withCredentials = true;
    
    $compileProvider.debugInfoEnabled(false);
	
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
    
    .state("menu", {
    	url: "/",
    	abstract: true,
    	template: "<ion-nav-view name='menu'></ion-nav-view>",
    	resolve: {
			authorized: ["$q", function($q) {
				if(localStorage.getItem("gestaltUser") === null) {
					return $q.reject("requires login");
				};
			}]
		}
    })
    
    // main
    .state("app", {
        url: "/{workspace}",
        abstract: true,
		templateUrl: "templates/app.html",
		controller: "appCtrl",
        resolve: {
			authorized: ["$q", function($q) {
				if(localStorage.getItem("gestaltUser") === null) {
					return $q.reject("requires login");
				};
			}]
		}
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
    
    // ideas
    .state("app.ideas", {
        url: "/ideas/:table",
        views: {
            "panel": {
                templateUrl: "templates/ideas.html",
                controller: "ideaCtrl"
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

    $urlRouterProvider.otherwise("/login");

});
