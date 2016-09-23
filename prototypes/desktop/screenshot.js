
var page = require('webpage').create(); page.viewportSize = { width: 2561, height: 1272 }; page.open('http://0.0.0.0:8000/#/econ/contagion/tile-grid-map?si=1&sc=1&t=light', function(status) { setTimeout(function(){ page.render('viz3.png'); console.log('completed'); phantom.exit(); },1000); });

