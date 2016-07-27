var express = require("express");
var bodyParser = require("body-parser");
var app = express();

// set up the request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// backend API
app.use(require("./routes/workspace-1-get-all-workspaces"));
app.use(require("./routes/workspace-2-get-single-workspace"));
app.use(require("./routes/workspace-3-get-all-panels-single-workspace"));
app.use(require("./routes/workspace-4-get-all-panels"));
app.use(require("./routes/workspace-5-get-single-panel"));
app.use(require("./routes/story-1-get-all-stories-single-persona"));
app.use(require("./routes/story-2-get-all-stories-single-panel-persona"));
app.use(require("./routes/persona-1-get-all-personas"));
app.use(require("./routes/visualization-1-node-groups"));
app.use(require("./routes/visualization-2-geojson-countries"));
app.use(require("./routes/visualization-3-grouped-countries"));
app.use(require("./routes/index"));

// static front end
app.use("/", express.static(__dirname + "/www"));

var server = app.listen(8000, '0.0.0.0', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
    
});

module.exports = app;