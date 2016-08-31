var config = {};
var tablePrefix = "gestalt_";
var urlBase = "/api";

// connection string
config.connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL.split(",")[0] + "://" + process.env.DATABASE_URL.split(",")[1] + ":" + process.env.DATABASE_URL.split(",")[3] + "@" + process.env.DATABASE_URL.split(",")[2] + "/" + process.env.DATABASE_URL.split(",")[0] : "";

// API 
config.workspace = {};
config.story = {};
config.persona = {};
config.visualization = {};



/////////////////
/// WORKSPACE ///
/////////////////

var workspaceBase = urlBase + "/workspace";

// workspace-1-get-all-workspaces.route.js
config.workspace.allWorkspaces = {
    
    route: workspaceBase + "/persona/:persona",
    
    query: [
        "SELECT DISTINCT ON (w.id) w.id, wn.name, w.is_default, p.id AS persona_id, w.url_name, pl.url_name AS default_panel, array_agg(row_to_json(r)) as panels\
            FROM " + tablePrefix + "workspace w\
            LEFT JOIN " + tablePrefix + "workspace_name wn\
            ON w.workspace_name_id = wn.id\
            LEFT JOIN " + tablePrefix + "workspace_panel wp\
            ON wp.workspace_id = w.id\
            LEFT JOIN " + tablePrefix + "persona p\
            ON w.persona_id = p.id\
            JOIN " + tablePrefix + "panel pl\
            ON pl.id = wp.panel_id\
            left join (\
            select wp.panel_id, wp.workspace_id, wp.is_default, pl.name, pl.url_name, w.persona_id\
            from " + tablePrefix + "workspace_panel wp\
            left join " + tablePrefix + "panel pl\
            on pl.id = wp.panel_id\
            left join " + tablePrefix + "workspace w\
            on w.id = wp.workspace_id\
            ) r\
            on r.workspace_id = w.id\
            AND wp.is_default = true\
            WHERE w.id IS NOT NULL \
            AND w.persona_id = ",
        " group by w.id, wn.name, w.is_default, p.id, w.url_name, pl.url_name; "
    ]
    
};

// workspace-2-get-single-workspace.route.js
config.workspace.singleWorkspace = {
    
    route: workspaceBase + "/:workspace",
    
    query: [
        "SELECT DISTINCT ON (w.id) w.id, wn.name, p.name AS persona_name, w.url_name\
            FROM " + tablePrefix + "workspace w\
            LEFT JOIN " + tablePrefix + "workspace_name wn\
            ON w.workspace_name_id = wn.id\
            LEFT JOIN " + tablePrefix + "persona p\
            ON w.persona_id = p.id\
            WHERE w.url_name IS NOT NULL \
            AND w.url_name = '",
        "' ORDER BY w.id;"
    ]
    
};

// workspace-3-get-all-panels-single-workspace.route.js
config.workspace.panelsSingleWorkspace = {
    
    route: workspaceBase + "/:workspace/panels",
    
    query: [
        "SELECT DISTINCT ON (p.id) p.id as panel_id, p.name, p.url_name, w.url_name as workspace_url_name, w.persona_id\
            FROM " + tablePrefix + "panel p\
            RIGHT JOIN " + tablePrefix + "workspace_panel wp\
            ON wp.panel_id = p.id\
            right join " + tablePrefix + "workspace w\
            on w.id = wp.workspace_id\
            and w.url_name = '",
        "' WHERE p.id IS NOT NULL\
            ORDER BY p.id;"
    ]
    
};



/////////////////
///// STORY /////
/////////////////

var storyBase = urlBase + "/data/story";

// story-1-get-all-stories-single-panel-persona.route.js
config.story.allStoriesSinglePanelPersona = {
    
    route: storyBase + "/persona/:persona/panel/:panel",
    
    query: [
        "SELECT DISTINCT ON (st.id) st.id, st.name, st.url_name\
            FROM " + tablePrefix + "story st\
            RIGHT JOIN " + tablePrefix + "persona_panel_story pps\
            ON st.id = pps.story_id \
            AND pps.persona_id = ",
        " AND pps.panel_id = ",
        " WHERE st.id IS NOT NULL \
          ORDER BY st.id;"
    ]
    
};



/////////////////
//// PERSONA ////
/////////////////

var personaBase = urlBase + "/persona";

// persona-1-get-all-personas.route.js
config.persona.allPersonas = {
    
    route: personaBase,
    
    query: [
        "select * from " + tablePrefix + "persona;"
    ]
    
};



/////////////////////
/// VISUALIZATION ///
/////////////////////

var visualizationBase = urlBase + "/data/visualization";

// visualization-1-node-groups.route.js
config.visualization.nodeGroups = {
    
    route: visualizationBase + "/countries/groups",
    
    query: [
        "select g.*,array_agg(row_to_json(s)) as subgroups from " + tablePrefix + "group g left join (select distinct on (sg.name_id, sg.group_id) sg.name_id, sg.group_id, case when gt.id = 1 then gn.name else sgn.name end as name,case when gt.id = 1 then gt.id || '_' || gn.id else gt.id || '_' || sgn.id end as id,geo.hexagon_center_x as center_x,geo.hexagon_center_y as center_y,array_agg(row_to_json(n)) as nodes from " + tablePrefix + "subgroup sg left join " + tablePrefix + "geography_name gn on gn.id = sg.name_id left join " + tablePrefix + "subgroup_name sgn on sgn.id = sg.name_id left join " + tablePrefix + "group g on g.id = sg.group_id left join " + tablePrefix + "group_type gt on gt.id = g.type_id left join " + tablePrefix + "geography geo on geo.name_id = sg.name_id and gt.id = 1 left join (select gn.name,gcy.id, gcy.iso2code as iso from " + tablePrefix + "country gcy left join " + tablePrefix + "geography_name gn on gn.id = gcy.name_id) n on n.id = sg.country_id group by sg.name_id,sg.group_id,gn.name,sgn.name,geo.hexagon_center_x,geo.hexagon_center_y,gt.id,g.id,gn.id,sgn.id) s on s.group_id = g.id group by g.id;"
    ]
    
};

// visualization-2-geojson-countries.route.js
config.visualization.geojson = {
    
    route: visualizationBase + "/geojson/:grid",
    
    query: [
        "select 'FeatureCollection' as type,array_agg(row_to_json(r)) as features from (with t as (select 'Feature'::text) select t.text as type,row_to_json(f) as properties,row_to_json(c) as geometry from t," + tablePrefix + "geography geo left join (select geo.id,gn.name,cy.iso2code as iso from " + tablePrefix + "geography geo left join " + tablePrefix + "geography_name gn on gn.id = geo.name_id left join " + tablePrefix + "country cy on cy.id = geo.name_id) f on f.id = geo.id left join (with t as (select 'Polygon'::text) select t.text as type,geo.hexagon_polygon as coordinates from t," + tablePrefix + "geography geo) c on c.coordinates = geo.hexagon_polygon where geo.hexagon_polygon is not null ) r group by type;"
    ]
    
};

// visualization-3-grouped-countries.route.js
config.visualization.groupedCountries = {
    
    route: visualizationBase + "/:table",
    
    query: [
        "select distinct on (gn.name) gn.name,cy.iso2code as id from " + tablePrefix + "country cy left join " + tablePrefix + "geography_name gn on gn.id = cy.name_id left join " + tablePrefix + "geography geo on geo.name_id = cy.name_id where geo.hexagon_center_x is not null;"
    ]
    
};



module.exports = config;