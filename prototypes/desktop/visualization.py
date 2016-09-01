import json
import os
import psycopg2
import psycopg2.extras
import web

import helper
from random import randint
from loremipsum import get_sentences

urls = (
    
    # rest API backend endpoints
    "flows/unique_targets/(.*)/", "flows",
	"countries/groups/", "node_groups",
    "network/health/", "network_health",
	"geojson/(.*)/", "geojson",
    "(.*)/", "nodes"
    
)

class flows:
    def GET(self, source_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        #connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        #self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        #self.cursor.execute("""
        #select gn.name as source_name,
		#cy.iso2code as source,
		#gnt.name as target_name,
		#cyt.iso2code as target,
		#count(cdis.target_id) as value
		#from gestalt_cdis cdis
		#left join gestalt_geography_name gn on gn.id = cdis.source_id
		#left join gestalt_geography_name gnt on gnt.id = cdis.target_id
		#left join gestalt_country cy on cy.id = cdis.source_id
		#left join gestalt_country cyt on cyt.id = cdis.target_id
		#where source_id = """ + source_id + """
		#group by gn.name,
		#cy.iso2code,
		#gnt.name,
		#cyt.iso2code
        #""")
        # obtain the data
        #data = self.cursor.fetchall()
		data = []
		
		for i in range(50):
			
			obj = {}
			obj["source"] = randint(0,166)
			obj["target"] = randint(0,166)
			
			data.append(obj)
			
        # convert data to a string
		return json.dumps(data)
    
class network_health:
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        
		data = {}
		metrics_list = []
		sentences_list = get_sentences(5)
        
		for i in range(4):
            
			obj = {}
			obj["name"] = "attribute " + str(i)
			obj["value"] = randint(0,500) 
            
			metrics_list.append(obj)
		
		sentences_list.insert(0, "Would like to use Narrative Science here.")
		data["metrics"] = metrics_list
		data["text"] = sentences_list
        
		return json.dumps(data)
        # connect to postgresql based on configuration in connection_string
        #connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        #self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        #self.cursor.execute("""
        #select *
        #from gestalt_network_health;
        #""")
        ## obtain the data
        #data = self.cursor.fetchall()
        # convert data to a string
        #return json.dumps(data)
 
class nodes:
    def GET(self, table, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
		select distinct on (gn.name) gn.name,
		cy.iso2code as id,
		count(distinct cdis.target_id) as count
		from gestalt_country cy 
		left join gestalt_geography_name gn on gn.id = cy.name_id
		left join gestalt_geography geo on geo.name_id = cy.name_id
		left join gestalt_cdis cdis on source_id = cy.id
		where geo.hexagon_center_x is not null
		group by gn.name,
		cy.iso2code
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

	select distinct on (sg.name_id, sg.group_id) sg.name_id, sg.group_id,
	case
		when gt.id = 1 then gn.name
		else sgn.name
	end
	as name,
	case
		when gt.id = 1 then gt.id || '_' || gn.id
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

) s on s.group_id = g.id

group by g.id


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