#!/bin/bash
# build for Mac OS

# install node
brew install node 

# install latest npm
sudo npm install --global npm@latest

# install yo, bower, grunt
sudo npm install --global yo bower grunt-cli

# install karma for unit test
sudo npm install grunt-karma --save-dev

# install imagemin to optimize .png and .jpg on runtime when using Grunt
sudo npm install grunt-contrib-imagemin@latest --save-dev

# if you wanted a python RESTful api in your web app
sudo easy_install web.py

# install locally
sudo npm express body-parser pg
