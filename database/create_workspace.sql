CREATE TABLE gestalt_workspace_name (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)
);
 
INSERT INTO gestalt_workspace_name (name) VALUES 
    ('gestalt');
INSERT INTO gestalt_workspace_name (name) VALUES 
    ('economics');
INSERT INTO gestalt_workspace_name (name) VALUES 
    ('olympics');


CREATE TABLE gestalt_workspace (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER NOT NULL,
    workspace_name_id INTEGER NOT NULL,
    url_name TEXT UNIQUE NOT NULL CHECK (url_name <> ''),
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE (workspace_name_id, persona_id, url_name)
);

INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (1, 1, md5(random()::text), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (1, 2, md5(random()::text), TRUE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (2, 1, md5(random()::text), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (2, 2, md5(random()::text), TRUE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (2, 3, md5(random()::text), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (3, 1, md5(random()::text), TRUE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (3, 2, md5(random()::text), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (3, 3, md5(random()::text), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (4, 1, md5(random()::text), FALSE);
INSERT INTO gestalt_workspace (persona_id, workspace_name_id, url_name, is_default) VALUES 
    (4, 3, md5(random()::text), TRUE);


CREATE TABLE gestalt_workspace_panel (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL,
    panel_id INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE (workspace_id, panel_id)
);

INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (1, 2, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (1, 3, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (2, 1, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (2, 4, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (3, 2, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (3, 3, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (4, 1, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (4, 4, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (4, 7, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (5, 5, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (5, 6, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (5, 7, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (6, 2, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (6, 3, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (7, 1, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (7, 4, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (7, 7, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (8, 5, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (8, 6, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (8, 7, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (9, 2, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (9, 3, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (10, 5, FALSE);    
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (10, 6, TRUE);  
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (10, 7, FALSE);  


CREATE TABLE gestalt_workspace_tag(
    workspace_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (workspace_id, tag_id)
);

INSERT INTO gestalt_workspace_tag
    (workspace_id, tag_id)
SELECT DISTINCT wp.workspace_id, pt.tag_id 
    FROM gestalt_panel_tag pt
    RIGHT JOIN gestalt_workspace_panel wp
    ON wp.panel_id = pt.panel_id
;
