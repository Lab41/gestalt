import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

urls = (
    
    # rest API backend endpoints
    "flows/unique_targets/(\d+)/", "flows",
    "story/metric/(\d+)/", "metrics",
    "heuristics/(.*)/", "heuristics",
	"angular/directives/(\d+)/", "ng_directives",
	"countries/groups/", "node_groups",
	"geojson/(.*)/", "geojson",
    "(.*)/", "nodes"
    
)

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
		from """ + helper.table_prefix + """cdis cdis
		left join """ + helper.table_prefix + """geography_name gn on gn.id = cdis.source_id
		left join """ + helper.table_prefix + """geography_name gnt on gnt.id = cdis.target_id
		left join """ + helper.table_prefix + """country cy on cy.id = cdis.source_id
		left join """ + helper.table_prefix + """country cyt on cyt.id = cdis.target_id
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
    def GET(self, table, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
		select distinct on (gn.name) gn.name,
		cy.iso2code as iso,
		cy.id,
		count(distinct cdis.target_id) as count
		from """ + helper.table_prefix + """country cy 
		left join """ + helper.table_prefix + """geography_name gn on gn.id = cy.name_id
		left join """ + helper.table_prefix + """geography geo on geo.name_id = cy.name_id
		left join """ + helper.table_prefix + """cdis cdis on source_id = cy.id
		group by gn.name,
		cy.iso2code,
		cy.id
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
        from """ + helper.table_prefix + """group g 
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
        from """ + helper.table_prefix + """subgroup sg 
        left join """ + helper.table_prefix + """geography_name gn on gn.id = sg.name_id 
        left join """ + helper.table_prefix + """subgroup_name sgn on sgn.id = sg.name_id 
        left join """ + helper.table_prefix + """group g on g.id = sg.group_id 
        left join """ + helper.table_prefix + """group_type gt on gt.id = g.type_id 
        left join """ + helper.table_prefix + """geography geo on geo.name_id = sg.name_id and gt.id = 1 
        left join (
        select gn.name,
        gcy.id,
        gcy.iso2code as iso 
        from """ + helper.table_prefix + """country gcy 
        left join """ + helper.table_prefix + """geography_name gn on gn.id = gcy.name_id
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
		""" + helper.table_prefix + """geography geo 
        left join (
		select geo.id,
        gn.name,
        cy.iso2code as iso
        from """ + helper.table_prefix + """geography geo
        left join """ + helper.table_prefix + """geography_name gn on gn.id = geo.name_id
        left join """ + helper.table_prefix + """country cy on cy.id = geo.name_id
		) f on f.id = geo.id 
		left join (
		with t as (
		select 'Polygon'::text
		) 
		select t.text as type,
        geo.hexagon_polygon as coordinates 
        from t,
        """ + helper.table_prefix + """geography geo
        ) c on c.coordinates = geo.hexagon_polygon 
        where geo.hexagon_polygon is not null 
        ) r 
        group by type;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
    
class ng_directives:
    def GET(self, vis_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
        select v.*
        from """ + helper.table_prefix + """vis v
        where v.id = """ + vis_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
	
class heuristics:
    def GET(self, vistype_name, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
        select v.*,
		vt.name as vis_type_name,
        array_agg(row_to_json(d)) as data
        from """ + helper.table_prefix + """vis v
		left join """ + helper.table_prefix + """vis_type vt on vt.id = v.vis_type_id
        left join (
        select *
        from """ + helper.table_prefix + """vis_dummy_data
        ) d on d.vis_id = v.id
        where vt.name = '""" + vistype_name + """'
        group by v.id,
		vt.name;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
    
# instantiate the application
app = web.application(urls, locals())
