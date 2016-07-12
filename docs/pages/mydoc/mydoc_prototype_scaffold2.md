---
title: Scaffold
keywords: scaffold
last_updated: July 18, 2016
tags: [prototypes]
summary: "Instructions on how to build the basic prototype using scaffold"
sidebar: mydoc_sidebar
permalink: mydoc_prototype_scaffold2.html
folder: mydoc
simple_map: true
map_name: scaffold_map
box_number: 2
---

## Installation Instructions

We use [Yeoman](http://yeoman.io/ "Yeoman.io") to scaffold modern web applications. 
Using Yeoman, we will create a set of custom generators built for the 
[Lab41 Gestalt Challenge](http://www.lab41.org/work/ "Lab41 Work").

### Install Dependencies

We have written a script called install-dependencies.sh to install dependencies on 
your behalf. You have to specify the operating system where you will run the script. 
The example below is for Mac OS.  Please replace "mac" to "windows" for Windows or 
"ubuntu" for Ubuntu. 

Currently we have only implemented the script for Mac OS.

```
git clone https://github.com/Lab41/gestalt.git
./gestalt/scripts/mac/install-dependencies.sh
```

### Install Gestalt Generators

```
cd gestalt/scaffolds/generator-gestalt

/* this makes the generator globally available */
sudo npm link
```

{% include links.html %}
