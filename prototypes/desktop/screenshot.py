import json
import os
import psycopg2
import psycopg2.extras
import web
import os
import helper
import ast
import time

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
        web_url = url_data["url"]
        #print url
        timestr = time.strftime("%Y%m%d-%H%M%S")
        #print timestr

        current_dir =  os.path.abspath(os.path.dirname(__file__))
        parent_dir = os.path.abspath(current_dir + "/../")
        print current_dir
        print parent_dir
        img_name = "screenshot-"+timestr
        img_url = current_dir+"/www/"+img_name+'.png'
        print img_url
        # insert code into screenshot.js
        fo=open("screenshot.js","wb")
        code="var page = require('webpage').create(); page.viewportSize = { width: "+str(width)+", height: "+str(height)+" }; page.open('"+ web_url+"', function(status) { setTimeout(function(){ page.render('"+img_url+"'); console.log('completed'); phantom.exit(); },1000); });"
        fo.write(code)
        fo.close()
        os.system('phantomjs screenshot.js')
        return "http://0.0.0.0:8000/"+img_name+".png"

# instantiate the application
app = web.application(urls, locals())
