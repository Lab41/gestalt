/* 
   ------------------------------------------------------------------------- 
   gestalt_workspace_panel
   This table lists the relationship between a workspace and a panel. 
   * workspace_id: workspace id in gestalt_workshop_table
   * panel_id: panel id in gestalt_panel_table
   * is_default: label the panel as the default
   *     When you go to a workspace, you want to show the default panel
   *     first. 
   -------------------------------------------------------------------------
 */

DROP TABLE IF EXISTS gestalt_workspace_panel CASCADE;

CREATE TABLE gestalt_workspace_panel (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER REFERENCES gestalt_workspace(id),
    panel_id INTEGER REFERENCES gestalt_panel(id),
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE (workspace_id, panel_id)
);

CREATE UNIQUE INDEX only_one_default_panel_check
  ON gestalt_workspace_panel(workspace_id)
  WHERE is_default = TRUE;

INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (1, 1, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (1, 2, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (2, 1, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (2, 2, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (3, 1, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (3, 2, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (4, 1, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (4, 2, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (5, 3, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (6, 3, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (7, 3, TRUE);

/* 
   ------------------------------------------------------------------------- 
   gestalt_wp_story
   This table lists the relationship between a panel and a story depending
   on what the workspace is.
   * wp_id: workspace-panel id in gestalt_workspace_panel table
   * story_id: story id in gestalt_story table
   * is_default: label the story as the default
   *     When you go to a panel, you want to show the default story first.
   -------------------------------------------------------------------------
 */

DROP TABLE IF EXISTS gestalt_wp_story;

CREATE TABLE gestalt_wp_story ( 
    id SERIAL PRIMARY KEY,
    wp_id INTEGER REFERENCES gestalt_workspace_panel(id),
    story_id INTEGER REFERENCES gestalt_story(id),
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE (wp_id, story_id)
);

CREATE UNIQUE INDEX only_one_default_story_check
  ON gestalt_wp_story(wp_id)
  WHERE is_default = TRUE;
 
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (1, 2, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (2, 1, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (3, 2, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (4, 1, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (5, 2, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (6, 1, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (7, 2, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (8, 1, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (9, 3, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (10, 3, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (11, 3, TRUE);

/* 
   ------------------------------------------------------------------------- 
   gestalt_story_vis
   -------------------------------------------------------------------------
 */


CREATE TABLE gestalt_story_vis ( 
    id SERIAL PRIMARY KEY,
    story_id INTEGER REFERENCES gestalt_story(id),
    vis_id INTEGER REFERENCES gestalt_vis(id),
    order_num INTEGER DEFAULT 1,
    UNIQUE (story_id, vis_id)
);

INSERT INTO gestalt_story_vis (story_id, vis_id) VALUES
    (1, 3);
INSERT INTO gestalt_story_vis (story_id, vis_id) VALUES
    (2, 3);
INSERT INTO gestalt_story_vis (story_id, vis_id) VALUES
    (3, 2);
INSERT INTO gestalt_story_vis (story_id, vis_id) VALUES
    (4, 4);

