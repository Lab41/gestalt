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
router.get(baseUrl + "/countries/groups/", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
		
		var table = req.params.table;
                
        // SQL query
        var query = client.query("select gt.*,array_agg(row_to_json(r)) as subgroups from gestalt_group_type gt left join (select g.*,array_agg(row_to_json(c)) as nodes from gestalt_group g left join (select gc.iso_alpha2code as id,gm.grouping as subgroup from gestalt_group_member gm left join gestalt_country gc on gc.id = gm.country_id where gc.iso_alpha2code is not null) c on c.subgroup = g.id group by g.id) r on r.type = gt.id group by gt.id;");
        
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