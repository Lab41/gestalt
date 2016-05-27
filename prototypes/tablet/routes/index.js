// settings
var express = require("express");
var fs = require("fs");
var router = express.Router();

// data
router.get("/api/:type/:name", function(req, res) {
    
    var name = req.params.name;
	var type = req.params.type;
    
    // read file
    fs.readFile("./routes/" + type + "/" + name + ".json", "utf8", function(err, data) {
        
        // check for error
        if (err) {
            
            return console.log(err);
            
        };
        
        res.send(data);
                
    });
    
});

module.exports = router;