// configure development API
var api_config = {
	content_service_uri : "api/data/",
    layout_service : "api/workspace/",
    authentication_service_uri : "api/persona/"
}; 

// mapbox development
var mapbox_config = {
	token: "pk.eyJ1Ijoic3Rvcm11IiwiYSI6ImNpbWN0YmVzYjAwMnl1aWtraHYwaGNyYmcifQ.gTNJf31kwAdljd9u7cRGyg",
	style: {
		// should have 1 style for each theme
		// in the theme config below
		light: "mapbox://styles/stormu/cip9bpsm7003jb8np969bh1fy",
		dark: "mapbox://styles/stormu/cimcuz8rw00er9pm08vd7d0mw"
	},
	raster: "https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.js",
	gl: "https://api.tiles.mapbox.com/mapbox-gl-js/v0.15.0/mapbox-gl.js",
	css: "https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.css",
	cssGl: "https://api.tiles.mapbox.com/mapbox-gl-js/v0.15.0/mapbox-gl.css"
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
	tilemap: "rectangle"
};