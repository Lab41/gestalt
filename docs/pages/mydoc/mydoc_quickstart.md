---
title: Quick Start
keywords: gestalt, quick start
last_updated: July 18, 2016
tags: [getting_started]
sidebar: mydoc_sidebar
permalink: mydoc_quickstart.html
folder: mydoc
---

## Desktop

Make sure you first set the following environment variable:

```
export DATABASE_URL=$DATABASE_NAME,$DATABASE_USER,$DATABASE_HOST,$DATABASE_PASSWORD,$DATABASE_PORT
```

Then, after retrieiving the project from GitHub, run the following command:

```
gestalt/scripts/install-dependencies.sh
cd gestalt/prototypes/desktop
python app.js
```

After running the following command, go to your browser and input 
`127.0.0.1:8000` to play around with the desktop prototype.

### Current Build

The current build utilizes Angular 1.0 as the frontend and webpy RESTful API as the backend. 
It takes the data from PostgreSQL database which resides in the OpenStack Server. 

### Future Build

The future build will utilize Angular 1.0 as the frontend and Django as the backend. 
Since we are going to ingest large numbers of data, processing these data will 
consume a lot of time. For this reason, we need additional backend besides Django to 
run our tasks asynchronously because Django cannot run very long processes.

Our hope is that we can integrate Celery with Django since Celery is meant to handle
asynchronous tasks. We will then connect Celery to Spark to process the big data.
The data will then be fed from PostgreSQL database. The database will still reside
in the OpenStack Server.

This development is currently being implemented in a separate 
[repo](https://github.com/tiffanyj41/adp). Instructions will be updated after integration.

## Tablet

Make sure you first set the following environment variable:

```
export DATABASE_URL=$DATABASE_NAME,$DATABASE_USER,$DATABASE_HOST,$DATABASE_PASSWORD,$DATABASE_PORT
```

Then, after retrieving the project from GitHub, run the following command:

```
gestalt/scripts/install-dependencies.sh
cd gestalt/prototypes/tablet
node app.js
```
After running the following command, go to your browser and input 
`127.0.0.1:8001` to play around with the tablet prototype.

### Current Build

The current build utilizes Angular 1.0 as the frontend and Node.js RESTful API as the backend. 
It takes the data from PostgreSQL database which resides in the OpenStack Server. 

{% include links.html %}

