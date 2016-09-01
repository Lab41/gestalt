// wrap in Immediately Invoked Function Expression to avoid global scope 
(function() {
    'use strict';

    // set authentication-factory application and register its factory
    angular
        .module("authentication-factory", [])
        .factory("authenticationFactory", authenticationFactory);

    // add additional services to be used within the factory
    authenticationFactory.$inject = ["$http", "$log", "$rootScope", "$window"];

    // define the factory
    function authenticationFactory($http, $log, $rootScope, $window) {
        // for backend
        var backendBaseUrl = api_config.authentication_uri; 

        // for local storage
        var currentPersonaId = "currentGestaltPersona";
        // ensure that view is the same when application is opened in multiple tabs
        angular.element($window).on("storage", function(event) {
            if(event.key === currentPersonaId) {
                $rootScope.$apply();
            }
        });                            
        
        // return an authenticationFactory instance
        return {
                        
            callBackend: function(backendUrl = "") {
                var backendAbsoluteUrl = backendBaseUrl + backendUrl;
                $log.log("****** GET " + backendAbsoluteUrl + " ******");
                return $http.get(backendAbsoluteUrl)
                            .then(function(backendResponse) { return backendResponse.data; });
            },

            // in our case, the credential is the personaId which will tell us who the current persona is
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

