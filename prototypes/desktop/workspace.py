import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

urls = (
    
    # 127.0.0.1:8000/api/workspace/persona/#/, where # == persona.id
    "persona/(\d+)/", "persona_workspaces",
    
    # 127.0.0.1:8000/api/workspace/#/panels/, where # == workspace.id
    "(\d+)/panels/", "workspace_panels",
    
     # 127.0.0.1:8000/api/workspace/#/, where # == workspace.url_name
    "(.*)/", "single_workspace"
    
)

class single_workspace:
    """ Extract a single workspace with a specific url_name.
    input:
        * workspace.url_name
    output:
        * workspace.id
        * workspace.name
        * persona.name        
        * workspace.url_name
    """
    def GET(self, workspace_url_name, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
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
            WHERE w.url_name IS NOT NULL 
            AND w.url_name = '""" + workspace_url_name + """'
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
        * workspace.url_name,
        * panel.url_name,
        * workspace.is_default
    """
    def GET(self, persona_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (w.id) w.id, wn.name, w.is_default, p.name AS persona_name, w.url_name, pl.url_name AS default_panel, array_agg(row_to_json(r)) as panels
            FROM workspace w
            LEFT JOIN workspace_name wn
            ON w.workspace_name_id = wn.id
            LEFT JOIN workspace_panel wp
            ON wp.workspace_id = w.id
            LEFT JOIN persona p
            ON w.persona_id = p.id
            JOIN panel pl
            ON pl.id = wp.panel_id
            left join (
            select *
            from workspace_panel
            ) r
            on r.workspace_id = w.id
            AND wp.is_default = true
            WHERE w.id IS NOT NULL 
            AND w.persona_id = """ + persona_id + """
            group by w.id, wn.name, w.is_default, p.name, w.url_name, pl.url_name;         
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
