import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

urls = (

    # 0.0.0.0:8000/api/workspace

    # TODO: fix this mess
    # 0.0.0.0:8000/api/workspace/#/, where # == workspace.url_name
    "([a-fA-F\d]{32})/", "single_workspace",
    # 0.0.0.0:8000/api/workspace/persona/#/, where # == persona.id
    "persona/(\d+)/", "persona_workspaces",
    # 0.0.0.0:8000/api/workspace/#/panels/, where # == workspace.url_name
    "(.*)/panels/(\d+)/", "workspace_panels",

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
            FROM """ + helper.table_prefix + """workspace AS w
            LEFT JOIN """ + helper.table_prefix + """workspace_name AS wn
            ON w.workspace_name_id = wn.id
            LEFT JOIN """ + helper.table_prefix + """persona AS p
            ON w.persona_id = p.id
            WHERE w.id IS NOT NULL 
            AND w.url_name = '""" + workspace_url_name + """'
            ORDER BY w.id;        
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class persona_workspaces:
    """ Extract all the workspaces for a particular persona.
        The output includes each workspace's information, each workspace's default panel, and each workspace's panels.
    input:
        * persona.id
    output:
        * workspace's information
            * workspace.id
            * workspace.name
            * persona.id
            * workspace.url_name
            * workspace.is_default
        * workspace's default panel
            * panel.url_name
        * workspace's panels
            * ?
            * ?
            * ?
            * ?
            * ?
    """
    """

            SELECT w.id, wn.name, w.url_name, wp.is_default, pl.url_name
            FROM """ + helper.table_prefix + """workspace AS w
            LEFT JOIN """ + helper.table_prefix + """workspace_name AS wn
            ON w.workspace_name_id = wn.id
            LEFT JOIN """ + helper.table_prefix + """workspace_panel AS wp
            ON w.id = wp.workspace_id
            LEFT JOIN """ + helper.table_prefix + """panel AS pl
            ON wp.panel_id = pl.id
            WHERE wp.is_default = 't'
            AND w.persona_id = 1
            ORDER BY w.id; 
    """
    def GET(self, persona_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
		select distinct on (p.url_name) w.id,
		w.persona_id,
		w.url_name,
		w.is_default,
		wn.name,
		p.url_name as default_panel,
		vd.name as default_vis
		from """ + helper.table_prefix + """workspace w
		left join """ + helper.table_prefix + """workspace_name wn on wn.id = w.workspace_name_id
		left join """ + helper.table_prefix + """workspace_panel wp on wp.workspace_id = w.id
		left join """ + helper.table_prefix + """panel p on p.id = wp.panel_id
		left join """ + helper.table_prefix + """persona_panel_story pps on pps.panel_id = wp.panel_id and pps.persona_id = """ + persona_id + """
		left join """ + helper.table_prefix + """story s on s.id = pps.story_id
		left join """ + helper.table_prefix + """vis v on v.id = s.vis_id
		left join """ + helper.table_prefix + """vis_directive vd on vd.id = v.vis_directive_id
		where w.persona_id = """ + persona_id + """ and wp.is_default = true
		group by w.id,
		w.persona_id,
		w.url_name,
		w.url_name,
		wn.name,
		p.url_name,
		vd.name
		order by default_panel,
        wn.name asc;
        """)

        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class workspace_panels:
    """ Extract all the panels for a particular workspace.
    input:
        * workspace.url_name
    output:
        * panel.id
        * panel.name
        * panel.url_name
        * workspace.url_name
        * workspace.persona_id
    """
    """
        SELECT DISTINCT ON (p.id) p.id, p.name, p.url_name 
        FROM panel p
        RIGHT JOIN workspace_panel wp
        ON wp.panel_id = p.id
        AND wp.workspace_id = 
        WHERE p.id IS NOT NULL
        ORDER BY p.id;
    """
    def GET(self, workspace_url_name, persona_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
		select distinct on (p.name, vd.name) 
        pps.panel_id,
		p.url_name,
		w.url_name as workspace_url_name,
		p.name,
		pps.persona_id,
		vd.name as default_vis
		from """ + helper.table_prefix + """persona_panel_story pps
		left join """ + helper.table_prefix + """workspace_panel wp on wp.panel_id = pps.panel_id
		left join """ + helper.table_prefix + """story s on s.id = pps.story_id
		left join """ + helper.table_prefix + """vis v on v.id = s.vis_id
		left join """ + helper.table_prefix + """vis_directive vd on vd.id = v.vis_directive_id
		left join """ + helper.table_prefix + """panel p on p.id = wp.panel_id
		left join """ + helper.table_prefix + """workspace w on w.id = wp.workspace_id
		where w.url_name = '""" + workspace_url_name + """' 
        and pps.persona_id = """ + persona_id + """ 
        and vd.name is not null
        order by p.name asc,
        vd.name;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
    
# instantiate the application
app = web.application(urls, locals())
