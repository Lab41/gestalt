// configure development API
var apiConfig = {
    authenticationUri : "api/persona/",
    layoutWorkspaceUri : "api/workspace/",
    layoutPanelUri: "api/panel/",
    contentStoryUri : "api/story/",
    contentVisUri: "api/vis/"
}; 

// mapbox development
var mapboxConfig = {
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
	cssGl: "https://api.tiles.mapbox.com/mapbox-gl-js/v0.15.0/mapbox-gl.css"
};

// app theme
var themeConfig = {
    ui: {
        start: "light",
        opposite: "dark"
    }
};

// visualization
var visualConfig = {
    url_name: "visual-standard",
	tilemap: "rectangle",
    group: 5
};