// dependencies
var express = require("express");
var router = express.Router(); // express middleware
var pg = require("pg"); // postgres connector
var conString = process.env.DATABASE_URL || "";
var baseUrl = "/api/workspace";

// decode url spaces
function beautyDecode(str) {
    str = str.replace(/-/g, ' ');
    return str;
};

/*******************************/
/************* GET *************/
/*******************************/

// all workspaces
router.get(baseUrl, function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
                
        // SQL query
        var query = client.query("select wk.id, wk.name, m.name as panel, t.param as default_panel, array_agg(row_to_json(r)) as panels from gestalt_workspace wk, gestalt_meta m, get_panels_by_id(wk.panel) t, get_panels_by_id(wk.panel) r where m.id = wk.panel  and t.id = wk.default_panel and wk.topics && r.topics group by wk.id, wk.name, m.name, t.param;");
        
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

// single workspace
router.get(baseUrl + "/:workspace", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var workspace = beautyDecode(req.params.workspace);
        
        // SQL query
        var query = client.query("select wk.id, wk.name, m.name as panel, t.param as default_panel, array_agg(row_to_json(r)) as panels from gestalt_workspace wk, gestalt_meta m, get_panels_by_id(wk.panel) t, get_panels_by_id(wk.panel) r where m.id = wk.panel  and t.id = wk.default_panel  and wk.topics && r.topics and wk.name = '" + workspace + "' group by wk.id, wk.name, m.name, t.param;");
        
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

// panels for a single workspace
router.get(baseUrl + "/panel/:panel", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var panel = req.params.panel;
        
        // SQL query
        var query = client.query("select * from gestalt_" + panel + ";");
        
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