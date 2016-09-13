import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

urls = (
    
    # 0.0.0.0:8000/api/story/getAllStories
    "getAllStories", "getAllStories",
    # 0.0.0.0:8000/api/story/getSingleStory/#
    #   where # == story.id
    "getSingleStory/(\d+)", "getSingleStory",
    # 0.0.0.0:8000/api/story/getAllStoriesByWorkspaceAndPanel/persona/#/panel/#
    #   where first # == workspace.id and second # == panel.id
    "getAllStoriesByWorkspaceAndPanel/workspace/(\d+)/panel/(\d+)", "getAllStoriesByWorkspaceAndPanel",
    
)

class getAllStories:
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
            SELECT * FROM """ + helper.table_prefix + """story;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class getSingleStory:
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
            FROM """ + helper.table_prefix + """story AS story
            WHERE story.id = """ + story_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class getAllStoriesByWorkspaceAndPanel:
    """ Extract all the stories from a specific panel with a particular persona.
    input:
        * workspace.id
        * panel.id
    output:
        * story.id
        * story.name
        * story.url_name
        * story_ideas
    """
    def GET(self, workspace_id, panel_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (st.id) st.id, st.name, st.url_name
            FROM gestalt_story AS st
            RIGHT JOIN gestalt_workspace_panel_story AS wps
            ON st.id = wps.story_id 
            AND wps.workspace_id = """ + workspace_id + """
            AND wps.panel_id = """ + panel_id + """
            WHERE st.id IS NOT NULL
            ORDER BY st.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

# instantiate the application
app = web.application(urls, locals())
