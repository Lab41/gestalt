/* 
 * For the "gestalt" workspace, we will list different types of 
 * visualizations that can be used for each type of datasets.  
 * The reason we do this is so that users can better grasp  
 * which visualization works best for which dataset.
 *
 * To do this, we will use the following format: 
 * panel == visualization's type (i.e. time series) from vis_type
 * story == visualizatoin's name from vis
 *
 * When you go through each panel for the different visualization 
 * type, you can see a list of visualizations that falls under the
 * visualization type.
 * 
 */

/* vis_type ------------------------------------------------------------ */

CREATE TABLE vis_type (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)
);

INSERT INTO vis_type (name) VALUES ('comparison');
INSERT INTO vis_type (name) VALUES ('time series');
INSERT INTO vis_type (name) VALUES ('hierarchy');
INSERT INTO vis_type (name) VALUES ('parts of a whole');
INSERT INTO vis_type (name) VALUES ('relatedness');

/*

-- TODO: Is there a better way to do this than reinserting the same values in the panel table? 

WITH inserted_vis_type AS (
    INSERT INTO vis_type (name) VALUES 
    ('comparison') 
    RETURNING name AS vis_type_name
)
INSERT INTO panel (name, url_name) 
SELECT vis_type_name, md5(random()::text)
FROM inserted_vis_type;

WITH inserted_vis_type AS (
    INSERT INTO vis_type (name) VALUES
    ('time series')
    RETURNING name AS vis_type_name
)
INSERT INTO panel (name, url_name)
SELECT vis_type_name, md5(random()::text)
FROM inserted_vis_type;

WITH inserted_vis_type AS (
    INSERT INTO vis_type (name) VALUES
    ('hierarchy')
    RETURNING name AS vis_type_name
)
INSERT INTO panel (name, url_name)
SELECT vis_type_name, md5(random()::text)
FROM inserted_vis_type;

WITH inserted_vis_type AS (
    INSERT INTO vis_type (name) VALUES
    ('parts of a whole')
    RETURNING name AS vis_type_name
)
INSERT INTO panel (name, url_name)
SELECT vis_type_name, md5(random()::text)
FROM inserted_vis_type;

WITH inserted_vis_type AS (
    INSERT INTO vis_type (name) VALUES
    ('relatedness')
    RETURNING name AS vis_type_name
)
INSERT INTO panel (name, url_name)
SELECT vis_type_name, md5(random()::text)
FROM inserted_vis_type;
*/

/* vis --------------------------------------------------------------------- */

CREATE TABLE vis (
    id SERIAL PRIMARY KEY,
    vis_type_id INTEGER NOT NULL,
    name TEXT NOT NULL CHECK (name <> ''),
    max_limit INTEGER NOT NULL,
    UNIQUE (name)
);

/*

-- TODO: Need to add max limit for ingesting data to each visualization.

INSERT INTO vis (vis_type_id, name) VALUES (1, 'bar chart');
INSERT INTO vis (vis_type_id, name) VALUES (2, 'spark line')
INSERT INTO vis (vis_type_id, name) VALUES (2, 'line chart') 
INSERT INTO vis (vis_type_id, name) VALUES (2, 'heatmap grid') 
INSERT INTO vis (vis_type_id, name) VALUES (3, 'dendogram (radial)') 
INSERT INTO vis (vis_type_id, name) VALUES (3, 'dendogram (linear)') 
INSERT INTO vis (vis_type_id, name) VALUES (3, 'packed circles') 
INSERT INTO vis (vis_type_id, name) VALUES (3, 'tree list') 
INSERT INTO vis (vis_type_id, name) VALUES (4, 'pie chart') 
INSERT INTO vis (vis_type_id, name) VALUES (4, 'donut chart') 
INSERT INTO vis (vis_type_id, name) VALUES (5, 'node link') 
INSERT INTO vis (vis_type_id, name) VALUES (5, 'adjacency matrix') 
*/

