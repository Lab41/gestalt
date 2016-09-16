import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

# TODO: handle persona_panel_stories && story_idea_metrics

urls = (
    
    # 0.0.0.0:8000/api/story/getAllStories
    "getAllStories", "getAllStories",
    # 0.0.0.0:8000/api/story/getSingleStory/#
    #   where # == story.id
    "getSingleStory/(\d+)", "getSingleStory",
    # 0.0.0.0:8000/api/story/getDefaultStoriesByWorkspaceAndPanel/workspace/#/panel/#
    #   where first # == workspace.id and second # == panel.id
    "getDefaultStoryByWorkspaceAndPanel/workspace/(\d+)/panel/(\d+)", "getDefaultStoryByWorkspaceAndPanel",
    # 0.0.0.0:8000/api/story/getAllStoriesByWorkspaceAndPanel/workspace/#/panel/#
    #   where first # == workspace.id and second # == panel.id
    "getAllStoriesByWorkspaceAndPanel/workspace/(\d+)/panel/(\d+)", "getAllStoriesByWorkspaceAndPanel",
    # 0.0.0.0:8000/api/story/getAllIdeasByStory/#
    #   where # == story.id
    "getAllIdeasByStory/(\d+)", "getAllIdeasByStory",
    
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
            SELECT * FROM gestalt_story;
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
            FROM gestalt_story AS story
            WHERE story.id = """ + story_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class getDefaultStoryByWorkspaceAndPanel:
    """ Extract default story from a specific panel with a particular workspace and persona.
    assumption:
        * return one story if data are inputted correctly
    input:
        * workspace.id
        * panel.id
    output:
        * story.id
        * story.name
        * story.url_name
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
            LEFT JOIN gestalt_wp_story AS wps
                INNER JOIN gestalt_workspace_panel AS wp
                ON wps.wp_id = wp.id
            ON st.id = wps.story_id 
            WHERE wp.workspace_id = """ + workspace_id + """
            AND wp.panel_id = """ + panel_id + """
            AND wps.is_default IS TRUE
            AND st.id IS NOT NULL
            ORDER BY st.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class getAllStoriesByWorkspaceAndPanel:
    """ Extract all the stories from a specific panel with a particular workspace and persona.
    input:
        * workspace.id
        * panel.id
    output:
        * story.id
        * story.name
        * story.url_name
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
            LEFT JOIN gestalt_wp_story AS wps
                INNER JOIN gestalt_workspace_panel AS wp
                ON wps.wp_id = wp.id
            ON st.id = wps.story_id 
            WHERE wp.workspace_id = """ + workspace_id + """
            AND wp.panel_id = """ + panel_id + """
            AND st.id IS NOT NULL
            ORDER BY st.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class getAllIdeasByStory:
    """ Extract all the ideas from a particular story.
    input:
        * story.id
    output:
        * idea.id
        * idea.title
        * idea.subtitle
        * idea.description
        * idea.action_id
    """
    def GET(self, story_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (idea.id) idea.title, idea.subtitle, idea.description, idea.action_id
            FROM gestalt_idea AS idea
            WHERE idea.story_id = """ + story_id + """
            ORDER BY idea.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

# instantiate the application
app = web.application(urls, locals())
