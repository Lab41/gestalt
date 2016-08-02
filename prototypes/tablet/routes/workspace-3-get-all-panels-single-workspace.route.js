// dependencies
var express = require("express");
var router = express.Router(); // express middleware
var pg = require("pg"); // postgres connector
var config = require("./config");
var conString = config.connectionString;

/*******************************/
/************* GET *************/
/*******************************/

// all panels for a single workspace
router.get(config.workspace.panelsSingleWorkspace.route, function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var panelType = req.params.panel;
        var workspaceID = req.params.workspace;
        
        var configQuery = config.workspace.panelsSingleWorkspace;
        
        // SQL query
        var query = client.query(configQuery[0] + panelType + configQuery[1] + panelType + configQuery[2] + workspaceID + configQuery[3] + workspaceID + configQuery[4]);
        
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