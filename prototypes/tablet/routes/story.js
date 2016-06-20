// dependencies
var express = require("express");
var router = express.Router(); // express middleware
var pg = require("pg"); // postgres connector
var conString = process.env.DATABASE_URL || "";
var baseUrl = "/api/data/stories";

// decode url spaces
function beautyDecode(str) {
    str = str.replace(/-/g, ' ');
    return str;
};

/*******************************/
/************* GET *************/
/*******************************/

// all stories
router.get(baseUrl, function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
                
        // SQL query
        var query = client.query("select * from gestalt_story;");
        
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

// all stories in a panel
router.get(baseUrl + "/:panel", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var panelParam = req.params.panel;
                
        // SQL query
        var query = client.query("select s.* from gestalt_story s,gestalt_collection c where '" + panelParam + "' = c.param and s.topics && c.topics;");
        
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