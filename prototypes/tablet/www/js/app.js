var app = angular.module("app", [
	"ionic",
    "ngCookies",
	"angularMoment",
	"tablet.controllers",
    "tablet.directives",
    "tablet.services"
]);

/***********************/
/********* RUN *********/
/***********************/

app.run(function($http, $rootScope, $location, $cookies, $ionicPlatform, amMoment, $state, $timeout) {
    
    /****************/
	/**** VALUES ****/
	/****************/
	
	// if cookie exists, set scope
	//if (cookieUser !== undefined) {
	
		// set globals
        $rootScope.globals = {
            currentUser: {
                username: "general"
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

app.config(function($stateProvider, $httpProvider,  $urlRouterProvider, $ionicConfigProvider) {
    
    // config to ensure platform specific styles are uniform across devices
    $ionicConfigProvider.navBar.alignTitle('center');

	$httpProvider.defaults.withCredentials = true;
	
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
    	template: "<ion-nav-view name='menu'></ion-nav-view>"/*,
    	resolve: {
			authorized: ["$q", "$cookies", function($q, $cookies) {
				if($cookies.get("user") === undefined) {
					return $q.reject("requires login");
				};
			}]
		}*/
    })
    
    // main
    .state("app", {
        url: "/{workspace}",
        abstract: true,
		templateUrl: "templates/app.html",
		controller: "appCtrl",
        params: {
            workspace: "stories"
        }/*,
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

    $urlRouterProvider.otherwise("/stories/1");

});
