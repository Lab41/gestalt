import json
import os
import psycopg2
import psycopg2.extras
import web
import os

import helper

urls = (
    
    # 127.0.0.1:8000/api/story/
    "", "all_stories",
    # 127.0.0.1:8000/api/story/#/, where # == story.id
    "(\d+)/", "single_story",
    # 127.0.0.1:8000/api/story/persona/#/, where # == persona.id
    "persona/(\d+)/", "persona_stories",
    # 127.0.0.1:8000/api/story/persona/#/panel/#/, where first # == persona.id and second # == panel.id
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
            SELECT * FROM story;
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
            FROM story
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
            FROM story st
            RIGHT JOIN persona_panel_story pps
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
    """
    def GET(self, persona_id, panel_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (st.id) st.id, st.name, st.url_name
            FROM story st
            RIGHT JOIN persona_panel_story pps
            ON st.id = pps.story_id 
            AND pps.persona_id = """ + persona_id + """
            AND pps.panel_id = """ + panel_id + """
            WHERE st.id IS NOT NULL
            ORDER BY st.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

# instantiate the application
app = web.application(urls, locals())
