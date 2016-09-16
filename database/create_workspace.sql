/* 
   ------------------------------------------------------------------------- 
   gestalt_workspace_name
   This table lists the workspace names.
   * id: workspace name id
   * name: workspace name
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_workspace_name (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)
);
 
INSERT INTO gestalt_workspace_name (name) VALUES 
    ('Gestalt');
INSERT INTO gestalt_workspace_name (name) VALUES 
    ('Economics');
INSERT INTO gestalt_workspace_name (name) VALUES 
    ('IP autonomous systems');
INSERT INTO gestalt_workspace_name (name) VALUES 
    ('SCN anomolies');

/* 
   ------------------------------------------------------------------------- 
   gestalt_workspace
   This table lists the workspaces. Since the url name of a workspace is 
   linked to a workspace for a particular persona, the table contains 
   information about the persona and the workspace.
   * persona_id: persona id in gestalt_persona table
   * workspace_name_id: workspace name id in gestalt_workspace_name table
   * url_name: the url used to refer to this workspace
   * is_default: label the workspace as the default
   *     When you login with a particular persona, you want to determine
   *     which workspace to show first. 
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_workspace (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER NOT NULL,
    workspace_name_id INTEGER NOT NULL,
    url_name TEXT UNIQUE NOT NULL CHECK (url_name <> ''),
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE (workspace_name_id, persona_id, url_name)
);

INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (1, 1, substring(md5(random()::text),0,6), TRUE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (1, 2, substring(md5(random()::text),0,6), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (1, 3, substring(md5(random()::text),0,6), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (1, 4, substring(md5(random()::text),0,6), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (2, 1, substring(md5(random()::text),0,6), TRUE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (2, 2, substring(md5(random()::text),0,6), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (2, 3, substring(md5(random()::text),0,6), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (2, 4, substring(md5(random()::text),0,6), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (3, 1, substring(md5(random()::text),0,6), TRUE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (3, 2, substring(md5(random()::text),0,6), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (3, 3, substring(md5(random()::text),0,6), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (3, 4, substring(md5(random()::text),0,6), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (4, 1, substring(md5(random()::text),0,6), TRUE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (4, 2, substring(md5(random()::text),0,6), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (4, 3, substring(md5(random()::text),0,6), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (4, 4, substring(md5(random()::text),0,6), FALSE);

