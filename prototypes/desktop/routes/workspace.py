import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

urls = (

    # 0.0.0.0:8000/api/workspace

    # 0.0.0.0:8000/api/workspace/persona/#/
    #   where # == persona.id
    "persona/(\d+)/", "persona_workspaces",
    
    # 0.0.0.0:8000/api/workspace/#/panels/#
    #   where first # == workspace.url_name, second # = persona_id
    "(.*)/panels/(\d+)/", "workspace_panels"

)

class persona_workspaces:
    """ Extract all the workspaces for a particular persona.
        The output includes each workspace's information, each workspace's default panel, and each workspace's panels.
    input:
        * persona.id
    output:
        * panel.url_name
        * workspace.id
        * workspace.persona_id
        * workspace.url_name
        * workspace.is_default
        * workspace_name.name
        * vis_directive.name
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
