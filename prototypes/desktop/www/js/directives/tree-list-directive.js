angular.module("tree-list-directive", [])

.directive("treeList", ["d3Service", "$compile", function(d3Service, $compile) {
	return {
		restrict: "E",
		scope: {
			vizData: "="
		},
        link: function(scope, element, attrs) {
            
            // get d3 promise
            d3Service.d3().then(function(d3) {
                
                ///////////////////////////////////////////////
                /////////////// d3 SET-UP START ///////////////
                ///////////////////////////////////////////////
                
                // set up tree layout
                // using this only to derive depth values
                // all the way down the tree quickly/easily
                var tree = d3.layout.tree()
                    .children(function(d) { return d.children; });
                
                /////////////////////////////////////////////
                /////////////// d3 SET-UP END ///////////////
                /////////////////////////////////////////////
            
                // bind data
                scope.$watch("vizData", function(newData, oldData) {

                    // async check
                    if (newData !== undefined) {

                        function formatData(data) {
                            
                            // add data specific values to layout algorithm
                            // so it will auto-populate the depth of each branch
                            var nodes = tree.nodes(data);
                            
                            // append template here vs directive configs above so the recursive
                            // branches have defined data and this uses a single $watch vs. every single branch
                            element.append("<tree tree-data='vizData'></tree>");

                            // recompile Angular because of manual appending
                            $compile(element.contents())(scope); 

                        };

                        formatData(newData);

                    };

                });
                
            });
            
        }
	};
    
}])

// tree
.directive("tree", [function() {
	return {
		restrict: "E",
		scope: {
			treeData: "="
		},
        template: "<ul><branch ng-repeat='c in treeData.children.slice().reverse()' tree-data='c'></branch></ul>"
	};
    
}])

// branch
.directive("branch", ["$compile", function($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            branch: "=treeData"
        },
        controller: function($scope, $element) {
            
            // expand arrow
            $scope.expandBranch = function(event) {
                
                // prevent event from firing twice
                event.stopImmediatePropagation();
                
                // check if there are any children, otherwise we'll have infinite execution
                var has_children = angular.isArray($scope.branch.children);
                
                // check for children
                if (has_children) {
                    
                     // toggle css class to change state
                    $element.toggleClass("collapsed");
                    $element.toggleClass("open");
                    
                };
                
            };
            
        },
        templateUrl: "templates/directives/tree-list.html",
        link: function(scope, element, attrs) {

            var branch = scope.branch;                

            // check if there are any children, otherwise we'll have infinite execution
            var has_children = angular.isArray(branch.children);

            // check for children
            if (has_children) {

                // add branch
                element.append("<tree tree-data='branch'></tree>");

                // recompile Angular because of manual appending
                $compile(element.contents())(scope); 

                 // add class
                element.addClass("depth-" + branch.depth);

            } else {

                // add a class so we can style differently
                // items that are at the bottom of the branch
                element.addClass("item");

            };
            
        }
        
    };
    
}]);