import web
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

urls = (
    
    # rest API backend endpoints
	"geojson/(.*)/", "geojson",
    "(.*)/", "cdis"
    
)

if os.environ["DATABASE_URL"] is not "":
	
	# parse stored connection string
	values = os.environ["DATABASE_URL"].split(",")
	
	connection_string = "dbname='" + values[0] + "' user='" + values[1] + "' host='" + values[2] + "' password='" + values[3] + "'"
else:
	connection_string = ""
 
class cdis:
    def GET(self, table):
        
        # connection string
        con_string = psycopg2.connect(connection_string)
        
        # postgres connector
        cursor = con_string.cursor(cursor_factory=RealDictCursor)
        
        # SQL query
        cursor.execute("""select distinct on (gcdis.origin) gcdis.origin,gc.name,gc.groups,'group0' as cluster,row_to_json(r) as clustergroups from gestalt_cdis gcdis left join gestalt_country gc on gc.iso_alpha2code = gcdis.origin left join (select gt.name as cluster,gt.id from gestalt_group_type gt) r on r.id = any(gc.groups);""")
        
        # get rows
        data = cursor.fetchall()
        
        return json.dumps(data)
	
class geojson:
    def GET(self, grid):
        
        # connection string
        con_string = psycopg2.connect(connection_string)
        
        # postgres connector
        cursor = con_string.cursor(cursor_factory=RealDictCursor)
        
        # SQL query
        cursor.execute("""select 'FeatureCollection' as type,array_agg(row_to_json(r)) as features from (with t as (select 'Feature'::text) select t.text as type,row_to_json(f) as properties,row_to_json(c) as geometry from t,gestalt_country gc left join (select id,name,iso_alpha2code as iso,hex_grid_id from gestalt_country) f on f.id = gc.id left join (with t as (select 'Polygon'::text) select t.text as type,gcc.""" + grid + """_polygon as coordinates from t,gestalt_country gcc) c on c.coordinates = gc.""" + grid + """_polygon where gc.""" + grid + """_polygon is not null and gc.grid_id is not null) r group by type;""")
        
        # get rows
        data = cursor.fetchall()
        
        return json.dumps(data)
    
app_viz = web.application(urls, locals())