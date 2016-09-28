import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

urls = (
    
    # rest API backend endpoints
    "geography/(.*)/(.*)/", "geography",
    "flows/unique_targets/(\d+)/", "flows",
    "story/metric/(\d+)/", "metrics",
    "heuristics/comparison/", "heuristic_comparison",
    "heuristics/time-series/", "heuristic_timeseries",
    "heuristics/parts-of-a-whole/", "heuristic_partofwhole",
    "heuristics/relatedness/", "heuristic_relatedness",
    "heuristics/hierarchy/", "heuristic_hierarchy",
	"angular/directives/(\d+)/", "ng_directives",
	"countries/groups/", "node_groups",
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
        return json.dumps(data, default=helper.decimal_encoder)
    
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
        return json.dumps(data, default=helper.decimal_encoder)
    
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
        return json.dumps(data, default=helper.decimal_encoder)
	
class geography:
    def GET(self, data_type, polygon_type, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        # check param
        if (data_type == "xy"):
            
            # execute query to return svg simple x/y coordinate system
            self.cursor.execute("""
            select geo.id,
            gn.name,
            cty.iso2code as iso,
            geo.hexagon_center_x as center_x,
            geo.hexagon_center_y as center_y
            from """ + helper.table_prefix + """geography geo
            left join """ + helper.table_prefix + """geography_name gn on gn.id = geo.name_id
            left join """ + helper.table_prefix + """country cty on cty.id = geo.name_id
            where geo.hexagon_center_x is not null and geo.hexagon_center_y is not null;
            """)
            
        else:

            # execute query to return mercator projection in geojson coordinate system
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
            geo.""" + polygon_type + """_polygon as coordinates 
            from t,
            """ + helper.table_prefix + """geography geo
            ) c on c.coordinates = geo.""" + polygon_type + """_polygon 
            where geo.""" + polygon_type + """_polygon is not null 
            ) r 
            group by type;
            """)
            
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)
    
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
        return json.dumps(data, default=helper.decimal_encoder)

class heuristic_comparison:
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
        with data_array as (
		select dd.vis_id,
		array_agg(row_to_json((select r from (select ddl.name, dd.value) r))) as data
		from """ + helper.table_prefix + """vis_dummy_data dd
        left join """ + helper.table_prefix + """vis_dummy_data_label ddl on ddl.id = dd.name_id
		group by dd.vis_id
		),
		-- attributes
		attrs_array as (
		select vca.vis_id,
		array_agg(row_to_json((select r from (select vca.*, va.name as attr_name, va.value as default_value) r ))) as attrs
		from """ + helper.table_prefix + """vis_code_attr vca
		left join """ + helper.table_prefix + """vis_attr va on va.id = vca.attr_id
		group by vca.vis_id
		),
		-- do guidance
		dos_array as (
		select doa.vis_id,
		array_agg(row_to_json((
		select r 
		from (select doa.*) r 
		))) as dos
		from """ + helper.table_prefix + """vis_do_attr doa
		group by doa.vis_id
		),
		-- dont guidance
		donts_array as (
		select donta.vis_id,
		array_agg(row_to_json((
		select r 
		from (select donta.*) r 
		))) as donts
		from """ + helper.table_prefix + """vis_dont_attr donta
		group by donta.vis_id
		),
		-- alternatives
		alts_array as (
		select val.vis_id,
		array_agg(row_to_json((select r from (select val.*, vd.name as alt_name, vt.url_name as alt_type) r ))) as alts
		from """ + helper.table_prefix + """vis_alt_attr val
		left join """ + helper.table_prefix + """vis_directive vd on vd.id = val.alt_vis_directive_id
		left join """ + helper.table_prefix + """vis v on v.id = val.alt_vis_directive_id
		left join """ + helper.table_prefix + """vis_type vt on vt.id = v.vis_type_id
		group by val.vis_id
		)
		select v.*,
		vt.name as vis_type_name,
		vt.url_name as vis_type_urlname,
		vd.name as directive,
		dd.data,
		vca.attrs,
		doa.dos,
		donta.donts,
		val.alts
		from """ + helper.table_prefix + """vis v
		left join """ + helper.table_prefix + """vis_directive vd on vd.id = v.vis_directive_id
		left join """ + helper.table_prefix + """vis_type vt on vt.id = v.vis_type_id
		left join data_array dd on dd.vis_id = v.id
		left join attrs_array vca on vca.vis_id = v.id
		left join dos_array doa on doa.vis_id = v.id
		left join donts_array donta on donta.vis_id = v.id
		left join alts_array val on val.vis_id = v.id
		where vt.url_name = 'comparison';
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)
	
class heuristic_timeseries:
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
        -- dummy data
        with data_array as (
        -- values
        with value_array as (
        select ddv.data_id,
        array_agg(row_to_json((select r from (select ddv.value, ddv.date as timestamp) r))) as values
        from """ + helper.table_prefix + """vis_dummy_data_values ddv
        group by ddv.data_id
        )
        select dd.vis_id,
        array_agg(row_to_json((select r from (select ddl.name, va.values
        ) r))) as data
        from """ + helper.table_prefix + """vis_dummy_data dd
        left join """ + helper.table_prefix + """vis_dummy_data_label ddl on ddl.id = dd.name_id
        left join value_array va on va.data_id = dd.id
        group by dd.vis_id
        ),
		-- attributes
		attrs_array as (
		select vca.vis_id,
		array_agg(row_to_json((select r from (select vca.*, va.name as attr_name, va.value as default_value) r ))) as attrs
		from """ + helper.table_prefix + """vis_code_attr vca
		left join """ + helper.table_prefix + """vis_attr va on va.id = vca.attr_id
		group by vca.vis_id
		),
		-- do guidance
		dos_array as (
		select doa.vis_id,
		array_agg(row_to_json((
		select r 
		from (select doa.*) r 
		))) as dos
		from """ + helper.table_prefix + """vis_do_attr doa
		group by doa.vis_id
		),
		-- dont guidance
		donts_array as (
		select donta.vis_id,
		array_agg(row_to_json((
		select r 
		from (select donta.*) r 
		))) as donts
		from """ + helper.table_prefix + """vis_dont_attr donta
		group by donta.vis_id
		),
		-- alternatives
		alts_array as (
		select val.vis_id,
		array_agg(row_to_json((select r from (select val.*, vd.name as alt_name, vt.url_name as alt_type) r ))) as alts
		from """ + helper.table_prefix + """vis_alt_attr val
		left join """ + helper.table_prefix + """vis_directive vd on vd.id = val.alt_vis_directive_id
		left join """ + helper.table_prefix + """vis v on v.id = val.alt_vis_directive_id
		left join """ + helper.table_prefix + """vis_type vt on vt.id = v.vis_type_id
		group by val.vis_id
		)
		select v.*,
		vt.name as vis_type_name,
		vt.url_name as vis_type_urlname,
		vd.name as directive,
		dd.data,
		vca.attrs,
		doa.dos,
		donta.donts,
		val.alts
		from """ + helper.table_prefix + """vis v
		left join """ + helper.table_prefix + """vis_directive vd on vd.id = v.vis_directive_id
		left join """ + helper.table_prefix + """vis_type vt on vt.id = v.vis_type_id
		left join data_array dd on dd.vis_id = v.id
		left join attrs_array vca on vca.vis_id = v.id
		left join dos_array doa on doa.vis_id = v.id
		left join donts_array donta on donta.vis_id = v.id
		left join alts_array val on val.vis_id = v.id
		where vt.url_name = 'time-series';
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)
    
class heuristic_partofwhole:
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
        with data_array as (
		select dd.vis_id,
		array_agg(row_to_json((select r from (select ddl.name, dd.value) r))) as data
		from """ + helper.table_prefix + """vis_dummy_data dd
        left join """ + helper.table_prefix + """vis_dummy_data_label ddl on ddl.id = dd.name_id
		group by dd.vis_id
		),
		-- attributes
		attrs_array as (
		select vca.vis_id,
		array_agg(row_to_json((select r from (select vca.*, va.name as attr_name, va.value as default_value) r ))) as attrs
		from """ + helper.table_prefix + """vis_code_attr vca
		left join """ + helper.table_prefix + """vis_attr va on va.id = vca.attr_id
		group by vca.vis_id
		),
		-- do guidance
		dos_array as (
		select doa.vis_id,
		array_agg(row_to_json((
		select r 
		from (select doa.*) r 
		))) as dos
		from """ + helper.table_prefix + """vis_do_attr doa
		group by doa.vis_id
		),
		-- dont guidance
		donts_array as (
		select donta.vis_id,
		array_agg(row_to_json((
		select r 
		from (select donta.*) r 
		))) as donts
		from """ + helper.table_prefix + """vis_dont_attr donta
		group by donta.vis_id
		),
		-- alternatives
		alts_array as (
		select val.vis_id,
		array_agg(row_to_json((select r from (select val.*, vd.name as alt_name, vt.url_name as alt_type) r ))) as alts
		from """ + helper.table_prefix + """vis_alt_attr val
		left join """ + helper.table_prefix + """vis_directive vd on vd.id = val.alt_vis_directive_id
		left join """ + helper.table_prefix + """vis v on v.id = val.alt_vis_directive_id
		left join """ + helper.table_prefix + """vis_type vt on vt.id = v.vis_type_id
		group by val.vis_id
		)
		select v.*,
		vt.name as vis_type_name,
		vt.url_name as vis_type_urlname,
		vd.name as directive,
		dd.data,
		vca.attrs,
		doa.dos,
		donta.donts,
		val.alts
		from """ + helper.table_prefix + """vis v
		left join """ + helper.table_prefix + """vis_directive vd on vd.id = v.vis_directive_id
		left join """ + helper.table_prefix + """vis_type vt on vt.id = v.vis_type_id
		left join data_array dd on dd.vis_id = v.id
		left join attrs_array vca on vca.vis_id = v.id
		left join dos_array doa on doa.vis_id = v.id
		left join donts_array donta on donta.vis_id = v.id
		left join alts_array val on val.vis_id = v.id
		where vt.url_name = 'parts-of-a-whole';
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)
    
class heuristic_relatedness:
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
        -- dummy data
        with data_array as (
        -- nodes
        with node_array as (
        select dd.vis_id,
        array_agg(row_to_json((select r from (select ddl.name) r))) as nodes
        from """ + helper.table_prefix + """vis_dummy_data dd
        left join """ + helper.table_prefix + """vis_dummy_data_label ddl on ddl.id = dd.name_id
        group by dd.vis_id
        ),
        -- links
        link_array as (
        select ddv.data_id,
        array_agg(row_to_json((select r from (select ddl.name) r))) as links
        from """ + helper.table_prefix + """vis_dummy_data_values ddv
        left join """ + helper.table_prefix + """vis_dummy_data_label ddl on ddl.id = ddv.value
        group by ddv.data_id
        )
        select dd.vis_id,
        array_agg(row_to_json((select r from (select ddl.name, na.nodes, la.links) r))) as data
        from """ + helper.table_prefix + """vis_dummy_data dd
        left join """ + helper.table_prefix + """vis_dummy_data_label ddl on ddl.id = dd.name_id
        left join node_array na on na.vis_id = dd.id
        left join link_array la on la.data_id = dd.id
        group by dd.vis_id
        )
        select v.*,
        vt.name as vis_type_name,
        vt.url_name as vis_type_urlname,
        vd.name as directive--,
        --dd.data
        from """ + helper.table_prefix + """vis v
        left join """ + helper.table_prefix + """vis_directive vd on vd.id = v.vis_directive_id
        left join """ + helper.table_prefix + """vis_type vt on vt.id = v.vis_type_id
        --left join data_array dd on dd.vis_id = v.id
        where vt.url_name = 'relatedness';
        """)
        # obtain the data
        data = self.cursor.fetchall()
        
        # temp open from file for now
        with open("related.json") as json_data:

            # dict
            fc = json.load(json_data)
            
            # loop through meta info 
            for obj in data:
                
                # add dummy data until db is updated
                obj["data"] = fc
            
            # convert data to a string
            return json.dumps(data)
        
        # convert data to a string
        #return json.dumps(data, default=helper.decimal_encoder)
    
