import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

urls = (
    
    # 0.0.0.0:8000/api/visualization/getDefaultVisByStory/#
    #   where # == story.id   
    "getDefaultVisByStory/(\d+)", "getDefaultVisByStory",
    # 0.0.0.0:8000/api/visualization/getDirectiveName/#
    #   where # == vis.id
    "getDirectiveNameByVis/(\d+)", "getDirectiveNameByVis",



    "flows/unique_targets/(.*)/", "flows",
    "story/metric/(\d+)/", "metrics",
    "countries/groups/", "node_groups",
    "geojson/(.*)/", "geojson",
    "(.*)/", "nodes"
    
)

            SELECT DISTINCT ON (st.id) st.id, st.name, st.url_name
            FROM gestalt_story AS st
            LEFT JOIN gestalt_wp_story AS wps
                INNER JOIN gestalt_workspace_panel AS wp
                ON wps.wp_id = wp.id
            ON st.id = wps.story_id 
            WHERE wp.workspace_id = """ + workspace_id + """
            AND wp.panel_id = """ + panel_id + """
            AND wps.is_default IS TRUE
            AND st.id IS NOT NULL
            ORDER BY st.id;

class getDefaultVisByStory:
    """ Get the default visualization for a particular story. 
        The default visualization has the order number 1. 
    input:
        * story.id
    output:
        * vis.id
        * vis.name
        * vis.max_limit
        * vis_type.id
        * vis_type.name
        * vis_directive.name
    """
    def GET(self, story_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT vis.id, vis.name, vis.max_limit, 
                   vis_type.id AS vis_type_id, vis_type.name AS vis_type_name, 
                   vis_directive.name AS vis_directive_name
            FROM gestalt_vis AS vis
                INNER JOIN gestalt_vis_type AS vis_type
                ON vis.type_id = vis_type.id
                INNER JOIN gestalt_vis_directive AS vis_directive
                ON vis.directive_id = vis_directive.id
            LEFT JOIN gestalt_story_vis AS sv
            ON vis.id = sv.vis_id
            WHERE sv.story_id = """ + story_id + """
            AND vis.id IS NOT NULL
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)


class getDirectiveNameByVis:
    """ Get the directive name for the vis so that the front-end can call
        the directive to build the vis.
    input:
        * vis.id
    output:
        * vis_directive.name
    """
    def GET(self, vis_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT vis_directive.name
            FROM gestalt_vis AS vis
            RIGHT JOIN gestalt_vis_directive AS vis_directive 
            ON vis.directive_id = vis_directive.id
            WHERE vis.id = """ + vis_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class flows:
    def GET(self, source_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
        select gn.name as source_name,
        cy.iso2code as source,
        gnt.name as target_name,
        cyt.iso2code as target,
        cy.id as source_id,
        count(cdis.target_id) as value
        from gestalt_cdis cdis
        left join gestalt_geography_name gn on gn.id = cdis.source_id
        left join geography_name gnt on gnt.id = cdis.target_id
        left join gestalt_country cy on cy.id = cdis.source_id
        left join gestalt_country cyt on cyt.id = cdis.target_id
        where source_id = """ + source_id + """ and cyt.iso2code is not null
        group by gn.name,
        cy.iso2code,
        cy.id,
        gnt.name,
        cyt.iso2code
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
    
class nodes:
    # TODO: refactor
    # 1. combine name from geography_name into gestalt_country
    # 2. create a table called gestalt_region to differentiate the different regions
    # 3. create a table called gestalt_region_country to know which country falls under what region
    # 4. 
    def GET(self, table, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
        SELECT distinct on (geo_name.name) geo_name.name, country.iso2code AS iso, country.id,
            COUNT(DISTINCT cdis.target_id) AS count
        FROM gestalt_country AS country 
            INNER JOIN gestalt_geography_name AS geo_name 
            ON geo_name.id = country.name_id
        LEFT JOIN gestalt_geography AS geo on geo.name_id = country.name_id
        LEFT JOIN gestalt_cdis AS cdis on source_id = country.id
        GROUP BY geo_name.name, country.iso2code, country.id
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
    
class node_groups:
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
        select g.*,
        array_agg(row_to_json(s)) as subgroups 
        from gestalt_group g 
        left join (
        select distinct on (sg.name_id, sg.group_id) sg.name_id, 
        sg.group_id,
        case 
        when gt.id = 1 then gn.name 
        else sgn.name 
        end as name,
        case when gt.id = 1 then gt.id || '_' || gn.id 
        else gt.id || '_' || sgn.id 
        end as id,
        geo.hexagon_center_x as center_x,
        geo.hexagon_center_y as center_y,
        array_agg(row_to_json(n)) as nodes 
        from gestalt_subgroup sg 
        left join gestalt_geography_name gn on gn.id = sg.name_id 
        left join gestalt_subgroup_name sgn on sgn.id = sg.name_id 
        left join gestalt_group g on g.id = sg.group_id 
        left join gestalt_group_type gt on gt.id = g.type_id 
        left join gestalt_geography geo on geo.name_id = sg.name_id and gt.id = 1 
        left join (
        select gn.name,
        gcy.id,
        gcy.iso2code as iso 
        from gestalt_country gcy 
        left join gestalt_geography_name gn on gn.id = gcy.name_id
        ) n on n.id = sg.country_id 
        group by sg.name_id,
        sg.group_id,
        gn.name,
        sgn.name,
        geo.hexagon_center_x,
        geo.hexagon_center_y,
        gt.id,
        g.id,
        gn.id,
        sgn.id
        ) s on s.group_id = g.id group by g.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
    
class geojson:
    def GET(self, grid, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
        select 'FeatureCollection' as type,
        array_agg(row_to_json(r)) as features 
        from (
        with t as (
        select 'Feature'::text
        ) 
        select t.text as type,
        row_to_json(f) as properties,
        row_to_json(c) as geometry 
        from t,
        gestalt_geography geo 
        left join (
        select geo.id,
        gn.name,
        cy.iso2code as iso
        from gestalt_geography geo
        left join gestalt_geography_name gn on gn.id = geo.name_id
        left join gestalt_country cy on cy.id = geo.name_id
        ) f on f.id = geo.id 
        left join (
        with t as (
        select 'Polygon'::text
        ) 
        select t.text as type,
        geo.hexagon_polygon as coordinates 
        from t,
        gestalt_geography geo
        ) c on c.coordinates = geo.hexagon_polygon 
        where geo.hexagon_polygon is not null 
        ) r 
        group by type;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
    
# instantiate the application
app = web.application(urls, locals())