/*

-- TODO: Is there a better way to do this than reinserting the same values in the story table?

WITH inserted_vis AS (
    INSERT INTO vis (vis_type_id, name) VALUES 
    (1, 'bar chart') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (vis_type_id, name) VALUES 
    (2, 'spark line') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (vis_type_id, name) VALUES 
    (2, 'line chart') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (vis_type_id, name) VALUES 
    (2, 'heatmap grid') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (vis_type_id, name) VALUES 
    (3, 'dendogram (radial)') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (vis_type_id, name) VALUES 
    (3, 'dendogram (linear)') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (vis_type_id, name) VALUES 
    (3, 'packed circles') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (vis_type_id, name) VALUES 
    (3, 'tree list') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (vis_type_id, name) VALUES 
    (4, 'pie chart') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (vis_type_id, name) VALUES 
    (4, 'donut chart') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (vis_type_id, name) VALUES 
    (5, 'node link') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (vis_type_id, name) VALUES 
    (5, 'adjacency matrix') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;
*/

/* story_vis --------------------------------------------------------------- */

CREATE TABLE story_vis ( 
    id SERIAL PRIMARY KEY,
    story_id INTEGER NOT NULL,
    vis_id INTEGER NOT NULL,
    order_num INTEGER NOT NULL,
    UNIQUE (story_id, vis_id)
);

-- TODO: add data
-- INSERT INTO story_vis (story_id, vis_id, order_num) VALUES (1, 1, 1);

/* vis's attributes -------------------------------------------------------- */

CREATE TABLE vis_code_attr (
    vis_id INTEGER PRIMARY KEY,
    viz_data TEXT DEFAULT NULL,
    is_viz_data_required BOOLEAN DEFAULT FALSE,
    canvas_width TEXT DEFAULT NULL,
    is_canvas_width_required BOOLEAN DEFAULT FALSE,
    canvas_height TEXT DEFAULT NULL,
    is_canvas_height_required BOOLEAN DEFAULT FALSE,
    orientation TEXT DEFAULT NULL,
    is_orientation_required BOOLEAN DEFAULT FALSE,
    format TEXT DEFAULT NULL,
    is_format_required BOOLEAN DEFAULT FALSE,
    grouping TEXT DEFAULT NULL,
    is_grouping_required BOOLEAN DEFAULT FALSE,
    start_group TEXT DEFAULT NULL,
    is_start_group_required BOOLEAN DEFAULT FALSE
);

-- TODO: add more data

INSERT INTO vis_code_attr (vis_id, canvas_width, canvas_height, orientation) VALUES 
    (1, 'integer', 'integer', 'vertical | horizontal');
INSERT INTO vis_code_attr (vis_id) VALUES 
    (2);
INSERT INTO vis_code_attr (vis_id) VALUES 
    (3);
INSERT INTO vis_code_attr (vis_id) VALUES 
    (4);
INSERT INTO vis_code_attr (vis_id, viz_data, is_viz_data_required, canvas_width, canvas_height, format) VALUES 
    (5, 'dataset', TRUE, 'integer', 'integer', 'radial | linear');
INSERT INTO vis_code_attr (vis_id, viz_data, is_viz_data_required, canvas_width, canvas_height) VALUES 
    (6, 'dataset', TRUE, 'integer', 'integer');
INSERT INTO vis_code_attr (vis_id, viz_data, is_viz_data_required, canvas_width, canvas_height) VALUES 
    (7, 'dataset', TRUE, 'integer', 'integer');
INSERT INTO vis_code_attr (vis_id, viz_data, is_viz_data_required) VALUES 
    (8, 'dataset', TRUE);
INSERT INTO vis_code_attr (vis_id) VALUES 
    (9);
INSERT INTO vis_code_attr (vis_id) VALUES 
    (10);
INSERT INTO vis_code_attr (vis_id) VALUES 
    (11);
