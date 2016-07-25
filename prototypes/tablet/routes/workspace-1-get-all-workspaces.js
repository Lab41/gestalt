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
        var query = client.query("select wk.id,wk.param,wk.name,pa.name as persona,m.name as panel,t.param as default_panel,array_agg(row_to_json(r)) as panels from gestalt_workspace wk,gestalt_persona pa,gestalt_meta m,get_panels_by_id(wk.panel) t,get_panels_by_id(wk.panel) r where m.id = wk.panel and pa.id = any(wk.persona) and pa.id = " + personaID + " and t.id = wk.default_panel and r.id = any(wk.topics) group by wk.id,wk.param,wk.name,pa.name,m.name,t.param");
        
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