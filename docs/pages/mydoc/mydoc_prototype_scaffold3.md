---
title: Scaffold
keywords: scaffold
last_updated: July 18, 2016
tags: [prototypes]
summary: "Instructions on how to build the basic prototype using scaffold"
sidebar: mydoc_sidebar
permalink: mydoc_prototype_scaffold3.html
folder: mydoc
simple_map: true
map_name: scaffold_map
box_number: 3
---

## Build a Prototype Instructions

 Make sure you have followed the instructions on the [Installation](mydoc_prototype_scaffold2.html) page to install the dependencies and generators.

### Generate a Web App

```
cd [working directory]
mkdir [appFolder]
cd [appFolder]
yo
```

#### Prompts

Yeoman will walk you through each in the CLI. 
{% include image.html file="scaffold-prompt.png" alt="Prompt Example" caption="Prompt Example" %}

* **Application name**: Expects a string with no spaces
* **RESTful API**: Expects a list selection; options are node (javascript) or web.py (python)
* **Build agent**: Expects a list selection; options are desktop or tablet
* **Theme**: Expects a list selection; options are light or dark

#### Build complete

You should see a long list of files created with a final success message. 
{% include image.html file="scaffold-complete.png" alt="Build Complete" caption="Build Complete" %}


### Serve App

If you built a node.js API, simply type into the CLI
`node app.js`

If you built a web.py API, simply type into the CLI
`python app.py`

Whether you chose a node.js or a web.py RESTful API, your front-end files will be available at `127.0.0.1:8000` and your API will be available at `127.0.0.1:8000/api/..`.

For example a default endpoint of `127.0.0.1:8000/api/data/app` should resolve with metadata about the application.

#### Error When Serving App

If you encountered the following error when serving the app 
`Error: Cannot find module 'express'`, install "express" locally.
```
sudo npm install express
```

{% include links.html %}
