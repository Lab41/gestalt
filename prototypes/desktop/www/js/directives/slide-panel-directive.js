angular.module("slide-panel-directive", [])

.directive("slidePanel", [function() {
	return {
		restrict: "E",
        template: "<section ng-class='{ show: visible, left: alignment === \"left\", right: alignment === \"right\" }'><ui-view name='slide'></ui-view></section>",
		scope: {
            visible: "=",
            alignment: "@",
            content: "="
        }
		
	};
    
}]);