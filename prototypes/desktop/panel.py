import json
import psycopg2
import psycopg2.extras
import web
import os

import helper

urls = (
    
    # 0.0.0.0:8000/api/panel/getAllPanels
    "getAllPanels", "getAllPanels",
    # 0.0.0.0:8000/api/panel/getSinglePanel/#, where # == panel.id
    "getSinglePanel/(\d+)", "getSinglePanel",
    # 0.0.0.0:8000/api/panel/getAllPanelsByPersona/#, where # == persona.id
    "getAllPanelsByPersona/(\d+)", "getAllPanelsByPersona",
    # 0.0.0.0:8000/api/panel/getDefaultPanelByWorkspace/#, where # == workspace.id
    "getDefaultPanelByWorkspace/(\d+)", "getDefaultPanelByWorkspace",
    
)
    
class getAllPanels:
    """ Extract all the panels.
    output:
        * panel.id
        * panel.name
        * panel.url_name
    """
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT * FROM gestalt_panel;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
    
class getSinglePanel:
    """ Extract a panel with a specific id.
    input:
        * panel.id
    output:
        * panel.id
        * panel.name
        * panel.url_name
    """
    def GET(self, panel_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT * 
            FROM gestalt_panel AS panel
            WHERE panel.id = """ + panel_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class getAllPanelsByPersona:
    """ Extract all the panels for a particular persona.
    input:
        * persona.id
    output:
        * panel.id
        * panel.name
        * panel.url_name
    """
    def GET(self, persona_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (pl.id) pl.id, pl.name, pl.url_name 
            FROM gestalt_panel AS pl
            RIGHT JOIN gestalt_persona_panel_story AS pps
            ON pl.id = pps.panel_id 
            AND pps.persona_id = """ + persona_id + """
            WHERE pl.id IS NOT NULL
            ORDER BY pl.id;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class getDefaultPanelByWorkspace:
    """ Extract default panel for a particular workspace.
    assumption:
        * return one panel if inputted correctly
    input:
        * workspace.id
    output:
        * panel.id
        * panel.name
        * panel.url_name
    """
    def GET(self, workspace_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (pl.id) pl.id, pl.name, pl.url_name
            FROM gestalt_panel AS pl
            LEFT JOIN gestalt_workspace_panel AS wpl
            ON pl.id = wpl.panel_id
            WHERE pl.id IS NOT NULL 
            AND wpl.workspace_id = """ + workspace_id + """ 
            AND wpl.is_default IS TRUE
            ORDER BY pl.id; 
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

# instantiate the application
app = web.application(urls, locals())