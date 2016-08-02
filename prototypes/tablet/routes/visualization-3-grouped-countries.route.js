// dependencies
var express = require("express");
var fs = require("fs"); // file system access
var router = express.Router(); // express middleware
var pg = require("pg"); // postgres connector
var config = require("./config");
var conString = config.connectionString;

/*******************************/
/************* GET *************/
/*******************************/

// all geojson with specific tile shape
router.get(config.visualization.groupedCountries.route, function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
		
		var table = req.params.table;
        
        var configQuery = config.visualization.groupedCountries.query;
                
        // SQL query
        var query = client.query(configQuery[0]);
        
        // stream results back one row at a time
        query.on("row", function(row) {
            results.push(row);
        });
        
        // close connection and return results
        query.on("end", function() {
            client.end();
            return res.json(results);
        });
        
        // handle errors
        if(err) {
            console.log(err);
        };
        
    });
    
});

module.exports = router;