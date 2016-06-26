import json
import os
import psycopg2
import psycopg2.extras
import web
import os

import helper

urls = (
    
    # 127.0.0.1:8000/api/workspace/workspace_name
    "workspace_name/", "all_workspace_names",
    # 127.0.0.1:8000/api/workspace/
    "", "all_workspaces",
    # 127.0.0.1:8000/api/workspace/#/, where # == workspace.id
    "(\d+)/", "single_workspace",
    # 127.0.0.1:8000/api/workspace/persona/#/, where # == persona.id
    "persona/(\d+)/", "persona_workspaces",
    # 127.0.0.1:8000/api/workspace/#/panels/, where # == workspace.id
    "(\d+)/panels/", "workspace_panels"
    
)

class all_workspace_names:
    """ Extract all the workspace's names.
    output:
        * workspace_name.id
        * workspace_name.name
    """
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT * FROM workspace_name;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class all_workspaces:
    """ Extract all the workspaces.
    output:
        * workspace.id
        * workspace.name
        * persona.name        
        * workspace.url_name
    """
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (w.id) w.id, wn.name, p.name AS persona_name, w.url_name
            FROM workspace w
            LEFT JOIN workspace_name wn
            ON w.workspace_name_id = wn.id
            LEFT JOIN persona p
            ON w.persona_id = p.id
            WHERE w.id IS NOT NULL
            ORDER BY w.id;        
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class single_workspace:
    """ Extract a single workspace with a specific id.
    input:
        * workspace.id
    output:
        * workspace.id
        * workspace.name
        * persona.name        
        * workspace.url_name
    """
    def GET(self, workspace_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (w.id) w.id, wn.name, p.name AS persona_name, w.url_name
            FROM workspace w
            LEFT JOIN workspace_name wn
            ON w.workspace_name_id = wn.id
            LEFT JOIN persona p
            ON w.persona_id = p.id
            WHERE w.id IS NOT NULL 
            AND w.id = """ + workspace_id + """
            ORDER BY w.id;        
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)


class persona_workspaces:
    """ Extract all the workspaces for a particular persona.
    input:
        * persona.id
    output:
        * workspace.id
        * workspace.name
        * persona.name
        * workspace.url_name
    """
    def GET(self, persona_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (w.id) w.id, wn.name, p.name AS persona_name, w.url_name
            FROM workspace w
            LEFT JOIN workspace_name wn
            ON w.workspace_name_id = wn.id
            LEFT JOIN persona p
            ON w.persona_id = p.id
            WHERE w.id IS NOT NULL 
            AND w.persona_id = """ + persona_id + """
            ORDER BY w.id;        
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class workspace_panels:
    """ Extract all the panels for a particular workspace.
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
            SELECT DISTINCT ON (p.id) p.id, p.name, p.url_name 
            FROM panel p
            RIGHT JOIN workspace_panel wp
            ON wp.panel_id = p.id
            AND wp.workspace_id = """ + workspace_id + """
            WHERE p.id IS NOT NULL
            ORDER BY p.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
    
# instantiate the application
app = web.application(urls, locals())
