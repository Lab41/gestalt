import web
import json
import psycopg2
from psycopg2.extras import RealDictCursor

urls = (
    
    # rest API backend endpoints
    "persona/(.*)/", "all_workspaces",
    "(.*)/persona/(.*)/", "single_workspace"
    
)

connection_string = ""

class all_workspaces:
    def GET(self, persona_id):
        
        # connection string
        con_string = psycopg2.connect(connection_string)
        
        # postgres connector
        cursor = con_string.cursor(cursor_factory=RealDictCursor)
        
        # SQL query
        cursor.execute("""select wk.id,wk.param,wk.name,pa.name as persona,m.name as panel,t.param as default_panel,array_agg(row_to_json(r)) as panels from gestalt_workspace wk,gestalt_persona pa,gestalt_meta m,get_panels_by_id(wk.panel) t,get_panels_by_id(wk.panel) r where m.id = wk.panel and pa.id = wk.persona and pa.id = """ + persona_id + """ and t.id = wk.default_panel and r.id = any(wk.topics) group by wk.id,wk.param,wk.name,pa.name,m.name,t.param order by wk.name asc;""")
        
        # get rows
        data = cursor.fetchall()
        
        return json.dumps(data)
    
class single_workspace:
    def GET(self, workspace_param, persona_id):
        
        # connection string
        con_string = psycopg2.connect(connection_string)
        
        # postgres connector
        cursor = con_string.cursor(cursor_factory=RealDictCursor)
        
        # SQL query
        cursor.execute("""select wk.id,wk.param,wk.name,pa.name as persona,m.name as panel,t.param as default_panel,array_agg(row_to_json(r)) as panels from gestalt_workspace wk,gestalt_persona pa,gestalt_meta m,get_panels_by_id(wk.panel) t,get_panels_by_id(wk.panel) r where m.id = wk.panel and pa.id = wk.persona and pa.id = """ + persona_id + """ and t.id = wk.default_panel and r.id = any(wk.topics) and wk.param = '""" + workspace_param + """' group by wk.id,wk.param,wk.name,pa.name,m.name,t.param order by wk.name asc;""")
        
        # get rows
        data = cursor.fetchall()
        
        return json.dumps(data)
    
app_workspaces = web.application(urls, locals())