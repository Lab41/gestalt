var app = angular.module("app", [
    "ui.router",
    "angularMoment",
    "ui.bootstrap",
    "smoothScroll",
    "desktop.controllers",
    "desktop.directives",
    "desktop.services",
    "desktop.filters"
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
        templateUrl: "templates/app-global/login.html",
        controller: "loginCtrl",
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
            },
            "slide": {
                templateUrl: "templates/app-global/slide-panel.html"
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
    })

    // heuristics visual
    .state("app.heuristic", {
        url: "/{panel}/{visual}/{heuristic}",
        views: {
            "panel": {
                templateUrl: "templates/visualizations/visualization-standard.html",
                controller: "vizCtrl"
            },
            "slide": {
                templateUrl: "templates/app-global/slide-panel.html"
            }
        }
    });

    $urlRouterProvider.otherwise("/login?t=" + theme_config.ui.start);

});
