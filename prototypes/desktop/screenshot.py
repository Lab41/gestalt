import json
import os
import psycopg2
import psycopg2.extras
import web

import helper
import ast

urls = (
    
    # 0.0.0.0:8000/api/screenshot/viewport/#/#/
    #   where first # == width (in pixels), second # == height (in pixels)
    "viewport/(.*)/(.*)/", "postViewport"

)

class postViewport:
    """ Post info needed to create screenshot of active viewport.
    input:
        * width
        * height
    output:
        * nothing probably?
    """
    def POST(self, width, height):
        
        # get values from post
        url_data = ast.literal_eval(web.data())
        
        width = url_data["width"]
        height = url_data["height"]
        url = url_data["url"]
        
        # do something with values here

# instantiate the application
app = web.application(urls, locals())
