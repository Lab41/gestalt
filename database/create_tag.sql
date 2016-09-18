-- TODO: tags need to be updated

/* 
   ------------------------------------------------------------------------- 
   gestalt_tag
   This table lists the tag names to be given to a story/panel/workspace.
   * id: tag id
   * name: tag name
  -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_tag (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)
);

INSERT INTO gestalt_tag (name) 
    SELECT x FROM unnest(ARRAY[
        'contagion',
        'vulnerability',
        'visualization',
        'data science',
        'economics',
        'visualization tools',
        'visualization form',
        'social media',
        'olympics'
    ]) x;

/* 
   ------------------------------------------------------------------------- 
   gestalt_story_tag
   This table attaches a tag to a story. A story can have multiple tags.
   * story_id: story id in gestalt_story table
   * tag_id: tag id in gestalt_tag table
  -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_story_tag (
    story_id INTEGER REFERENCES gestalt_story(id),
    tag_id INTEGER REFERENCES gestalt_tag(id),
    PRIMARY KEY (story_id, tag_id)
);

INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (1, 1);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (1, 5);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (2, 1);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (2, 5);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (3, 2);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (3, 5);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (4, 1);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (4, 5);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (5, 3);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (5, 4);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (5, 6);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (6, 3);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (6, 7);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (7, 3);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (7, 4);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (8, 3);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (9, 3);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (9, 4);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (9, 6);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (9, 7);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (10, 4);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (10, 8);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (11, 4);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (11, 8);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (12, 8);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (12, 9);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (13, 4);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (13, 8);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (14, 9);

/* 
   ------------------------------------------------------------------------- 
   gestalt_panel_tag
   This table attaches a tag to a panel. A panel can have multiple tags.
   The panel tags derive from the panel's stories' tags.
   * panel_id: panel id in gestalt_panel table
   * tag_id: tag id in gestalt_tag table
  -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_panel_tag (
    panel_id INTEGER REFERENCES gestalt_panel(id),
    tag_id INTEGER REFERENCES gestalt_tag(id),
    PRIMARY KEY (panel_id, tag_id)
);

INSERT INTO gestalt_panel_tag 
    (panel_id, tag_id)
SELECT DISTINCT pcs.panel_id, st.tag_id 
    FROM gestalt_story_tag st
    RIGHT JOIN gestalt_workspace_panel_story pcs
    ON pcs.story_id = st.story_id
;

/* 
   ------------------------------------------------------------------------- 
   gestalt_workspace_tag
   This table attaches a tag to a workspace. A workspace can have multiple 
   tags. The workspace tags derive from the workspace's panels' tags.
   * workspace_id: workspace id in gestalt_workspace table
   * tag_id: tag id in gestalt_tag table
  -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_workspace_tag(
    workspace_id INTEGER REFERENCES gestalt_workspace(id),
    tag_id INTEGER REFERENCES gestalt_tag(id),
    PRIMARY KEY (workspace_id, tag_id)
);

INSERT INTO gestalt_workspace_tag
    (workspace_id, tag_id)
SELECT DISTINCT wp.workspace_id, pt.tag_id 
    FROM gestalt_panel_tag pt
    RIGHT JOIN gestalt_workspace_panel wp
    ON wp.panel_id = pt.panel_id
;