// dependencies
var express = require("express");
var router = express.Router(); // express middleware
var pg = require("pg"); // postgres connector
var config = require("./config");
var conString = config.connectionString;

/*******************************/
/************* GET *************/
/*******************************/

// single panel
router.get(config.workspace.singlePanel.route, function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var panelID = req.params.panel;
        var panelType = req.params.type;
        
        var configQuery = config.workspace.singlePanel.query;
        
        // SQL query
        var query = client.query(configQuery[0] + panelType + configQuery[1] + panelID + configQuery[2]);
        
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
    
})

module.exports = router;