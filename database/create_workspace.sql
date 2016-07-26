CREATE TABLE workspace_name (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)
);
 
INSERT INTO workspace_name (name) VALUES 
    ('gestalt');
INSERT INTO workspace_name (name) VALUES 
    ('economics');
INSERT INTO workspace_name (name) VALUES 
    ('olympics');

CREATE TABLE workspace (
    id SERIAL PRIMARY KEY,
    workspace_name_id INTEGER NOT NULL,
    persona_id INTEGER NOT NULL,
    url_name TEXT UNIQUE NOT NULL CHECK (url_name <> ''),
    UNIQUE (workspace_name_id, persona_id, url_name)
);

INSERT INTO workspace (workspace_name_id, persona_id, url_name) VALUES 
    ('1', '1', '30bb1f348edf70cead2426e5762bc015');
INSERT INTO workspace (workspace_name_id, persona_id, url_name) VALUES 
    ('2', '1', 'd7352676dcfc563ba04e6bc1de6236a2');
INSERT INTO workspace (workspace_name_id, persona_id, url_name) VALUES 
    ('3', '1', 'a3c90460cd127a4df22fb8a7b792651c');
INSERT INTO workspace (workspace_name_id, persona_id, url_name) VALUES 
    ('2', '2', 'd8711880b39a55baf7f4b4fb29f031c6');
INSERT INTO workspace (workspace_name_id, persona_id, url_name) VALUES 
    ('2', '3', '9ca944d898c7b5a1952110d66df48d0e');
INSERT INTO workspace (workspace_name_id, persona_id, url_name) VALUES 
    ('2', '4', '7d483e685f8adaa808ed064c3abebafe');


CREATE TABLE workspace_panel (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL,
    panel_id INTEGER NOT NULL,
    is_default BOOLEAN NOT NULL,
    UNIQUE (workspace_id, panel_id)
);

INSERT INTO workspace_panel(workspace_id, panel_id, is_default) VALUES
    ('1', '1', FALSE);
INSERT INTO workspace_panel(workspace_id, panel_id, is_default) VALUES
    ('1', '2', TRUE);
INSERT INTO workspace_panel(workspace_id, panel_id, is_default) VALUES
    ('2', '1', TRUE);
INSERT INTO workspace_panel(workspace_id, panel_id, is_default) VALUES
    ('3', '1', FALSE);
INSERT INTO workspace_panel(workspace_id, panel_id, is_default) VALUES
    ('3', '5', TRUE);
INSERT INTO workspace_panel(workspace_id, panel_id, is_default) VALUES
    ('4', '1', TRUE);
INSERT INTO workspace_panel(workspace_id, panel_id, is_default) VALUES
    ('5', '1', TRUE);
INSERT INTO workspace_panel(workspace_id, panel_id, is_default) VALUES
    ('6', '1', TRUE);

CREATE TABLE workspace_tag (
    workspace_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (workspace_id, tag_id)
);

INSERT INTO workspace_tag 
    (workspace_id, tag_id)
SELECT DISTINCT wp.workspace_id, pt.tag_id 
    FROM panel_tag pt
    RIGHT JOIN workspace_panel wp
    ON wp.panel_id = pt.panel_id
;
