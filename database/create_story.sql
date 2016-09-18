/* 
   ------------------------------------------------------------------------- 
   gestalt_story
   This table lists the stories and contains only information about the
   stories.
   * id: story id
   * name: story name
   * url_name: the url used to refer to this story
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_story (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    url_name TEXT UNIQUE NOT NULL CHECK (url_name <> ''),
    UNIQUE (name, url_name)
);

INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What tool to use for which data visualization task', 'which-tool');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What visual form best communicates your dataset', 'which-form');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What the network looks like', 'network');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('tbd', 'tbd');

/* 
   ------------------------------------------------------------------------- 
   gestalt_action_group
   This table lists the action name of the group. An idea can only perform 
   one collective set of actions. Action name refers to the name of a list 
   of actions an idea can perform.
   * id: action group id
   * name: name of the action group
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_action_group (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)
);

INSERT INTO gestalt_action_name (name) VALUES 
    ('cluster');
INSERT INTO gestalt_action_name (name) VALUES 
    ('size');
INSERT INTO gestalt_action_name (name) VALUES 
    ('link');
INSERT INTO gestalt_action_name (name) VALUES 
    ('demo');

/* 
   ------------------------------------------------------------------------- 
   gestalt_action_name
   This table lists all the actions that fall under an action name. 
   * id: action id
   * action_group_id: action group id that this action falls under
   * name: name of the action
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_action (
    id SERIAL PRIMARY KEY,
    action_group_id INTEGER REFERENCES gestalt_action(id),
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (action_name_id, name)
);

INSERT INTO gestalt_action (action_name_id, name) VALUES
    (1, 'region');
INSERT INTO gestalt_action (action_name_id, name) VALUES
    (1, 'investment');
INSERT INTO gestalt_action (action_name_id, name) VALUES
    (1, 'trade');
INSERT INTO gestalt_action (action_name_id, name) VALUES
    (1, 'export');
INSERT INTO gestalt_action (action_name_id, name) VALUES
    (1, 'default');
INSERT INTO gestalt_action (action_name_id, name) VALUES
    (1, 'country');
INSERT INTO gestalt_action (action_name_id, name) VALUES
    (2, 'equal');
INSERT INTO gestalt_action (action_name_id, name) VALUES
    (2, 'high degree');
INSERT INTO gestalt_action (action_name_id, name) VALUES
    (2, 'high centrality');
INSERT INTO gestalt_action (action_name_id, name) VALUES
    (3, 'none');
INSERT INTO gestalt_action (action_name_id, name) VALUES
    (3, 'unique targets');
 

/* 
   ------------------------------------------------------------------------- 
   gestalt_story_idea
   This table lists the ideas that make up a story. An idea can only fall
   under one story. An idea can only perform one collective actions. For 
   this reason, gestalt_story_idea table contains information about the 
   ideas as well as their respective story and action.
   * id: story idea id
   * title: title of the idea
   * subtitle: subtitle of the idea; it can be NULL
   * description: description of the idea
   * story_id: story id in gestalt_story table
   * action_id: action id in gestalt_story_action table
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_idea (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL CHECK (title <> ''),
    subtitle TEXT,
    description TEXT, 
    story_id INTEGER REFERENCES gestalt_story(id), 
    action_id INTEGER REFERENCES gestalt_action(id),
    UNIQUE (title, story_id, action_id)
);

INSERT INTO gestalt_idea (title, subtitle, description, story_id, action_id) VALUES 
    ('Neque lorem cursus curabitur vulputate quis iaculis', 
     'grouping', 
     'Augue proin non augue gravida sed eleifend lacinia imperdiet dictum aptent venenatis ad malesuada.Nulla etiam magna suscipit nam donec consequat parturient enim.Fames neque scelerisque pede consequat tortor fusce at aptent pede ve.',
      3,
      1);
INSERT INTO gestalt_idea (title, subtitle, description, story_id, action_id) VALUES 
    ('Etiam felis nostra', 'degree/centrality', 
     'Velit risus.Magna justo.Curae etiam scelerisque per.Metus ipsum.Dolor morbi neque vel velit fermentum.',
      3,
      2);
INSERT INTO gestalt_idea (title, subtitle, description, story_id, action_id) VALUES 
    ('Purus nulla lectus', 
     'connectedness', 
     'Justo porta senectus purus lectus.Vitae lacus dapibus et mi ut.Lacus metus tortor accumsan parturient laoreet orci eni velit.Augue proin sit urna vestibulum ultricies enim hymenaeos congue volutpat ipsum.Etiam felis nostra.',
      3,
      3);
INSERT INTO gestalt_idea (title, subtitle, description, story_id, action_id) VALUES 
    ('Comparison', 
     'comparison', 
     'Justo porta senectus purus lectus.Vitae lacus dapibus et mi ut.Lacus metus tortor accumsan parturient laoreet orci eni velit.Augue proin sit urna vestibulum ultricies enim hymenaeos congue volutpat ipsum.Etiam felis nostra.',
      2,
      4);
