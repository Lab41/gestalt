---
title: UI Tables
keywords: database
last_updated: July 18, 2016
tags: [database]
sidebar: mydoc_sidebar
permalink: mydoc_dataset_ui.html
folder: mydoc
---

The creation of the tables has to follow in the order below. 

## Persona

The persona table lists the types of users that we will encounter when building a data story. 
You can find the creation of the persona's tables under `gestalt/database/create_persona.sql`.

## Tag

The tag table lists all tags. Each tag is used to tag a story. Think of a tag as a metadata that you are attaching to the story. The benefit of a tag is to help other users discover the story.  
You can find the creation of the tag's tables under `gestalt/database/create_tag.sql`.

## Story

The story table lists all the story webpages. Story is the smallest element of the UI framework. 
You can find the creation of the story's tables under `gestalt/database/create_story.sql`.

In addition to the story table, there is:

* story_tag: that lists the tags of each story

## Panel

The panel table lists all the panel webpages. Panel encapsulates a collection of stories. Think of a panel as the main topic that stories fall under.
You can find the creation of the panel's tables under `gestalt/database/create_panel.sql`.

In addition to the panel table, there are:

* persona_panel_story: that lists the relationship of how a particular story is linked to a particular panel and a particular persona
* panel_tag: that lists the tags of each panel

## Workspace

Workspaces are collections of stories. Workspace encapsulates multiple collections which in turn encapsulates multiple stories. 
You can find the creation of the workspace's tables under `gestalt/database/create_database.sql`.

The structure of the workspace table is different than the panel and story tables because both the persona
and the workspace are tied to the url. Panel's and story's url are not directly tied to the persona.

In addition to the workspace table, there are:

* workspace_panel: that lists the relationship of how a particular workspace is linked to a particular panel
* workspace_tag: that lists the tags of each workspace

{% include links.html %}
