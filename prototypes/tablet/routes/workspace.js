// dependencies
var express = require("express");
var router = express.Router(); // express middleware
var pg = require("pg"); // postgres connector
var conString = process.env.DATABASE_URL || "";
var baseUrl = "/api";

/*******************************/
/************* GET *************/
/*******************************/

// ALL WORKSPACES
router.get(baseUrl + "/workspace/workspaces", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var persona = req.params.persona;
        
        // SQL query
        var query = client.query("select wk.id, wk.name, p.url as default_panel from workspace wk left join panel p on p.id = panels[1];");
        
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

// SINGLE WORKSPACE
router.get(baseUrl + "/workspace/:persona", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var persona = req.params.persona;
        
        // SQL query
        var query = client.query("select p.*, idx(panels, p.id) as idx from workspace wk join panel p on p.id = any(wk.panels) where wk.name = '" + persona + "' order by idx(panels, p.id);");
        
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
