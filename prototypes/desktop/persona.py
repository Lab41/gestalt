import json
import psycopg2
import psycopg2.extras
import web

urls = (
    
    # rest API backend endpoints
    "", "all_personas"
    
)
        
class all_personas:
    def GET(self):   
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""SELECT * FROM persona;""")
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

# instantiate the application
app_persona = web.application(urls, locals())