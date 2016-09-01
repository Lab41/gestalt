import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

urls = (
    
    # 0.0.0.0:8000/api/data/visualization/countries/groups/
	"countries/groups/", "node_groups",
	"geojson/(.*)/", "geojson",
    "(.*)/", "cdis"
    
)
 
class cdis:
    def GET(self, table, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            select distinct on (gcdis.origin) gcdis.origin 
            from gestalt_cdis gcdis 
            left join gestalt_geography gc 
            on gc.iso_alpha2code = gcdis.origin 
            where origin != '__' 
            and gc.name is not null;
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
            select gt.*,
            array_agg(row_to_json(r)) as subgroups 
            from gestalt_group_type gt 
            left join (
            select g.*,
            array_agg(row_to_json(c)) as nodes 
            from gestalt_group g 
            left join (
            select gc.iso_alpha2code as id,
            gm.grouping as subgroup 
            from gestalt_group_member gm 
            left join gestalt_geography gc 
            on gc.id = gm.country_id 
            where gc.iso_alpha2code is not null
            ) c 
            on c.subgroup = g.id 
            group by g.id
            ) r 
            on r.type = gt.id 
            group by gt.id;
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
            from t,gestalt_geography gc 
            left join (
            select id,name,
            iso_alpha2code as iso,
            grid_id 
            from gestalt_geography
            ) f 
            on f.id = gc.id 
            left join (
            with t as (
            select 'Polygon'::text
            ) 
            select t.text as type,
            gcc.""" + grid + """_polygon as coordinates 
            from t,
            gestalt_geography gcc
            ) c 
            on c.coordinates = gc.""" + grid + """_polygon 
            where gc.""" + grid + """_polygon is not null 
            and gc.grid_id is not null
            ) r 
            group by type;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
    
# instantiate the application
app = web.application(urls, locals())