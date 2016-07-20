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
        var query = client.query("select distinct on (gcdis.origin) gcdis.origin,gc.name,gc.groups,'group0' as cluster,row_to_json(r) as clustergroups from gestalt_cdis gcdis left join gestalt_country gc on gc.iso_alpha2code = gcdis.origin left join (select gt.name as cluster,gt.id from gestalt_group_type gt) r on r.id = any(gc.groups);");
        
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

// geojson
router.get(baseUrl + "/geojson/:grid", function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
		
		var grid = req.params.grid;
                
        // SQL query
        var query = client.query("select 'FeatureCollection' as type,array_agg(row_to_json(r)) as features from (with t as (select 'Feature'::text) select t.text as type,row_to_json(f) as properties,row_to_json(c) as geometry from t,gestalt_country gc left join (select id,name,iso_alpha2code as iso,hex_grid_id from gestalt_country) f on f.id = gc.id left join (with t as (select 'Polygon'::text) select t.text as type,gcc." + grid + "_polygon as coordinates from t,gestalt_country gcc) c on c.coordinates = gc." + grid + "_polygon where gc." + grid + "_polygon is not null and gc.grid_id is not null) r group by type;");
        
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

router.get(baseUrl + "/geojson/test/test", function(req, res) {

    // read file
    fs.readFile("./routes/hexagons.json", "utf8", function(err, data) {
        
        // check for error
        if (err) {
            
            return console.log(err);
            
        };
        
        res.send(data);
                
    });
    
})

module.exports = router;