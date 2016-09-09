import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

urls = (
    
    # 0.0.0.0:8000/api/data/story/
    "", "all_stories",
    # 0.0.0.0:8000/api/data/story/#/, where # == story.id
    "(\d+)/", "single_story",
    # 0.0.0.0:8000/api/data/story/persona/#/, where # == persona.id
    "persona/(\d+)/", "persona_stories",
    # 0.0.0.0:8000/api/data/story/persona/#/panel/#/, where first # == persona.id and second # == panel.id
    "persona/(\d+)/panel/(\d+)/", "persona_panel_stories",
    
)

class all_stories:
    """ Extract all the stories.
    output:
        * story.id
        * story.name
        * story.url_name
    """
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT * FROM gestalt_story;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class single_story:
    """ Extract a story with a specific id.
    input:
        * story.id
    output:
        * story.id
        * story.name
        * story.url_name
    """
    def GET(self, story_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT * 
            FROM gestalt_story AS story
            WHERE story.id = """ + story_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class persona_stories:
    """ Extract all the stories for a particular persona.
    input:
        * persona.id
    output:
        * story.id
        * story.name
        * story.url_name
    """
    def GET(self, persona_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (st.id) st.id, st.name, st.url_name 
            FROM gestalt_story AS st
            RIGHT JOIN gestalt_persona_panel_story AS pps
            ON st.id = pps.story_id 
            AND pps.persona_id = """ + persona_id + """
            WHERE st.id IS NOT NULL
            ORDER BY st.id;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class persona_panel_stories:
    """ Extract all the stories from a specific panel with a particular persona.
    input:
        * persona.id
        * panel.id
    output:
        * story.id
        * story.name
        * story.url_name
        * story_ideas
    """
    def GET(self, persona_id, panel_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (st.id) st.id, st.name, st.url_name, array_agg(row_to_json(si)) as ideas
            FROM gestalt_story AS st
            RIGHT JOIN gestalt_persona_panel_story AS pps ON st.id = pps.story_id 
            right join (
            select si.*,
            array_agg(row_to_json(sc)) as controls
            from gestalt_story_idea si
            left join (
            select sac.id,
            sac.story_action_id,
            g.name as name,
            g.id as name_id
            from gestalt_story_action_control sac
            left join gestalt_group g on g.id = sac.name_id
            ) sc on sc.story_action_id = si.id
            group by si.id
            ) si on si.story_id = st.id
            AND pps.persona_id = """ + persona_id + """
            AND pps.panel_id = """ + panel_id + """
            WHERE st.id IS NOT NULL
            group by st.id,
            st.name,
            st.url_name
            ORDER BY st.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

# instantiate the application
app = web.application(urls, locals())
