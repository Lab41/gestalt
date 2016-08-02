// dependencies
var express = require("express");
var router = express.Router(); // express middleware
var pg = require("pg"); // postgres connector
var config = require("./config");
var conString = config.connectionString;

/*******************************/
/************* GET *************/
/*******************************/

// all stories in a single panel for a single persona
router.get(config.story.allStoriesSinglePanelPersona.route, function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var panelParam = req.params.panel;
        var personaID = req.params.persona;
        
        var configQuery = config.story.allStoriesSinglePanelPersona.query;
                
        // SQL query
        var query = client.query(configQuery[0] + personaID + configQuery[1] + panelParam + configQuery[2]);
        
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