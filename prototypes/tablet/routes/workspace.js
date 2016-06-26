// dependencies
var express = require("express");
var router = express.Router(); // express middleware
var pg = require("pg"); // postgres connector
var conString = process.env.DATABASE_URL ? process.env.DATABASE_URL.split(",")[0] + "://" + process.env.DATABASE_URL.split(",")[1] + ":" + process.env.DATABASE_URL.split(",")[3] + "@" + process.env.DATABASE_URL.split(",")[2] + "/" + process.env.DATABASE_URL.split(",")[0] : "";
var baseUrl = "/api/workspace";

/*******************************/
/************* GET *************/
/*******************************/

// all workspaces
router.get(baseUrl + "/persona/:persona", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var personaID = req.params.persona;
                
        // SQL query
        var query = client.query("select wk.id,wk.param,wk.name,pa.name as persona,m.name as panel,t.param as default_panel,array_agg(row_to_json(r)) as panels from gestalt_workspace wk,gestalt_persona pa,gestalt_meta m,get_panels_by_id(wk.panel) t,get_panels_by_id(wk.panel) r where m.id = wk.panel and pa.id = wk.persona and pa.id = " + personaID + " and t.id = wk.default_panel and r.id = any(wk.topics) group by wk.id,wk.param,wk.name,pa.name,m.name,t.param order by wk.name asc;");
        
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
router.get(baseUrl + "/:workspace/persona/:persona", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var workspaceParam = req.params.workspace;
        var personaID = req.params.persona;
        
        // SQL query
        var query = client.query("select wk.id,wk.param,wk.name,pa.name as persona,m.name as panel,t.param as default_panel,array_agg(row_to_json(r)) as panels from gestalt_workspace wk,gestalt_persona pa,gestalt_meta m,get_panels_by_id(wk.panel) t,get_panels_by_id(wk.panel) r where m.id = wk.panel and pa.id = wk.persona and pa.id = " + personaID + " and t.id = wk.default_panel and r.id = any(wk.topics) and wk.param = '" + workspaceParam + "' group by wk.id,wk.param,wk.name,pa.name,m.name,t.param order by wk.name asc;");
        
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
    
})

// all panels
router.get(baseUrl + "/panel", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        // SQL query
        var query = client.query("select *,'collection' as panel from gestalt_collection;");
        
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

// a single panel
router.get(baseUrl + "/panel/:type/:panel", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var panelID = req.params.panel;
        var panelType = req.params.type;
        
        // SQL query
        var query = client.query("select t.* from gestalt_" + panelType + " t where t.param = " + panelID + ";");
        
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