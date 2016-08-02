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
        "select wk.id,wk.param,wk.name,pa.name as persona,m.name as panel,t.param as default_panel,array_agg(row_to_json(r)) as panels from " + tablePrefix + "workspace wk," + tablePrefix + "persona pa," + tablePrefix + "meta m,get_panels_by_id(wk.panel) t,get_panels_by_id(wk.panel) r where m.id = wk.panel and pa.id = any(wk.persona) and pa.id = ",
        " and t.id = wk.default_panel and r.id = any(wk.topics) group by wk.id,wk.param,wk.name,pa.name,m.name,t.param;"
    ]
    
};

// workspace-2-get-single-workspace.route.js
config.workspace.singleWorkspace = {
    
    route: workspaceBase + "/:workspace/persona/:persona",
    
    query: [
        "select wk.id,wk.param,wk.name,pa.name as persona,m.name as panel,t.param as default_panel,array_agg(row_to_json(r)) as panels from " + tablePrefix + "workspace wk," + tablePrefix + "persona pa," + tablePrefix + "meta m,get_panels_by_id(wk.panel) t,get_panels_by_id(wk.panel) r where m.id = wk.panel and pa.id = any(wk.persona) and pa.id = ",
        " and t.id = wk.default_panel and r.id = any(wk.topics) and wk.param = '",
        "' group by wk.id,wk.param,wk.name,pa.name,m.name,t.param order by wk.name asc;"
    ]
    
};

// workspace-3-get-all-panels-single-workspace.route.js
config.workspace.panelsSingleWorkspace = {
    
    route: workspaceBase + "/:workspace/panel/:panel",
    
    query: [
        "select t.*,'",
        "' as panel from " + tablePrefix + "",
        " t left join " + tablePrefix + "workspace wk on wk.id = ",
        " where t.id = any(wk.topics) and wk.id = ",
        ";"
    ]
    
};

// workspace-4-get-all-panels.route.js
config.workspace.allPanels = {
    
    route: workspaceBase + "/panel",
    
    query: [
        "select *,'collection' as panel from " + tablePrefix + "collection;"
    ]
    
};

// workspace-5-get-single-panel.route.js
config.workspace.singlePanel = {
    
    route: workspaceBase + "/panel/:type/:panel",
    
    query: [
        "select t.* from " + tablePrefix + "",
        " t where t.param = ",
        ";"
    ]
    
};



/////////////////
///// STORY /////
/////////////////

var storyBase = urlBase + "/data/stories";

// story-1-get-all-stories-single-persona.route.js
config.story.allStoriesSinglePersona = {
    
    route: storyBase + "/:persona",
    
    query: [
        "select distinct on (s.id) s.id,s.name,s.param,v.name as directive from " + tablePrefix + "workspace wk," + tablePrefix + "collection c," + tablePrefix + "story s left join " + tablePrefix + "visual v on v.id = s.visual where c.topics && s.topics and c.id = any(wk.topics) and ",
        " = any(wk.persona);"
    ]
    
};

// story-2-get-all-stories-single-panel-persona.route.js
config.story.allStoriesSinglePanelPersona = {
    
    route: storyBase + "/:panel/persona/:persona",
    
    query: [
        "select distinct on (s.id) s.id,s.name,s.param,v.name as directive from " + tablePrefix + "workspace wk," + tablePrefix + "collection c," + tablePrefix + "story s left join " + tablePrefix + "visual v on v.id = s.visual where c.topics && s.topics and c.id = any(wk.topics) and ",
        " = any(wk.persona) and '",
        "' = c.param;"
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
        "select gt.*,array_agg(row_to_json(r)) as subgroups from " + tablePrefix + "group_type gt left join (select g.*,array_agg(row_to_json(c)) as nodes from " + tablePrefix + "group g left join (select gc.iso_alpha2code as id,gm.grouping as subgroup from " + tablePrefix + "group_member gm left join " + tablePrefix + "geography gc on gc.id = gm.country_id where gc.iso_alpha2code is not null) c on c.subgroup = g.id group by g.id) r on r.type = gt.id group by gt.id;"
    ]
    
};

// visualization-2-geojson-countries.route.js
config.visualization.geojson = {
    
    route: visualizationBase + "/geojson/:grid",
    
    query: [
        "select 'FeatureCollection' as type,array_agg(row_to_json(r)) as features from (with t as (select 'Feature'::text) select t.text as type,row_to_json(f) as properties,row_to_json(c) as geometry from t," + tablePrefix + "geography gc left join (select id,name,iso_alpha2code as iso,grid_id from " + tablePrefix + "geography) f on f.id = gc.id left join (with t as (select 'Polygon'::text) select t.text as type,gcc.",
        "_polygon as coordinates from t," + tablePrefix + "geography gcc) c on c.coordinates = gc.",
        "_polygon where gc.",
        "_polygon is not null and gc.grid_id is not null) r group by type;"
    ]
    
};

// visualization-3-grouped-countries.route.js
config.visualization.groupedCountries = {
    
    route: visualizationBase + "/:table",
    
    query: [
        "select distinct on (gcdis.origin) gcdis.origin from " + tablePrefix + "cdis gcdis left join " + tablePrefix + "geography gc on gc.iso_alpha2code = gcdis.origin where origin != '__' and gc.name is not null;"
    ]
    
};



module.exports = config;