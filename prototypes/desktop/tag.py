import json
import psycopg2
import psycopg2.extras
import web
import os

urls = (

    # 127.0.0.1:8000/api/tag/
    "", "all_tags",
    # 127.0.0.1:8000/api/tag/#/, where # == tag.id
    "(\d+)/", "single_tag",
    # 127.0.0.1:8000/api/tag/story/
    "story/", "all_story_tags",
    # 127.0.0.1:8000/api/tag/story/#/, where # == story.id
    "story/(\d+)/", "single_story_tags",
    # 127.0.0.1:8000/api/tag/#/story/, where # == tag.id
    "(\d+)/story/", "all_stories_with_tag"

)
        
class all_tags:
    """ Extract all the tags.
    """
    def GET(self, connection_string=os.environ['DATABASE_URL']): 
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT * FROM tag;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class single_tag:
    """ Extract a tag with a specific id.
    """
    def GET(self, tag_id, connection_string=os.environ['DATABASE_URL']):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT * 
            FROM tag
            WHERE tag.id = """ + tag_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class all_story_tags:
    """ Extract all the tags from all the stories.
    """
    def GET(self, connection_string=os.environ['DATABASE_URL']):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT * FROM story_tag;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class single_story_tags:
    """ Extract all the tags from a single story.
    """
    def GET(self, story_id, connection_string=os.environ['DATABASE_URL']):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT * 
            FROM story_tag
            WHERE story_tag.story_id = """ + story_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class all_stories_with_tag:
    """ Extract all the stories with a particular tag.
    """
    def GET(self, tag_id, connection_string=os.environ['DATABASE_URL']):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT * 
            FROM story_tag
            WHERE story_tag.tag_id = """ + tag_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)


# instantiate the application
app = web.application(urls, locals())
