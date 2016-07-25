import json
import psycopg2
import psycopg2.extras
import web
import os

# TOOD: update url
urls = (
    
    # rest API backend endpoints
    "persona/(.*)/", "all_stories",
    "(.*)/persona/(.*)/", "panel_stories",
    
)

class all_stories:
    def GET(self, persona_id, connection_string=os.environ['DATABASE_URL']):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (st.id, st.name, st.url_name) st.id, st.name, st.url_name 
            FROM story st
            RIGHT JOIN persona_panel_story pcs
            ON st.id = pcs.story_id 
            AND pcs.persona_id = """ + persona_id + """
            WHERE st.id IS NOT NULL
            ORDER BY st.id;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class all_panel_stories:
    def GET(self, persona_id, panel_id, connection_string=os.environ['DATABASE_URL']):   
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (st.id, st.name, st.url_name) st.id, st.name, st.url_name
            FROM story st
            RIGHT JOIN persona_panel_story pcs
            ON st.id = pcs.story_id 
            AND pcs.persona_id = """ + persona_id + """
            AND pcs.panel_id = """ + panel_id + """
            WHERE st.id IS NOT NULL
            ORDER BY st.id;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

# instantiate the application
app = web.application(urls, locals())
