import web
import json
import psycopg2
from psycopg2.extras import RealDictCursor

urls = (
    
    # rest API backend endpoints
    "(.*)/persona/(.*)/", "panel_stories",
    "(.*)/", "all_stories"
    
)

connection_string = ""

class all_stories:
    def GET(self, persona_id):
        
        # connection string
        con_string = psycopg2.connect(connection_string)
        
        # postgres connector
        cursor = con_string.cursor(cursor_factory=RealDictCursor)
        
        # SQL query
        cursor.execute("""
            SELECT DISTINCT ON (st.id, st.name, st.url_name) st.id, st.name, st.url_name 
            FROM story st
            RIGHT JOIN persona_collection_story pcs
            ON st.id = pcs.story_id AND pcs.persona_id = """ + persona_id + """
            WHERE st.id IS NOT NULL
            ORDER BY st.id;
        """)        
        # get rows
        data = cursor.fetchall()
        
        return json.dumps(data)
    
class panel_stories:
    def GET(self, panel_param, persona_id):
        
        # connection string
        con_string = psycopg2.connect(connection_string)
        
        # postgres connector
        cursor = con_string.cursor(cursor_factory=RealDictCursor)
        
        # SQL query
        cursor.execute("""select distinct on (s.id) s.id,s.name,s.param from gestalt_story s,gestalt_collection c,gestalt_workspace wk where c.topics && s.topics and c.id = any(wk.topics) and wk.persona = """ + persona_id + """ and '""" + panel_param + """' = c.param;""")
        
        # get rows
        data = cursor.fetchall()
        
        return json.dumps(data)
    
app_story = web.application(urls, locals())