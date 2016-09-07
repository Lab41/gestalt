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
        // --------------------------------------------------------------------
        // for backend 
        var backendBaseUrl = api_config.authentication_uri;
        var getAllPersonasUrl = backendBaseUrl + "getAllPersonas";
        var getSinglePersonaUrl = backendBaseUrl + "getSinglePersona"

        // --------------------------------------------------------------------
        // for local storage 
        var currentPersonaId = "currentGestaltPersona";
        // ensure that view is the same when application is opened in multiple tabs
        angular.element($window).on("storage", function(event) {
            if(event.key === currentPersonaId) {
                $rootScope.$apply();
            }
        });                            

        // --------------------------------------------------------------------
        // return an authenticationFactory instance
        var authenticationFactory = {
            getListOfPersonas: getListOfPersonas,
            setPersonaId: setPersonaId,
            getPersonaId: getPersonaId,
            unsetPersonaId: unsetPersonaId
        }
        return authenticationFactory;

        // --------------------------------------------------------------------
        // function definition used in factory instance
        function callBackend(backendUrl) {
            $log.log("****** GET " + backendUrl + " ******");
            return $http.get(backendUrl)
                        .then(function(backendResponse) { return backendResponse.data; });
        }

        function getListOfPersonas() {
            return callBackend(getAllPersonasUrl);
        }

        function getPersona(personaId) {
            return callBackend(getSinglePersonaUrl + "/" + personaId);
        }

        // in our case, the credential is the personaId which will tell us who the current persona is
        function setPersonaId(personaId) {
            $window.localStorage && $window.localStorage.setItem(currentPersonaId, personaId);
        }

        function getPersonaId() {
            return $window.localStorage && $window.localStorage.getItem(currentPersonaId);
        }

        function unsetPersonaId() {
            $window.localStorage && $window.localStorage.removeItem(currentPersonaId);
        }

    }

})();

