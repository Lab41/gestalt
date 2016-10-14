import json
import psycopg2
import psycopg2.extras
import web
import os

import helper

urls = (

    # 0.0.0.0:8000/api/tag/
    "", "all_tags",
    # 0.0.0.0:8000/api/tag/#/, where # == tag.id
    "(\d+)/", "single_tag",
    # 0.0.0.0:8000/api/tag/story/#/, where # == story.id
    "story/(\d+)/", "single_story_tags",
    # 0.0.0.0:8000/api/tag/#/stories/, where # == tag.id
    "(\d+)/stories/", "all_stories_with_tag",
    # 0.0.0.0:8000/api/tag/panel/#/, where # == panel.id
    "panel/(\d+)/", "single_panel_tags",
    # 0.0.0.0:8000/api/tag/#/panels/, where # == tag.id
    "(\d+)/panels/", "all_panels_with_tag",
    # 0.0.0.0:8000/api/tag/workspace/#/, where # == workspace.id
    "workspace/(\d+)/", "single_workspace_tags",
    # 0.0.0.0:8000/api/tag/#/workspace/, where # == tag.id
    "(\d+)/workspaces/", "all_workspaces_with_tag"

)
        
class all_tags:
    """ Extract all the tags.
    output:
        * tag.id
        * tag.name
    """
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT * FROM gestalt_tag;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class single_tag:
    """ Extract a tag with a specific id.
    input:
        * tag.id
    output:
        * tag.id
        * tag.name
    """
    def GET(self, tag_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT * 
            FROM gestalt_tag AS tag
            WHERE tag.id = """ + tag_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class single_story_tags:
    """ Extract all the tags from a single story.
    input: 
        * story.id
    output:
        * tag.id
        * tag.name
    """
    def GET(self, story_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (tag.id) tag.id, tag.name
            FROM gestalt_tag AS tag
            RIGHT JOIN gestalt_story_tag AS story_tag
            ON tag.id = story_tag.tag_id 
            AND story_tag.story_id = """ + story_id + """
            WHERE tag.id IS NOT NULL
            ORDER BY tag.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class all_stories_with_tag:
    """ Extract all the stories with a particular tag.
    input:
        * tag.id
    output:
        * story.id
        * story.name
        * story.url_name
    """
    def GET(self, tag_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (story.id) story.id, story.name, story.url_name
            FROM gestalt_story AS story
            RIGHT JOIN gestalt_story_tag AS story_tag
            ON story.id = story_tag.story_id 
            AND story_tag.tag_id = """ + tag_id + """
            WHERE story.id IS NOT NULL
            ORDER BY story.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class single_panel_tags:
    """ Extract all the tags from a single panel.
    input:
        * panel.id
    output:
        * tag.id
        * tag.name
    """
    def GET(self, panel_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (tag.id) tag.id, tag.name
            FROM gestalt_tag AS tag
            RIGHT JOIN gestalt_panel_tag AS panel_tag
            ON tag.id = panel_tag.tag_id 
            AND panel_tag.panel_id = """ + panel_id + """
            WHERE tag.id IS NOT NULL
            ORDER BY tag.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class all_panels_with_tag:
    """ Extract all the panels with a particular tag.
    input:
        * tag.id
    output:
        * panel.id
        * panel.name
        * panel.url_name
    """
    def GET(self, tag_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (panel.id) panel.id, panel.name, panel.url_name
            FROM gestalt_panel AS panel
            RIGHT JOIN gestalt_panel_tag AS panel_tag
            ON panel.id = panel_tag.panel_id 
            AND panel_tag.tag_id = """ + tag_id + """
            WHERE panel.id IS NOT NULL
            ORDER BY panel.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class single_workspace_tags:
    """ Extract all the tags from a single workspace.
    input:
        * workspace.id
    output:
        * tag.id
        * tag.name
    """
    def GET(self, workspace_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (tag.id) tag.id, tag.name
            FROM gestalt_tag AS tag
            RIGHT JOIN gestalt_workspace_tag AS workspace_tag
            ON tag.id = workspace_tag.tag_id 
            AND workspace_tag.workspace_id = """ + workspace_id + """
            WHERE tag.id IS NOT NULL
            ORDER BY tag.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class all_workspaces_with_tag:
    """ Extract all the workspaces with a particular tag.
    input:
        * tag.id
    output:
        * workspace.id
        * workspace.name
        * persona.name        
        * workspace.url_name
    """
    def GET(self, tag_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (w.id) w.id, wn.name, p.name AS persona_name, w.url_name
            FROM gestalt_workspace AS w
            LEFT JOIN gestalt_workspace_name AS wn
            ON w.workspace_name_id = wn.id
            LEFT JOIN gestalt_persona AS p
            ON w.persona_id = p.id
            RIGHT JOIN gestalt_workspace_tag AS wt
            ON w.id = wt.workspace_id 
            AND wt.tag_id = """ + tag_id + """
            WHERE w.id IS NOT NULL
            ORDER BY w.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)
# instantiate the application
app = web.application(urls, locals())
