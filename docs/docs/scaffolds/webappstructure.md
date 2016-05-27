Because we use Angular 1.0, the controllers are closely tied to the layout implementation.
We attempt to correlate the controller to the layout implementation so that it is easier 
for you to follow the application structure.

# Desktop

## app-controller
![app-controller](imgs/scaffold-desktop-app.png "App Controller")

The **app-controller** controls the highest level data like 
global navigation and application info, i.e. like "about".

## panel-controller
![panel-controller](imgs/scaffold-desktop-panel.png "Panel Controller")

The **panel-controller** controls each panel and is a child of the **app-controller**, 
which is the highest-level of grouping in the app. The stylistic size/position of each 
panel is determined by CSS. The example here is of 2 panels and could be 3 or 6, or even 1, etc.

## story-controller
![story-controller](imgs/scaffold-desktop-story.png "Story Controller")

The **story-controller** controls each story and is a child of the **panel-controller**. 
A story should be a concise collection of data with a specific scope and content which is TBD.

# Tablet

## app-controller
![app-controller](imgs/scaffold-mobile-app.png "App Controller")

The **app-controller** controls the highest level data like global navigation 
and application info, i.e. like the side menu.

## panel-controller
![panel-controller](imgs/scaffold-mobile-panel.png "Panel Controller")

The **panel-controller** controls each panel and is a child of the **app-controller**, 
which is the highest-level of grouping in the app. For mobile, it is likely that 
there is only a single panel dedicated to the entire viewport, but that doesn't have 
to be the case.

## story-controller
![story-controller](imgs/scaffold-mobile-story.png "Story Controller")

The **story-controller** controls each story and is a child of the **panel-controller**. 
A story should be a concise collection of data with a specific scope and content which is TBD. 
The image simply represents several stories in a single panel; however it is possible that a 
story in a mobile format would take over the entire viewport.