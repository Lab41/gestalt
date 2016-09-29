import json
import web

import panel
import persona
import story
import tag
import workspace
import visualization
import data_economic
#import screenshot

urls = (

    "/api/persona/", persona.app,
    "/api/workspace/", workspace.app,
    "/api/panel/", panel.app,
    "/api/data/story/", story.app,
    "/api/tag/", tag.app,
    "/api/data/visualization/", visualization.app,
    "/api/data/economic/", data_economic.app,
  #  "/api/screenshot/", screenshot.app,

    # front-end routes to load angular app
    "/", "index",
    "/(.+)", "www"
)

class appConfig(web.application):
	def run(self, port=8000, *middleware):
		func = self.wsgifunc(*middleware)
		return web.httpserver.runsimple(func, ("0.0.0.0", port))

class www:
    def GET(self, filename):
        try:
            f = open('www/' + filename)
            if filename.endswith(".css"):
                web.header("Content-Type","text/css")
            return f.read() # or return f.read() if you're using 0.3
        except IOError: # No file named that
            web.notfound()
            
class index:
    def GET(self):
        try:
            f = open("www/index.html")
            return f.read()
        except IOError:
            web.notfound()
            
if __name__ == "__main__":
    app = appConfig(urls, globals())
    app.run()
