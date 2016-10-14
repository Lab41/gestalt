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
        url: "/login?:t",
        templateUrl: "templates/app-global/login.html",
        controller: "loginCtrl",
		params: {
			t: theme_config.ui.start
		}
    })
    
    .state("menu", {
    	url: "/?:t",
    	abstract: true,
    	template: "<ion-nav-view name='menu'></ion-nav-view>",
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
    
    // main
    .state("app", {
        url: "/{workspace}?:t",
        abstract: true,
		templateUrl: "templates/app-global/app.html",
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
    			templateProvider: function($http, $stateParams) {
                    return $http.get("templates/panels/" + $stateParams.panel + ".html").then(function(template) {
                        return template.data;
                    });
                },
    			controller: "panelCtrl"
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
				controller: "vizCtrl"
			}
    	}
    });

    $urlRouterProvider.otherwise("/login?t=" + theme_config.ui.start);

});
