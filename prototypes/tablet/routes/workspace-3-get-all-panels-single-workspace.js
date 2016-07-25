// dependencies
var express = require("express");
var router = express.Router(); // express middleware
var pg = require("pg"); // postgres connector
var conString = process.env.DATABASE_URL ? process.env.DATABASE_URL.split(",")[0] + "://" + process.env.DATABASE_URL.split(",")[1] + ":" + process.env.DATABASE_URL.split(",")[3] + "@" + process.env.DATABASE_URL.split(",")[2] + "/" + process.env.DATABASE_URL.split(",")[0] : "";
var baseUrl = "/api/workspace";

/*******************************/
/************* GET *************/
/*******************************/

// panels for a single workspace
router.get(baseUrl + "/:workspace/panel/:panel", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var panelType = req.params.panel;
        var workspaceID = req.params.workspace;
        
        // SQL query
        var query = client.query("select t.*,'" + panelType + "' as panel from gestalt_" + panelType + " t left join gestalt_workspace wk on wk.id = " + workspaceID + " where t.id = any(wk.topics) and wk.id = " + workspaceID + ";");
        
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