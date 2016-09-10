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
        "select w.id,w.persona_id,w.url_name,w.is_default,wn.name,p.url_name as default_panel,array_agg(row_to_json(pl)) as panels from " + tablePrefix + "workspace w left join " + tablePrefix + "workspace_name wn on wn.id = w.workspace_name_id left join " + tablePrefix + "workspace_panel wp on wp.workspace_id = w.id left join " + tablePrefix + "panel p on p.id = wp.panel_id left join (select wp.panel_id, wp.workspace_id, wp.is_default, pl.name, pl.url_name, w.persona_id from " + tablePrefix + "workspace_panel wp left join " + tablePrefix + "panel pl on pl.id = wp.panel_id left join " + tablePrefix + "workspace w on w.id = wp.workspace_id) pl on pl.workspace_id = w.id where w.persona_id = ",
		" and wp.is_default = true group by w.id,w.persona_id,w.url_name,w.url_name,wn.name,p.url_name order by wn.name asc;"
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
        "select pps.*,s.name,s.url_name,array_agg(row_to_json(si)) as ideas from " + tablePrefix + "persona_panel_story pps left join " + tablePrefix + "story s on s.id = pps.story_id left join (select sti.*,array_agg(row_to_json(c)) as controls from " + tablePrefix + "story_idea sti left join (select sac.*,g.name from " + tablePrefix + "story_action_control sac left join " + tablePrefix + "group g on g.id = sac.name_id) c on c.story_action_id = sti.action_id group by sti.id) si on si.story_id = pps.story_id where pps.persona_id = ",
		" and pps.panel_id = ",
		" group by pps.id,s.name,s.url_name;"
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
        "select g.*,array_agg(row_to_json(s)) as subgroups from " + tablePrefix + "group g left join (select distinct on (sg.name_id, sg.group_id) sg.name_id, sg.group_id,case when gt.id = 1 then gn.name else sgn.name end as name,case when gt.id = 1 then gt.id || '_' || gn.id else gt.id || '_' || sgn.id end as id,geo.hexagon_center_x as center_x,geo.hexagon_center_y as center_y,array_agg(row_to_json(n)) as nodes from " + tablePrefix + "subgroup sg left join " + tablePrefix + "geography_name gn on gn.id = sg.name_id left join " + tablePrefix + "subgroup_name sgn on sgn.id = sg.name_id left join " + tablePrefix + "group g on g.id = sg.group_id left join " + tablePrefix + "group_type gt on gt.id = g.type_id left join " + tablePrefix + "geography geo on geo.name_id = sg.name_id and gt.id = 1 left join (select gn.name,gcy.id,gcy.iso2code as iso from " + tablePrefix + "country gcy left join " + tablePrefix + "geography_name gn on gn.id = gcy.name_id) n on n.id = sg.country_id group by sg.name_id,sg.group_id,gn.name,sgn.name,geo.hexagon_center_x,geo.hexagon_center_y,gt.id,g.id,gn.id,sgn.id) s on s.group_id = g.id group by g.id"
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
        "select distinct on (gn.name) gn.name,cy.iso2code as iso,cy.id,count(distinct cdis.target_id) as count from " + tablePrefix + "country cy left join " + tablePrefix + "geography_name gn on gn.id = cy.name_id left join " + tablePrefix + "geography geo on geo.name_id = cy.name_id left join " + tablePrefix + "cdis cdis on source_id = cy.id group by gn.name,cy.iso2code,cy.id"
    ]
    
};

// visualization-4-node-flows.route.js
config.visualization.nodeFlows = {
    
    route: visualizationBase + "/flows/unique_targets/:sourceId",
    
    query: [
        "select gn.name as source_name,cy.iso2code as source,gnt.name as target_name,cyt.iso2code as target,cy.id as source_id,count(cdis.target_id) as value from " + tablePrefix + "cdis cdis left join " + tablePrefix + "geography_name gn on gn.id = cdis.source_id left join " + tablePrefix + "geography_name gnt on gnt.id = cdis.target_id left join " + tablePrefix + "country cy on cy.id = cdis.source_id left join " + tablePrefix + "country cyt on cyt.id = cdis.target_id where source_id = ",
        " and cyt.iso2code is not null group by gn.name,cy.iso2code,cy.id,gnt.name,cyt.iso2code"
    ]
    
};

// visualization-5-network-metrics.route.js
config.visualization.networkMetrics = {
    
    route: visualizationBase + "/network/metrics/:groupId",
    
    query: [
        "select nm.*,gt.name as group_type,g.name as group_name,array_agg(row_to_json(m)) as metrics from " + tablePrefix + "network_metrics nm left join " + tablePrefix + "group_type gt on gt.id = nm.group_id left join " + tablePrefix + "group g on g.id = nm.group_id left join (select m.* from " + tablePrefix + "network_metrics_values m) m on m.group_id = nm.group_id where nm.group_id = ",
        " group by nm.id,gt.name,g.name;"
    ]
    
};



module.exports = config;