// dependencies
var express = require("express");
var router = express.Router(); // express middleware
var pg = require("pg"); // postgres connector
var config = require("./config");
var conString = config.connectionString;

/*******************************/
/************* GET *************/
/*******************************/

// all story idea metrics for a single story in a single panel for a single persona
router.get(config.story.storyIdeaMetricsSinglePanelPersona.route, function(req, res) {

    var results = [];
    
    // get a postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {
        
        var ideaID = req.params.idea;
        var controlID = req.params.control;
        
        var configQuery = config.story.storyIdeaMetricsSinglePanelPersona.query;
                
        // SQL query
        var query = client.query(configQuery[0] + ideaID + configQuery[1] + controlID + configQuery[2]);
        
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