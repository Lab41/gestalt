import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

# TODO: handle persona_workspaces && workspace_panels

urls = (

    # 0.0.0.0:8000/api/workspace/getDefaultWorkspaceByPersona/#, where # == persona.id
    "getDefaultWorkspaceByPersona/(\d+)", "getDefaultWorkspaceByPersona",
    # 0.0.0.0:8000/api/workspace/getAllWorkspacesByPersona/#, where # == persona.id
    "getAllWorkspacesByPersona/(\d+)", "getAllWorkspacesByPersona", 

)

class getDefaultWorkspaceByPersona:
    """ Extract default workspace for a particular persona.
    input:
        * persona.id
    output:
        * workspace.id
        * workspace.name
        * workspace.url_name
    """
    def GET(self, persona_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT w.id, wn.name, w.url_name
            FROM gestalt_workspace AS w
                INNER JOIN gestalt_workspace_name AS wn
                ON w.workspace_name_id = wn.id
            WHERE w.persona_id = """ + persona_id + """ 
            AND w.is_default IS TRUE;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class getAllWorkspacesByPersona:
    """ Extract all workspaces for a particular persona.
    input:
        * persona.id
    output:
        * workspace.id
        * workspace.name
        * workspace.url_name
    """
    def GET(self, persona_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT w.id, wn.name, w.url_name
            FROM gestalt_workspace AS w
                INNER JOIN gestalt_workspace_name AS wn
                ON w.workspace_name_id = wn.id
            WHERE w.persona_id = """ + persona_id + """ 
            ORDER BY wn.name;        
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

# instantiate the application
app = web.application(urls, locals())
