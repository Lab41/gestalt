/* 
 * For the "gestalt" workspace, we will list different types of 
 * visualizations that can be used for each type of datasets.  
 * The reason we do this is so that users can better grasp  
 * which visualization works best for which dataset.
 *
 * To do this, we will use the following format: 
 * gestalt_panel == visualization's type (i.e. time series) from gestalt_vis_type
 * gestalt_story == visualizatoin's name from vis
 *
 * When you go through each gestalt_panel for the different visualization 
 * type, you can see a list of visualizations that falls under the
 * visualization type.
 * 
 */

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis_type
   This table lists the types of visualizations
   * id: vis type id
   * name: vis type name
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_vis_type (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)
);

INSERT INTO gestalt_vis_type (name) VALUES ('comparison');
INSERT INTO gestalt_vis_type (name) VALUES ('time series');
INSERT INTO gestalt_vis_type (name) VALUES ('hierarchy');
INSERT INTO gestalt_vis_type (name) VALUES ('parts of a whole');
INSERT INTO gestalt_vis_type (name) VALUES ('relatedness');

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis_directive 
   This table lists the front-end directives. A directive builds a 
   visualization.
   * id: directive id
   * name: directive name
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_vis_directive (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)

);

INSERT INTO gestalt_vis_directive (name) VALUES ('bar-chart');
INSERT INTO gestalt_vis_directive (name) VALUES ('group-nodes');
INSERT INTO gestalt_vis_directive (name) VALUES ('visualization-standard');
INSERT INTO gestalt_vis_directive (name) VALUES ('tbd');
INSERT INTO gestalt_vis_directive (name) VALUES ('line-chart');

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis
   This table lists the visualizations.
   * id: vis id
   * vis_type_id: vis type id in gestalt_vis_type
   * name: 
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_vis (
    id SERIAL PRIMARY KEY,
    vis_type_id INTEGER REFERENCES gestalt_vis_type(id),
    vis_directive_id INTEGER REFERENCES gestalt_vis_directive(id),
    name TEXT NOT NULL CHECK (name <> ''),
    max_limit INTEGER NOT NULL,
    UNIQUE (name)
);

INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (1, 1, 'bar chart', 100);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (5, 2, 'group nodes', 500);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (2, 4, 'tbd', 500);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (2, 5, 'spark line', 500);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (1, 1, 'column chart', 100);

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis_code_attr
   This table lists the code attributes to build the visualization.
   * vis_id: vis id in gestalt_vis table
   * vis_data: ???
   * is_vis_data_required: ???
   * canvas_width: ???
   * is_canvas_width_required: ???
   * canvas_height: ???
   * is_canvas_height_required: ???
   * orientation: ???
   * is_orientation_required: ???
   * format: ???
   * is_format_required: ???
   * grouping: ???
   * is_grouping_required: ???
   * start_group: ???
   * is_start_group_required: ???
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_vis_code_attr (
    vis_id INTEGER PRIMARY KEY,
    vis_data TEXT DEFAULT NULL,
    is_vis_data_required BOOLEAN DEFAULT FALSE,
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
/*
INSERT INTO gestalt_vis_code_attr (vis_id, canvas_width, canvas_height, orientation) VALUES 
    (1, 'integer', 'integer', 'vertical | horizontal');
INSERT INTO gestalt_vis_code_attr (vis_id) VALUES 
    (2);
INSERT INTO gestalt_vis_code_attr (vis_id) VALUES 
    (3);
INSERT INTO gestalt_vis_code_attr (vis_id) VALUES 
    (4);
INSERT INTO gestalt_vis_code_attr (vis_id, viz_data, is_viz_data_required, canvas_width, canvas_height, format) VALUES 
    (5, 'dataset', TRUE, 'integer', 'integer', 'radial | linear');
INSERT INTO gestalt_vis_code_attr (vis_id, viz_data, is_viz_data_required, canvas_width, canvas_height) VALUES 
    (6, 'dataset', TRUE, 'integer', 'integer');
INSERT INTO gestalt_vis_code_attr (vis_id, viz_data, is_viz_data_required, canvas_width, canvas_height) VALUES 
    (7, 'dataset', TRUE, 'integer', 'integer');
INSERT INTO gestalt_vis_code_attr (vis_id, viz_data, is_viz_data_required) VALUES 
    (8, 'dataset', TRUE);
INSERT INTO gestalt_vis_code_attr (vis_id) VALUES 
    (9);
INSERT INTO gestalt_vis_code_attr (vis_id) VALUES 
    (10);
INSERT INTO gestalt_vis_code_attr (vis_id) VALUES 
    (11);
INSERT INTO gestalt_vis_code_attr (vis_id) VALUES 
    (12);
*/

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis_do_attr
   This table lists when you can use the visualization.
   * vis_id: vis id in gestalt_vis table
   * do_value: information about when you can use the visualization
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_vis_do_attr (
    vis_id INTEGER REFERENCES gestalt_vis(id) PRIMARY KEY,
    do_value TEXT NOT NULL CHECK (do_value <> ''),
    UNIQUE (vis_id, do_value)
);

-- TODO: add more data
/*
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use when space is restricted and generally square shaped.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (6, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (6, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (7, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (7, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (8, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (8, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (8, 'Use when space is extremely limited and/or extremely tall/skinny.');
*/

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis_dont_attr
   This table lists when you cannot use the visualization.
   * vis_id: vis id in gestalt_vis table
   * dont_value: information about when you should not use the visualization
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_vis_dont_attr (
    vis_id INTEGER REFERENCES gestalt_vis(id) PRIMARY KEY,
    dont_value TEXT NOT NULL CHECK (dont_value <> ''),
    UNIQUE (vis_id, dont_value)
);

-- TODO: add more data
/*
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (5, 'Don\'t use if data is more than 6 layers deep.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (5, 'Don\'t use if node labels are longer than 2 words.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (5, 'Don\'t use if the difference between the number of nodes between layers is drastic.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (6, 'Don\'t use if the entire visual does not fit in available space without scrolling.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (7, 'Don\'t use it if interactivity is not available.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (7, 'Don\'t use when all labels must be visible at once.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (8, 'Don\'t use it if interactivity is not available.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (8, 'Don\'t use when all labels must be visible at once.');
*/

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis_dont_attr
   This table lists when the alternate visualizations you can use
   * vis_id: vis id in gestalt_vis table
   * alt_vis_id: vis id in gestalt_vis table about the other visualizations
   *     you can use as an alternative.
   -------------------------------------------------------------------------
 */

CREATE TABLE gestalt_vis_alt_attr (
    vis_id INTEGER REFERENCES gestalt_vis(id) PRIMARY KEY,
    alt_vis_id INTEGER REFERENCES gestalt_vis(id) ,
    UNIQUE (vis_id, alt_vis_id)
);  

-- TODO: add more data
/*
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (5, 7);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (5, 8);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (6, 7);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (6, 8);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (7, 5);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (7, 6);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (7, 8);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (8, 5);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (8, 6);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (8, 7);
*/
