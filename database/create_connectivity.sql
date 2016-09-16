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

CREATE TABLE gestalt_workspace_panel (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL,
    panel_id INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE (workspace_id, panel_id)
);

INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (1, 1, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (1, 2, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (2, 3, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (3, 4, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (4, 5, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (5, 1, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (5, 2, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (6, 3, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (7, 4, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (8, 5, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (9, 1, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (9, 2, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (10, 3, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (11, 4, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (12, 5, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (13, 1, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (13, 2, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (14, 3, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (15, 4, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (16, 5, TRUE);

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

CREATE TABLE gestalt_wp_story ( 
    id SERIAL PRIMARY KEY,
    wp_id INTEGER NOT NULL,
    story_id INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE (wp_id, story_id)
);
 
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (1, 2, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (2, 4, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (3, 3, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (4, 4, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (5, 4, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (6, 2, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (7, 4, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (8, 3, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (9, 4, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (10, 4, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (11, 2, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (12, 4, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (13, 3, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (14, 4, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (15, 4, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (16, 2, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (17, 4, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (18, 3, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (19, 4, TRUE);
INSERT INTO gestalt_wp_story (wp_id, story_id, is_default) VALUES
    (20, 4, TRUE);

/* 
   ------------------------------------------------------------------------- 
   gestalt_story_vis
   -------------------------------------------------------------------------
 */


CREATE TABLE gestalt_story_vis ( 
    id SERIAL PRIMARY KEY,
    story_id INTEGER NOT NULL,
    vis_id INTEGER NOT NULL,
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

