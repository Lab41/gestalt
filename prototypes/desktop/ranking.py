import web
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

urls = (
    
    # rest API backend endpoints
    "(.*)/", "ranking"
    
)

if os.environ["DATABASE_URL"] is not "":
	
	# parse stored connection string
	values = os.environ["DATABASE_URL"].split(",")
	
	connection_string = "dbname='" + values[0] + "' user='" + values[1] + "' host='" + values[2] + "' password='" + values[3] + "'"
else:
	connection_string = ""
        
class ranking:
    def GET(self, table):
        
        # connection string
        con_string = psycopg2.connect(connection_string)
        
        # postgres connector
        cursor = con_string.cursor(cursor_factory=RealDictCursor)
        
        # SQL query
        cursor.execute("""select c.name,'group0' as cluster,row_to_json(r) as clustergroups,5 as radius from gestalt_cdis_1 c,
	(select 'group' || trunc(random() * 2 + 1) as cluster from gestalt_cdis_1) r limit 200;""")
        
        # get rows
        data = cursor.fetchall()
        
        return json.dumps(data)
    
app_viz = web.application(urls, locals())


var app = angular.module('myApp', []);

app.controller('plotXY', function($scope, $http){

    $scope.data = {};

    $scope.refresh = function(){
        $http.get('http://localhost:8080/data').success(function(data){
            $scope.data = {};
            for(k in data){$scope.data[k] = data[k].map(Number);}
            $scope.data = [$scope.data];
        });
    };

    $scope.refresh();
});