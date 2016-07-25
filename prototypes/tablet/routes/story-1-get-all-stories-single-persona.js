// dependencies
var express = require("express");
var router = express.Router(); // express middleware
var pg = require("pg"); // postgres connector
var conString = process.env.DATABASE_URL ? process.env.DATABASE_URL.split(",")[0] + "://" + process.env.DATABASE_URL.split(",")[1] + ":" + process.env.DATABASE_URL.split(",")[3] + "@" + process.env.DATABASE_URL.split(",")[2] + "/" + process.env.DATABASE_URL.split(",")[0] : "";
var baseUrl = "/api/data/stories";

/*******************************/
/************* GET *************/
/*******************************/

// all stories for a specific persona
router.get(baseUrl + "/:persona", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var personaID = req.params.persona;
                
        // SQL query
        var query = client.query("select distinct on (s.id) s.id,s.name,s.param,v.name as directive from gestalt_workspace wk,gestalt_collection c,gestalt_story s left join gestalt_visual v on v.id = s.visual where c.topics && s.topics and c.id = any(wk.topics) and " + personaID + " = any(wk.persona);");
        
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