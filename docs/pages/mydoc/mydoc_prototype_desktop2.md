---
title: Desktop Prototype
keywords: desktop prototype
last_updated: July 18, 2016
tags: [prototypes]
summary: "Instructions about the desktop prototype and how to use it"
sidebar: mydoc_sidebar
permalink: mydoc_prototype_desktop2.html
folder: mydoc
simple_map: true
map_name: desktop_map
box_number: 2
---

## Running the App Locally

```
cd [appFolder]
python app.py
```

Frontend files are available at `127.0.0.1:8000`

API is available at `127.0.0.1:8000/api/..` The API will query the database if the
endpoints existed.

## List of Endpoints

If you are unfamiliar what these endpoints supposed to represent, please checkout 
the [UI schema](mydoc_schema_ui.html) or the [creation of the UI tables](mydoc_dataset_ui.html)
for more information.

### Persona

1. `127.0.0.1:8000/api/persona/` lists all the personas.
2. `127.0.0.1:8000/api/persona/#/, where # == persona.id` extracts the persona with the specific persona's id.

### Story

1. `127.0.0.1:8000/api/story/` lists all the stories.
2. `127.0.0.1:8000/api/story/#/, where # == story.id` extracts the story with the specific story's id.
3. `127.0.0.1:8000/api/story/persona/#/, where # == persona.id` lists all the stories for a particular persona.
4. `127.0.0.1:8000/api/story/persona/#/panel/#/, where first # == persona.id and second # == panel.id` lists  all the stories from a specific panel with a particular persona.

### Panel

1. `127.0.0.1:8000/api/panel/` lists all the panels.
2. `127.0.0.1:8000/api/panel/#/, where # == panel.id` extracts the panel with the specific panel's id.
3. `127.0.0.1:8000/api/panel/persona/#/, where # == persona.id` lists all the panels for a particular persona.

### Workspace

1. `127.0.0.1:8000/api/workspace/workspace_name` lists all the workspace's names.
2. `127.0.0.1:8000/api/workspace/` lists all the workspaces.
3. `127.0.0.1:8000/api/workspace/#/, where # == workspace.id` extracts a single workspace with a specific workspace's id.
4. `127.0.0.1:8000/api/workspace/persona/#/, where # == persona.id` lists all the workspaces for a particular persona.
5. `127.0.0.1:8000/api/workspace/#/panels/, where # == workspace.id` lists all the panels for a particular workspace.

### Tag

1. `127.0.0.1:8000/api/tag/` lists all the tags.
2. `127.0.0.1:8000/api/tag/#/, where # == tag.id` extracts a tag with a specific tag's id.
3. `127.0.0.1:8000/api/tag/story/#/, where # == story.id` lists all from a specific story.
4. `127.0.0.1:8000/api/tag/#/story/, where # == tag.id` lists all the stories with a particular tag.
5. `127.0.0.1:8000/api/tag/panel/#/, where # == panel.id` lists all the tags from a single panel.
6. `127.0.0.1:8000/api/tag/#/panel/, where # == tag.id` lists all the panels with a particular tag.
7. `127.0.0.1:8000/api/tag/workspace/#/, where # == workspace.id` lists all the tags from a single workspace.
8. `127.0.0.1:8000/api/tag/#/workspace/, where # == tag.id` lists all the workspaces with a particular tag.
