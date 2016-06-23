import json
import web
import persona
import workspace
import story

urls = (
    
    # rest API backend endpoints
    "/api/workspace/", workspace.app_workspaces,
    "/api/data/stories/", story.app_story,
    "/api/persona/", persona.app_persona,

    # front-end routes to load angular app
    "/", "index",
    "/(.+)", "www"
)

class appConfig(web.application):
	def run(self, port=8000, *middleware):
		func = self.wsgifunc(*middleware)
		return web.httpserver.runsimple(func, ("127.0.0.1", port))

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
