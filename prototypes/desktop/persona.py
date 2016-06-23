import web
import json
import psycopg2
from psycopg2.extras import RealDictCursor

urls = (
    
    # rest API backend endpoints
    "", "persona"
    
)

connection_string = ""
        
class persona:
    def GET(self):
        
        # connection string
        con_string = psycopg2.connect(connection_string)
        
        # postgres connector
        cursor = con_string.cursor(cursor_factory=RealDictCursor)
        
        # SQL query
        cursor.execute("""select * from gestalt_persona;""")
        
        # get rows
        data = cursor.fetchall()
        
        return json.dumps(data)
    
app_persona = web.application(urls, locals())