INSERT INTO vis_code_attr (vis_id) VALUES 
    (12);

CREATE TABLE vis_do_attr (
    vis_id INTEGER PRIMARY KEY,
    do_value TEXT NOT NULL CHECK (do_value <> '')
    UNIQUE (vis_id, do_value)
);

-- TODO: add more data

INSERT INTO vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use for data that is hierarchial.');
INSERT INTO vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use when space is restricted and generally square shaped.');
INSERT INTO vis_do_attr (vis_id, do_value) VALUES
    (6, 'Use for data that is hierarchial.');
INSERT INTO vis_do_attr (vis_id, do_value) VALUES
    (6, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');
INSERT INTO vis_do_attr (vis_id, do_value) VALUES
    (7, 'Use for data that is hierarchial.');
INSERT INTO vis_do_attr (vis_id, do_value) VALUES
    (7, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');
INSERT INTO vis_do_attr (vis_id, do_value) VALUES
    (8, 'Use for data that is hierarchial.');
INSERT INTO vis_do_attr (vis_id, do_value) VALUES
    (8, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');
INSERT INTO vis_do_attr (vis_id, do_value) VALUES
    (8, 'Use when space is extremely limited and/or extremely tall/skinny.');

CREATE TABLE vis_dont_attr (
    vis_id INTEGER PRIMARY KEY,
    dont_value TEXT NOT NULL CHECK (dont_value <> '')
    UNIQUE (vis_id, dont_value)
);

-- TODO: add more data

INSERT INTO vis_dont_attr (vis_id, dont_value) VALUES
    (5, 'Don\'t use if data is more than 6 layers deep.');
INSERT INTO vis_dont_attr (vis_id, dont_value) VALUES
    (5, 'Don\'t use if node labels are longer than 2 words.');
INSERT INTO vis_dont_attr (vis_id, dont_value) VALUES
    (5, 'Don\'t use if the difference between the number of nodes between layers is drastic.');
INSERT INTO vis_dont_attr (vis_id, dont_value) VALUES
    (6, 'Don\'t use if the entire visual does not fit in available space without scrolling.');
INSERT INTO vis_dont_attr (vis_id, dont_value) VALUES
    (7, 'Don\'t use it if interactivity is not available.');
INSERT INTO vis_dont_attr (vis_id, dont_value) VALUES
    (7, 'Don\'t use when all labels must be visible at once.');
INSERT INTO vis_dont_attr (vis_id, dont_value) VALUES
    (8, 'Don\'t use it if interactivity is not available.');
INSERT INTO vis_dont_attr (vis_id, dont_value) VALUES
    (8, 'Don\'t use when all labels must be visible at once.');

CREATE TABLE vis_alternative_attr (
    vis_id INTEGER PRIMARY KEY,
    alt_vis_id INTEGER NOT NULL,
    UNIQUE (vis_id, alt_vis_id)
);  

-- TODO: add more data

INSERT INTO vis_alternative_attr (vis_id, alt_vis_id) VALUES (5, 7);
INSERT INTO vis_alternative_attr (vis_id, alt_vis_id) VALUES (5, 8);
INSERT INTO vis_alternative_attr (vis_id, alt_vis_id) VALUES (6, 7);
INSERT INTO vis_alternative_attr (vis_id, alt_vis_id) VALUES (6, 8);
INSERT INTO vis_alternative_attr (vis_id, alt_vis_id) VALUES (7, 5);
INSERT INTO vis_alternative_attr (vis_id, alt_vis_id) VALUES (7, 6);
INSERT INTO vis_alternative_attr (vis_id, alt_vis_id) VALUES (7, 8);
INSERT INTO vis_alternative_attr (vis_id, alt_vis_id) VALUES (8, 5);
INSERT INTO vis_alternative_attr (vis_id, alt_vis_id) VALUES (8, 6);
INSERT INTO vis_alternative_attr (vis_id, alt_vis_id) VALUES (8, 7);

