import json
import psycopg2
import psycopg2.extras
import web
import os

urls = (
    
    # 127.0.0.1:8000/api/panel/
    "", "all_panels",
    # 127.0.0.1:8000/api/panel/#/, where # == panel.id
    "(\d+)/", "single_panel",
    # 127.0.0.1:8000/api/panel/persona/#/, where # == persona.id
    "persona/(\d+)/", "persona_panels",
    
)
    
class all_panels:
    """ Extract all the panels.
    output:
        * panel.id
        * panel.name
        * panel.url_name
    """
    def GET(self, connection_string=os.environ['DATABASE_URL']):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT * FROM panel;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
    
class single_panel:
    """ Extract a panel with a specific id.
    input:
        * panel.id
    output:
        * panel.id
        * panel.name
        * panel.url_name
    """
    def GET(self, panel_id, connection_string=os.environ['DATABASE_URL']):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT * 
            FROM panel
            WHERE panel.id = """ + panel_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class persona_panels:
    """ Extract all the panels for a particular persona.
    input:
        * persona.id
    output:
        * panel.id
        * panel.name
        * panel.url_name
    """
    def GET(self, persona_id, connection_string=os.environ['DATABASE_URL']):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (pa.id) pa.id, pa.name, pa.url_name 
            FROM panel pa
            RIGHT JOIN persona_panel_story pps
            ON pa.id = pps.panel_id 
            AND pps.persona_id = """ + persona_id + """
            WHERE pa.id IS NOT NULL
            ORDER BY pa.id;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

# instantiate the application
app = web.application(urls, locals())