class heuristic_hierarchy:
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
        with data_array as (
		select dd.vis_id,
		array_agg(row_to_json((select r from (select ddl.name, dd.value) r))) as data
		from """ + helper.table_prefix + """vis_dummy_data dd
        left join """ + helper.table_prefix + """vis_dummy_data_label ddl on ddl.id = dd.name_id
		group by dd.vis_id
		),
		-- attributes
		attrs_array as (
		select vca.vis_id,
		array_agg(row_to_json((select r from (select vca.*, va.name as attr_name, va.value as default_value) r ))) as attrs
		from """ + helper.table_prefix + """vis_code_attr vca
		left join """ + helper.table_prefix + """vis_attr va on va.id = vca.attr_id
		group by vca.vis_id
		),
		-- do guidance
		dos_array as (
		select doa.vis_id,
		array_agg(row_to_json((
		select r 
		from (select doa.*) r 
		))) as dos
		from """ + helper.table_prefix + """vis_do_attr doa
		group by doa.vis_id
		),
		-- dont guidance
		donts_array as (
		select donta.vis_id,
		array_agg(row_to_json((
		select r 
		from (select donta.*) r 
		))) as donts
		from """ + helper.table_prefix + """vis_dont_attr donta
		group by donta.vis_id
		),
		-- alternatives
		alts_array as (
		select val.vis_id,
		array_agg(row_to_json((select r from (select val.*, vd.name as alt_name, vt.url_name as alt_type) r ))) as alts
		from """ + helper.table_prefix + """vis_alt_attr val
		left join """ + helper.table_prefix + """vis_directive vd on vd.id = val.alt_vis_directive_id
		left join """ + helper.table_prefix + """vis v on v.id = val.alt_vis_directive_id
		left join """ + helper.table_prefix + """vis_type vt on vt.id = v.vis_type_id
		group by val.vis_id
		)
		select v.*,
		vt.name as vis_type_name,
		vt.url_name as vis_type_urlname,
		vd.name as directive,
		dd.data,
		vca.attrs,
		doa.dos,
		donta.donts,
		val.alts
		from """ + helper.table_prefix + """vis v
		left join """ + helper.table_prefix + """vis_directive vd on vd.id = v.vis_directive_id
		left join """ + helper.table_prefix + """vis_type vt on vt.id = v.vis_type_id
		left join data_array dd on dd.vis_id = v.id
		left join attrs_array vca on vca.vis_id = v.id
		left join dos_array doa on doa.vis_id = v.id
		left join donts_array donta on donta.vis_id = v.id
		left join alts_array val on val.vis_id = v.id
		where vt.url_name = 'hierarchy';
        """)
        # obtain the data
        data = self.cursor.fetchall()
        
        # temp open from file for now
        with open("hierarchy.json") as json_data:

            # dict
            fc = json.load(json_data)
            
            # loop through meta info 
            for obj in data:
                
                # add dummy data until db is updated
                obj["data"] = fc
            
            # convert data to a string
            return json.dumps(data)
        
        # convert data to a string
        #return json.dumps(data, default=helper.decimal_encoder)
    
# instantiate the application
app = web.application(urls, locals())