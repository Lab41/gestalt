angular.module("highlight-service", [])

    .factory("highlightService", [ function () {

        var highlightMode = false,
            highlightService = {};

        // HIGHLIGHT
        highlightService.getHighlightMode = function () {

            return highlightMode;

        };

        highlightService.setHighlightMode = function (val) {

            highlightMode = val;

        };

        highlightService.toggleHighlightMode = function () {

            if (highlightMode === true) {
                highlightMode = false;
            } else {
                highlightMode = true;
            }

        };

        return highlightService;

    }]);
