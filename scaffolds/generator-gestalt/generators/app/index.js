var generators = require("yeoman-generator");

module.exports = generators.Base.extend({

    // user prompts
    prompting: function() {
        
        var done = this.async();
        
        var prompts = [
            {
                type: "input",
                name: "application",
                message: "What is your application name?",
                default: this.appname // default to current folder name appname value is specific to the API
            },
			{
				type: "list",
				name: "api",
				message: "What kind of RESTful API do you want?",
				choices: ["node.js", "webpy"],
				default: this[0] // defaut to first option in list
			},
            {
                type: "list",
                name: "agent",
                message: "What are you building for?",
                choices: ["desktop", "tablet"],
                default: this[0] // default to first option in list
            },
			{
                type: "list",
                name: "theme",
                message: "What theme do you want?",
                choices: ["dark", "light"],
                default: this[0] // default to first option in list
            }
        ];
        
        this.prompt(prompts, function(answers) {
                        
            // assign answer variables to use in templating
            this.appName = answers.application;
			this.apiName = answers.api;
            this.agentName = answers.agent;
			this.themeName = answers.theme;
            
            done();
            
        }.bind(this));
        
    },
    
    // copy files create app structure
    writing: function() {
		
		//////////////////////////////
		////////// FRONTEND //////////
		//////////////////////////////
		
		if (this.agentName == "desktop") {

			//////////////////////
			// directory copies //
			//////////////////////

			this.directory("favicon", "www/favicon"); // favicons
			this.directory("desktop/css", "www/css"); // css styles
			this.directory("desktop/lib", "www/lib"); // libraries
			this.directory("desktop/html", "www/templates"); // html templates
			this.directory("desktop/js/controllers", "www/js/controllers") // angular controllers

			///////////////////////////////////
			// app specific structural items //
			///////////////////////////////////
			
			// index
			this.fs.copyTpl(
				this.templatePath("desktop/index.html"),
				this.destinationPath("www/index.html"),
				{
					appName: this.appName
				}
			);

			// theme styles
			this.fs.copyTpl(
				this.templatePath("css/" + this.themeName + ".css"),
				this.destinationPath("www/css/"  + this.themeName + ".css"),
				{
					themeName: this.themeName
				}
			);

			// app style
			this.fs.copyTpl(
				this.templatePath("desktop/css/app.css"),
				this.destinationPath("www/css/" + this.appName + ".css"),
				{
					appName: this.appName,
					themeName: this.themeName
				}
			);

			// angular js
			this.fs.copyTpl(
				this.templatePath("desktop/js/app.js"),
				this.destinationPath("www/js/app.js"),
				{
					appName: this.appName
				}
			);

			// controllers
			this.fs.copyTpl(
				this.templatePath("desktop/js/controllers/login-controller.js"),
				this.destinationPath("www/js/controllers/login-controller.js")
			);
			
		} else if (this.agentName == "tablet") {
			
			//////////////////////
			// directory copies //
			//////////////////////

			this.directory("mobile/css", "www/css"); // css styles
			this.directory("mobile/lib", "www/lib"); // libraries
			this.directory("mobile/html/tablet", "www/templates"); // html templates
			this.directory("routes/api", "www/api"); // dummy api
			this.directory("mobile/js/controllers", "www/js/controllers") // angular controllers

			///////////////////////////////////
			// app specific structural items //
			///////////////////////////////////
			
			// index
			this.fs.copyTpl(
				this.templatePath("mobile/index.html"),
				this.destinationPath("www/index.html"),
				{
					appName: this.appName
				}
			);
			
			// theme styles
			this.fs.copyTpl(
				this.templatePath("css/" + this.themeName + ".css"),
				this.destinationPath("www/css/"  + this.themeName + ".css"),
				{
					themeName: this.themeName
				}
			);

			// app style
			this.fs.copyTpl(
				this.templatePath("mobile/css/app.css"),
				this.destinationPath("www/css/" + this.appName + ".css"),
				{
					appName: this.appName,
					themeName: this.themeName
				}
			);
			
			// angular js
			this.fs.copyTpl(
				this.templatePath("mobile/js/app.js"),
				this.destinationPath("www/js/app.js"),
				{
					appName: this.appName
				}
			);
			
			this.fs.copyTpl(
				this.templatePath("mobile/js/controllers/login-controller.js"),
				this.destinationPath("www/js/controllers/login-controller.js")
			);
			
		};
		
		//////////////
		/// shared ///
		//////////////
		
		this.directory("routes", "routes"); // API routes
		this.directory("css", "www/css"); // global styles
		this.directory("js/services", "www/js/services"); // angular factories
		this.directory("js/controllers", "www/js/controllers"); // angular controllers
		this.directory("lib", "www/lib"); // libraries
		this.directory("../../../../docs", "docs") // docs
		
		// api configs
		this.fs.copyTpl(
			this.templatePath("js/config.js"),
			this.destinationPath("www/js/config.js")
		);
		
		// angular controllers
		this.fs.copyTpl(
			this.templatePath("js/generator-angular.controllers.js"),
			this.destinationPath("www/js/" + this.appName + ".controllers.js"),
			{
				appName: this.appName
			}
		);

		this.fs.copyTpl(
			this.templatePath("desktop/js/controllers/login-controller.js"),
			this.destinationPath("www/js/controllers/login-controller.js")
		);

		// angular directives
		this.fs.copyTpl(
			this.templatePath("js/generator-angular.directives.js"),
			this.destinationPath("www/js/" + this.appName + ".directives.js"),
			{
				appName: this.appName
			}
		);

		// angular services
		this.fs.copyTpl(
			this.templatePath("js/generator-angular.services.js"),
			this.destinationPath("www/js/" + this.appName + ".services.js"),
			{
				appName: this.appName
			}
		);
		
		/////////////////////////////
		////////// BACKEND //////////
		/////////////////////////////
		
		if (this.apiName == "node.js") {

			// express server
			this.fs.copyTpl(
				this.templatePath("app.js"),
				this.destinationPath("app.js")
			);

			this.fs.copyTpl(
				this.templatePath("routes/index.js"),
				this.destinationPath("routes/index.js")
			);
			
		} else {
			
			// web.py server
			this.fs.copyTpl(
				this.templatePath("app.py"),
				this.destinationPath("app.py")
			);
			
		};
        
    },
    
    // alert user
    end: function() {
		
		// check api
		if (this.apiName == "node.js") {
			
			this.log("Success! Run your app with `node app.js`");
			
		} else {
        
			this.log("Success! Run your app with `python app.py`");
			
		};
    }/*,
    
    // install local to project
    install: function() {
        
        // npm & bower installation
        this.installDependencies();
        
    }*/
    
});