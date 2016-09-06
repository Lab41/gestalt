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

// all groups
router.get(config.visualization.networkMetrics.route, function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
		
		var groupId = req.params.groupId;
        
        var configQuery = config.visualization.networkMetrics.query;
                
        // SQL query
        var query = client.query(configQuery[0] + groupId + configQuery[1]);
        
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