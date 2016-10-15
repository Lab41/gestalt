// configure development API
var api_config = {
	content_service_uri : "api/data/",
    layout_service : "api/workspace/",
    authentication_service_uri : "api/persona/",
    content_economic_service_uri: "api/data/economic/",
    feedback_service_uri: "api/screenshot/"
}; 

// mapbox development
var mapbox_config = {
	token: "pk.eyJ1IjoibGFiNDF0ZWFtIiwiYSI6ImNpaTBrb3FtbzA0dnV0ZmtocjRjMmpncTAifQ.4Zv_-peSaPDbYFzrYP4Lnw",
	style: {
		// should have 1 style for each theme
		// in the theme config below
		light: "mapbox://styles/lab41team/cii0neswf00z99nkpieam90mf",
		dark: "mapbox://styles/lab41team/cii0neswf00z99nkpieam90mf"
	},
	raster: "https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.js",
	gl: "https://api.tiles.mapbox.com/mapbox-gl-js/v0.15.0/mapbox-gl.js",
	css: "https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.css",
	cssGl: "https://api.tiles.mapbox.com/mapbox-gl-js/v0.15.0/mapbox-gl.css",
	leaflet_label: "https://api.mapbox.com/mapbox.js/plugins/leaflet-label/v0.2.1/leaflet.label.js"
};

// app theme
var theme_config = {
    ui: {
        start: "light",
        opposite: "dark"
    }
};

// visualization
var visual_config = {
	tilemap: "rectangle",
    group: 5
};