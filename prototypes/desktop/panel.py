import json
import psycopg2
import psycopg2.extras
import web
import os

# TODO: update url
urls = (
    
    # rest API backend endpoints
    "panel/", "all_panels",
    "panel/(.*)/(.*)/", "single_panel",
    
)
    
class all_panels:
    def GET(self, connection_string=os.environ['DATABASE_URL']):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        cursor.execute("""
            SELECT * FROM panel;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
    
# TODO: what is this? get this working!
class single_panel:
    def GET(self, panel_type, panel_id):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        cursor.execute("""select t.* from gestalt_""" + panel_type + """ t where t.param = """ + panel_id + """;""")
        
        # get rows
        data = cursor.fetchall()
        
        return json.dumps(data)
    
app = web.application(urls, locals())