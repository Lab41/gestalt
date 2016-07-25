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
        var query = client.query("select gc.name,array_agg(row_to_json (r)) as groups from gestalt_country gc left join (select gt.name as grouptype from gestalt_group_member gm left join gestalt_group g on g.id = gm.grouping left join gestalt_group_type gt on gt.id = g.type group by gt.name) r on r.grouptype is not null where gc.name = 'Bolivia' group by gc.name;");
        
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