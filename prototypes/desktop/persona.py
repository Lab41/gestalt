import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

urls = (

    # 0.0.0.0:8000/api/persona/
    "", "all_personas",
    # 0.0.0.0:8000/api/persona/#/, where # == persona.id
    "(\d+)/", "single_persona",
    
)
        
class all_personas:
    """ Extract all the personas.
    output:
        * persona.id
        * persona.name
        * persona.description
        * persona.type
        * workspace.id
        * workspace.url_name
        * default_vis in default_story in default_panel in default_workspace
    """
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            select distinct on (w.persona_id)
            w.id as workspace_id,
            w.url_name as workspace_url_name,
            p.id,
            p.name,
            p.description,
            pt.name as persona_type,
            pl.url_name as default_panel,
            vd.name as default_vis
            from gestalt_workspace w
            left join gestalt_persona p on p.id = w.persona_id
            left join gestalt_persona_type pt on pt.id = p.persona_type
            left join gestalt_workspace_panel wp on wp.workspace_id = w.id
            left join gestalt_panel pl on pl.id = wp.panel_id
            left join gestalt_persona_panel_story pps on pps.panel_id = wp.panel_id
            left join gestalt_story s on s.id = pps.story_id
            left join gestalt_vis v on v.id = s.vis_id
            left join gestalt_vis_directive vd on vd.id = v.vis_directive_id
            where w.is_default = true
            order by w.persona_id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # close cursor and connection
        connection.close()
        self.cursor.close()
        # convert data to a string
        return json.dumps(data)

class single_persona:
    """ Extract a persona with a specific id.
    input:
        * persona.id
    output:
        * persona.id
        * persona.name
        * persona.description
    """
    def GET(self, persona_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT * 
            FROM gestalt_persona AS persona
            WHERE persona.id = """ + persona_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)


# instantiate the application
app = web.application(urls, locals())
