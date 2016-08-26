CREATE TABLE panel (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    url_name TEXT UNIQUE NOT NULL CHECK (url_name <> ''),
    UNIQUE (name, url_name)
);
 
INSERT INTO panel (name, url_name) VALUES
    ('contagion', '8fb281a2a171d8c7843a5c84b58aab9b');
INSERT INTO panel (name, url_name) VALUES
    ('tools', '00ffbf8cc4dfe548eb461b3ccea17090');
INSERT INTO panel (name, url_name) VALUES
    ('form', '67027c47f193b586dc0ba126330226d4');
INSERT INTO panel (name, url_name) VALUES
    ('vulnerability', '26dafed49b6fdc439bf4500e0e284348');
INSERT INTO panel (name, url_name) VALUES
    ('events', '6cb07d0874bb72bf170ca076c67f7b66');
INSERT INTO panel (name, url_name) VALUES
    ('locations', '9fb8f9edfd5e3fe331cb687cff067125');
INSERT INTO panel (name, url_name) VALUES
    ('scenarios', 'e631f95b974f98f7d1a52baf27bcd0e6');

CREATE TABLE persona_panel_story ( 
    id SERIAL PRIMARY KEY,
    persona_id INTEGER NOT NULL,
    panel_id INTEGER NOT NULL,
    story_id INTEGER NOT NULL,
    UNIQUE (persona_id, panel_id, story_id)
);
 
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 1, 1);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 1, 2);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 1, 4);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 2, 5);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 2, 9);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 3, 6);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 3, 9);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 4, 3);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 5, 10);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 5, 11);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 5, 12);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 5, 13);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 6, 12);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 6, 14);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 7, 12);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (1, 7, 14);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (2, 1, 1);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (2, 1, 2);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (2, 1, 4);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (3, 1, 1);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (3, 1, 2);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (3, 1, 4);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (4, 1, 1);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (4, 1, 2);
INSERT INTO persona_panel_story (persona_id, panel_id, story_id) VALUES
    (4, 1, 4);
 
CREATE TABLE panel_tag (
    panel_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (panel_id, tag_id)
);

INSERT INTO panel_tag 
    (panel_id, tag_id)
SELECT DISTINCT pcs.panel_id, st.tag_id 
    FROM story_tag st
    RIGHT JOIN persona_panel_story pcs
    ON pcs.story_id = st.story_id
;