import json
import os
import psycopg2
import psycopg2.extras
import web

import helper

urls = (

    # 0.0.0.0:8000/api/persona/
    "", "all_personas",
    # 0.0.0.0:8000/api/persona/#/, where # == persona.id
    "(\d+)/", "single_persona",
    
)
        
class all_personas:
    """ Extract all the personas.
    output:
        * persona.id
        * persona.name
        * persona.description
        * persona.type
    """
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT p.*,
                pt.name as persona_type
            FROM gestalt_persona p
            LEFT JOIN gestalt_persona_type pt on pt. id = p.persona_type;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # close cursor and connection
        connection.close()
        self.cursor.close()
        # convert data to a string
        return json.dumps(data)

class single_persona:
    """ Extract a persona with a specific id.
    input:
        * persona.id
    output:
        * persona.id
        * persona.name
        * persona.description
    """
    def GET(self, persona_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)    
        # execute query
        self.cursor.execute("""
            SELECT * 
            FROM gestalt_persona AS persona
            WHERE persona.id = """ + persona_id + """;
        """)
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)


# instantiate the application
app = web.application(urls, locals())
