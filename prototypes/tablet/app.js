var express = require("express");
var bodyParser = require("body-parser");
var app = express();

// set up the request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// backend API
app.use(require("./routes/workspace-1-get-all-workspaces.route"));
app.use(require("./routes/workspace-2-get-single-workspace.route"));
app.use(require("./routes/workspace-3-get-all-panels-single-workspace.route"));
app.use(require("./routes/workspace-4-get-all-panels.route"));
app.use(require("./routes/workspace-5-get-single-panel.route"));
app.use(require("./routes/story-1-get-all-stories-single-persona.route"));
app.use(require("./routes/story-2-get-all-stories-single-panel-persona.route"));
app.use(require("./routes/persona-1-get-all-personas.route"));
app.use(require("./routes/visualization-1-node-groups.route"));
app.use(require("./routes/visualization-2-geojson-countries.route"));
app.use(require("./routes/visualization-3-grouped-countries.route"));

// static front end
app.use("/", express.static(__dirname + "/www"));

var server = app.listen(8000, '0.0.0.0', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
    
});

module.exports = app;