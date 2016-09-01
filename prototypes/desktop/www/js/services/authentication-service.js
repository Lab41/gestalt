// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set authentication-service application and register its service
    angular
        .module("authentication-service", [])
        .factory("authenticationService", authenticationService);

    // add additional services to be used within the service
    authenticationService.$inject = ["$http", "$log", "$rootScope", "$window"];

    // define the service
    function authenticationService($http, $log, $rootScope, $window) {
        // for backend
        var backendBaseUrl = api_config.authentication_service_uri; 

        // for local storage
        var currentPersonaId = "currentGestaltPersona";
        // ensure that view is the same when application is opened in multiple tabs
        angular.element($window).on("storage", function(event) {
            if(event.key === currentPersonaId) {
                $rootScope.$apply();
            }
        });                            
        
        // return an authenticationService instance
        return {
                        
            callBackend: function(backendUrl = "") {
                var backendAbsoluteUrl = backendBaseUrl + backendUrl;
                $log.log("****** GET " + backendAbsoluteUrl + " ******");
                return $http.get(backendAbsoluteUrl)
                            .then(function(backendResponse) { return backendResponse.data; });
            },
            
            setPersonaId: function(personaId) {
                $window.localStorage && $window.localStorage.setItem(currentPersonaId, personaId);
            },

            getPersonaId: function() {
                return $window.localStorage && $window.localStorage.getItem(currentPersonaId);
            },

            unsetPersonaId: function() {
                $window.localStorage && $window.localStorage.removeItem(currentPersonaId);
            },            
            
        };

    }

})();

