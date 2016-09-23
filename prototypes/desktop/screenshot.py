import json
import os
import psycopg2
import psycopg2.extras
import web
import os
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
        #print width
        height = url_data["height"]
        #print height
        url = url_data["url"]
        #print url
        # insert code into screenshot.js
        fo=open("screenshot.js","wb")
        code="var page = require('webpage').create(); page.viewportSize = { width: "+str(width)+", height: "+str(height)+" }; page.open('"+ url+"', function(status) { setTimeout(function(){ page.render('viz3.png'); console.log('completed'); phantom.exit(); },1000); });"
        fo.write(code)
        fo.close()
        os.system('phantomjs screenshot.js')

# instantiate the application
app = web.application(urls, locals())
