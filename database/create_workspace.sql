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
    workspace_name_id INTEGER NOT NULL,
    persona_id INTEGER NOT NULL,
    url_name TEXT UNIQUE NOT NULL CHECK (url_name <> ''),
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE (workspace_name_id, persona_id, url_name)
);

INSERT INTO gestalt_workspace (workspace_name_id, persona_id, url_name, is_default) VALUES 
    (1, 1, '30bb1f348edf70cead2426e5762bc015', TRUE);
INSERT INTO gestalt_workspace (workspace_name_id, persona_id, url_name, is_default) VALUES 
    (2, 1, 'd7352676dcfc563ba04e6bc1de6236a2', FALSE);
INSERT INTO gestalt_workspace (workspace_name_id, persona_id, url_name, is_default) VALUES 
    (3, 1, 'a3c90460cd127a4df22fb8a7b792651c'), FALSE;
INSERT INTO gestalt_workspace (workspace_name_id, persona_id, url_name, is_default) VALUES 
    (2, 2, 'd8711880b39a55baf7f4b4fb29f031c6', FALSE);
INSERT INTO gestalt_workspace (workspace_name_id, persona_id, url_name, is_default) VALUES 
    (2, 3, '9ca944d898c7b5a1952110d66df48d0e', FALSE);
INSERT INTO gestalt_workspace (workspace_name_id, persona_id, url_name, is_default) VALUES 
    (2, 4, '7d483e685f8adaa808ed064c3abebafe', FALSE);


CREATE TABLE gestalt_workspace_panel (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL,
    panel_id INTEGER NOT NULL,
    is_default BOOLEAN FALSE,
    UNIQUE (workspace_id, panel_id)
);

INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (1, 1, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (1, 2, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (2, 1, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (3, 1, FALSE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (3, 5, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (4, 1, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (5, 1, TRUE);
INSERT INTO gestalt_workspace_panel(workspace_id, panel_id, is_default) VALUES
    (6, 1, TRUE);

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
