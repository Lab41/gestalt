// dependencies
var express = require("express");
var fs = require("fs"); // file system access
var router = express.Router(); // express middleware
var pg = require("pg"); // postgres connector
var conString = process.env.DATABASE_URL ? process.env.DATABASE_URL.split(",")[0] + "://" + process.env.DATABASE_URL.split(",")[1] + ":" + process.env.DATABASE_URL.split(",")[3] + "@" + process.env.DATABASE_URL.split(",")[2] + "/" + process.env.DATABASE_URL.split(",")[0] : "";
var baseUrl = "/api/data/visualization";

/*******************************/
/************* GET *************/
/*******************************/

// cdis viz
router.get(baseUrl + "/:table", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
		
		var table = req.params.table;
                
        // SQL query
        var query = client.query("select distinct on (gcdis.origin) gcdis.origin,gc.name,'default' as cluster,1 as subgroup from gestalt_cdis gcdis left join gestalt_country gc on gc.iso_alpha2code = gcdis.origin where origin != '__' and gc.name is not null;");
        
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