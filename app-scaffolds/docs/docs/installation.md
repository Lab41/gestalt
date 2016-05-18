To generate a modern web app we prefer to use [Yeoman](http://yeoman.io/ "Yeoman.io"). Yeoman is a scaffolding tool for modern web apps. You scaffold an app by running a generator. This documentation is for a set of custom generators built for the [Lab41 Gestalt Challenge](http://www.lab41.org/work/ "Lab41 Work").

For documentation we like to use [mkDocs](http://www.mkdocs.org/ "mkDocs").

# Install dependencies
```
npm install -g npm
npm install -g yo

/* if you want a python RESTful api in your web app */
easy_install web.py

/* if you want to launch the documentation locaally */
pip install mkdocs
```

# Install gestalt generators
```
git clone https://github.com/Lab41/gestalt.git
cd gestalt/app-scaffolds/generator-gestalt

/* this makes the generator globally available */
npm link
```