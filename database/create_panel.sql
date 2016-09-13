CREATE TABLE gestalt_panel (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    url_name TEXT UNIQUE NOT NULL CHECK (url_name <> ''),
    UNIQUE (name, url_name)
);
 
INSERT INTO gestalt_panel (name, url_name) VALUES
    ('contagion', md5(random()::text));
INSERT INTO gestalt_panel (name, url_name) VALUES
    ('tools', md5(random()::text));
INSERT INTO gestalt_panel (name, url_name) VALUES
    ('form', md5(random()::text));
INSERT INTO gestalt_panel (name, url_name) VALUES
    ('vulnerability', md5(random()::text));
INSERT INTO gestalt_panel (name, url_name) VALUES
    ('events', md5(random()::text));
INSERT INTO gestalt_panel (name, url_name) VALUES
    ('locations', md5(random()::text));
INSERT INTO gestalt_panel (name, url_name) VALUES
    ('scenarios', md5(random()::text));


CREATE TABLE gestalt_workspace_panel_story ( 
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL,
    panel_id INTEGER NOT NULL,
    story_id INTEGER NOT NULL,
    UNIQUE (workspace_id, panel_id, story_id)
);
 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (1, 2, 5);
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (1, 3, 6);
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (2, 1, 1);
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (2, 1, 2);
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (2, 1, 4);
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (2, 4, 3); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (3, 2, 5); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (3, 3, 6); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (4, 1, 1); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (4, 1, 2); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (4, 1, 4); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (4, 4, 3); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (4, 7, 10); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (4, 7, 11); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (5, 5, 12); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (5, 5, 14); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (5, 6, 13); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (5, 7, 8); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (6, 2, 5); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (6, 2, 7); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (6, 2, 9); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (6, 3, 6); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (6, 3, 8); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (6, 3, 10); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (6, 3, 11); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (7, 1, 1); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (7, 1, 2); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (7, 1, 4); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (7, 4, 3); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (7, 7, 10); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (7, 7, 11); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (8, 5, 12);
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (8, 5, 14);
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (8, 6, 10);
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (8, 6, 11);
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (8, 6, 13);
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (8, 7, 8); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (9, 2, 5); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (9, 2, 7); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (9, 2, 9); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (9, 3, 6); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (9, 3, 8); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (9, 3, 10); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (9, 3, 11); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (10, 5, 12); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (10, 5, 14); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (10, 6, 10); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (10, 6, 11); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (10, 6, 13); 
INSERT INTO gestalt_workspace_panel_story (workspace_id, panel_id, story_id) VALUES
    (10, 7, 8); 


CREATE TABLE gestalt_panel_tag (
    panel_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (panel_id, tag_id)
);

INSERT INTO gestalt_panel_tag 
    (panel_id, tag_id)
SELECT DISTINCT pcs.panel_id, st.tag_id 
    FROM gestalt_story_tag st
    RIGHT JOIN gestalt_workspace_panel_story pcs
    ON pcs.story_id = st.story_id
;