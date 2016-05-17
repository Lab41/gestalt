# gestalt
This challenge will employ various data visualization tools and user experience frameworks to construct cohesive data stories focused on communicating ripple-effect scenarios.

# App Scaffolds
Yeoman Generators written to quickly scaffold modern web applications for desktop/tablet environments.

## Dependencies
* Node
* Yeoman
* web.py (if you choose a python backend)

## Installation

### Install dependencies
`npm install -g npm`
`npm install -g yo`

### Install gestalt generators
`git clone https://github.com/Lab41/gestalt.git`
`cd gestalt/app-scaffolds/generator-gestalt`
`npm link`

## Use

### Generate a web app from gestalt generators
`cd [working directory]`
`mkdir [appFolder]`
`cd [appFolder]`
`yo`

### Serve up web app

If you built a node.js API
`node app.js`

If you built a web.py API
`python app.py`