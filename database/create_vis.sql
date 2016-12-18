/* 
 * For the "gestalt" workspace, we will list different types of 
 * visualizations that can be used for each type of datasets.  
 * The reason we do this is so that users can better grasp  
 * which visualization works best for which dataset.
 *
 * To do this, we will use the following format: 
 * gestalt_panel == visualization's type (i.e. time series) from gestalt_vis_type
 * gestalt_story == visualization's name from vis
 *
 * When you go through each gestalt_panel for the different visualization 
 * type, you can see a list of visualizations that falls under the
 * visualization type.
 * 
 */

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis_type
   This table lists the types of visualizations. Each visualization falls
   under one type.
   * id: directive id
   * name: directive name
   -------------------------------------------------------------------------
 */

DROP TABLE IF EXISTS gestalt_vis_type; 

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

DROP TABLE IF EXISTS gestalt_vis_directive;

CREATE TABLE gestalt_vis_directive (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)

);

INSERT INTO gestalt_vis_directive (name) VALUES ('bar-chart');
INSERT INTO gestalt_vis_directive (name) VALUES ('group-nodes');
INSERT INTO gestalt_vis_directive (name) VALUES ('line-chart');
INSERT INTO gestalt_vis_directive (name) VALUES ('dendrogram');
INSERT INTO gestalt_vis_directive (name) VALUES ('packed-circles');
INSERT INTO gestalt_vis_directive (name) VALUES ('tree-list');
INSERT INTO gestalt_vis_directive (name) VALUES ('heatmap-grid');
INSERT INTO gestalt_vis_directive (name) VALUES ('pie-chart');
INSERT INTO gestalt_vis_directive (name) VALUES ('node-link');
INSERT INTO gestalt_vis_directive (name) VALUES ('adjacent-matrix');

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis
   This table lists the visualizations.
   * id: vis id
   * vis_type_id: type of the vis in gestalt_vis_type
   * vis_directive_id: name of the vis directive in gestalt_vis_directive
   * name: name of the visualization
   * max_limit: ???
   -------------------------------------------------------------------------
 */

DROP TABLE IF EXISTS gestalt_vis CASCADE;

CREATE TABLE gestalt_vis (
    id SERIAL PRIMARY KEY,
    type_id INTEGER REFERENCES gestalt_vis_type(id),
    directive_id INTEGER REFERENCES gestalt_vis_directive(id),
    name TEXT NOT NULL CHECK (name <> ''),
    max_limit INTEGER NOT NULL,
    UNIQUE (name)
);

INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (1, 1, 'bar chart (horizontal)', 100);
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (1, 1, 'bar chart (vertical)', 100);
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (2, 3, 'line chart', 10);
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (2, 3, 'spark line', 10);
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (2, 7, 'heatmap grid', 50);
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (3, 4, 'dendrogram (linear)', 100);
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (3, 4, 'dendrogram (radial)', 100);
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (3, 5, 'packed circles', 100);
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (3, 6, 'tree list', 500);
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (4, 8, 'pie chart', 10);
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (4, 8, 'donut chart', 10);        
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (5, 2, 'group nodes', 500);
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (5, 9, 'node link diagram', 200);
INSERT INTO gestalt_vis (type_id, directive_id, name, max_limit) VALUES 
    (5, 10, 'adjacency matrix', 200);

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis_attr
   This table lists what attributes are needed in code 
   (aka gestalt_vis_code_attr).
   * id: vis attribute's id
   * name: name of the attribute
   * value: value(s) of the attribute
   -------------------------------------------------------------------------
 */

-- TODO: Isn't it better to separate the values into their respective row?

DROP TABLE IF EXISTS gestalt_vis_attr CASCADE;

CREATE TABLE gestalt_vis_attr (
  id SERIAL PRIMARY KEY, 
  name TEXT NOT NULL CHECK (name <> ''),
  value TEXT,
  UNIQUE (name, value)
);

INSERT INTO gestalt_vis_attr (name, value) VALUES ('orientation', 'horizontal');
INSERT INTO gestalt_vis_attr (name, value) VALUES ('orientation', 'vertical' )
INSERT INTO gestalt_vis_attr (name, value) VALUES ('canvas-height', 'integer');
INSERT INTO gestalt_vis_attr (name, value) VALUES ('canvas-width', 'integer');
INSERT INTO gestalt_vis_attr (name, value) VALUES ('format', 'radial');
INSERT INTO gestalt_vis_attr (name, value) VALUES ('format', 'linear');
INSERT INTO gestalt_vis_attr (name, value) VALUES ('viz-data', 'dataset');
INSERT INTO gestalt_vis_attr (name) VALUES ('start-group');
INSERT INTO gestalt_vis_attr (name) VALUES ('grouping');
INSERT INTO gestalt_vis_attr (name, value) VALUES ('stroke-size', 'integer');
INSERT INTO gestalt_vis_attr (name, value) VALUES ('use-labels', 'bool');
INSERT INTO gestalt_vis_attr (name, value) VALUES ('spark', 'bool');
INSERT INTO gestalt_vis_attr (name, value) VALUES ('format', 'donut');
INSERT INTO gestalt_vis_attr (name, value) VALUES ('format', 'pie');

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis_code_attr
   This table lists the code attributes to build the visualization.
   * vis_id: 
   * attr_id: 
   * is_required: 
   -------------------------------------------------------------------------
 */

-- TODO: fix this

DROP TABLE IF EXISTS gestalt_vis_code_attr;

CREATE TABLE gestalt_vis_code_attr (
    id SERIAL PRIMARY KEY,
    vis_id INTEGER REFERENCES gestalt_vis(id),
    attr_id INTEGER REFERENCES gestalt_vis_attr(id),
    is_required BOOLEAN DEFAULT FALSE,
    UNIQUE (vis_id, attr_id)
);

INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (1, 1)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (1, 2)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (1, 3)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (1, 4)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id, is_required) VALUES
    (1, 7, TRUE)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (2, 2)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (2, 3)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (2, 4)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id, is_required) VALUES
    (2, 7, TRUE)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (6, 3)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (6, 4)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (6, 5)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (6, 6)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id, is_required) VALUES
    (6, 7, TRUE)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (7, 3)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (7, 4)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (7, 5)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (7, 6)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id, is_required) VALUES
    (7, 7, TRUE)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (8, 3)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (8, 4)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id, is_required) VALUES
    (8, 7, TRUE)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id, is_required) VALUES
    (9, 7, TRUE)

INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (4, 3)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (4, 4)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (4, 8)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (4, 9)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (1, 1)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (1, 1)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (1, 1)
INSERT INTO gestalt_vis_code_attr (vis_id, attr_id) VALUES
    (1, 1)

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis_do_attr
   This table lists when you can use the visualization.
   * vis_id: vis id in gestalt_vis table
   * do_value: information about when you can use the visualization
   -------------------------------------------------------------------------
 */

DROP TABLE IF EXISTS gestalt_vis_do_attr;

CREATE TABLE gestalt_vis_do_attr (
    vis_id INTEGER REFERENCES gestalt_vis(id),
    do_value TEXT NOT NULL CHECK (do_value <> ''),
    PRIMARY KEY (vis_id, do_value)
);

INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (1, 'Use when you want to compare series of VALUES against one another.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (1, 'Use when you have small differences between each series value.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (1, 'Use when you have greater than 10 series to compare.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (2, 'Use when you want to compare series of VALUES against one another.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (2, 'Use when you have small differences between each series value.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (2, 'Use when you have greater than 10 series to compare.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (3, 'Use for data that changes over time.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (3, 'Use when space is restricted and generally wider than it is tall.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (3, 'Use for a high-level understanding of a trend or drastic change.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (4, 'Use for data that changes over time.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (4, 'Use when space is restricted and generally wider than it is tall.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (4, 'Use for a high-level understanding of a trend or drastic change.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use for data that changes over time.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use for a high-level understanding of a trend or drastic change.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use when data has more than 10 categories.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (6, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (6, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');        
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (7, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (7, 'Use when space is restricted and generally square shaped.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (8, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (8, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (9, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (9, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (9, 'Use when space is extremely limited and/or extremely tall/skinny.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (10, 'Use when you want to show a difference between series whose VALUES add up to 100%.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (10, 'Use when available space is generally squared shaped.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (10, 'Use when space available is limited.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (11, 'Use when you want to show a difference between series whose VALUES add up to 100%.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (11, 'Use when available space is generally squared shaped.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (11, 'Use when space available is limited.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (13, 'Use when you want to show entities are related to one another.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (14, 'Use when you want to show entities are related to one another.');

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis_dont_attr
   This table lists when you cannot use the visualization.
   * vis_id: vis id in gestalt_vis table
   * dont_value: information about when you should not use the visualization
   -------------------------------------------------------------------------
 */

DROP TABLE IF EXISTS gestalt_vis_dont_attr;

CREATE TABLE gestalt_vis_dont_attr (
    vis_id INTEGER REFERENCES gestalt_vis(id),
    dont_value TEXT NOT NULL CHECK (dont_value <> ''),
    PRIMARY KEY (vis_id, dont_value)
);

INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (1, 'Draw the height of the chart to exceed 500 pixels.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (2, 'Draw the height of the chart to exceed 500 pixels.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (3, 'Use if data has more than 5 series.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (3, 'Use if difference between each series is less than 10% of the canvas height.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (3, 'Use if exact VALUES of every value in the series is critical to comprehension.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (4, 'Use if data has more than 5 series.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (4, 'Use if difference between each series is less than 10% of the canvas height.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (4, 'Use if exact VALUES of every value in the series is critical to comprehension.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (5, 'Use if exact VALUES of every value in the series is critical to comprehension.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (6, 'Use if entire visual does not fit in available space without scrolling.');            
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (7, 'Use if data is more than 6 layers deep.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (7, 'Use if node labels are longer than 2 words.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (7, 'Use if the difference between the number of nodes between layers is drastic.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (8, 'Use if interactivity is not available or when all labels must be visible at once.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (9, 'Use if interactivity is not available or when all labels must be visible at once.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (10, 'Use if the total of all series'' VALUES does not equal 100%.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (10, 'Use if the number of series is greater than 10.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (11, 'Use if the total of all series'' VALUES does not equal 100%.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (11, 'Use if the number of series is greater than 10.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (13, 'Use interactivity is not available.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (14, 'Use if data has redudancy in it not important to the story.');

/* 
   ------------------------------------------------------------------------- 
   gestalt_vis_alt_attr
   This table lists what alternate visualizations you can use.
   * vis_id: vis id in gestalt_vis table
   * alt_vis_id: vis id in gestalt_vis table about the other visualizations
   *     you can use as an alternative.
   -------------------------------------------------------------------------
 */

DROP TABLE IF EXISTS gestalt_vis_alt_attr;

CREATE TABLE gestalt_vis_alt_attr (
    vis_id INTEGER REFERENCES gestalt_vis(id),
    alt_vis_id INTEGER REFERENCES gestalt_vis(id) ,
    PRIMARY KEY (vis_id, alt_vis_id)
);  

INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (3, 9);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (4, 9);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (5, 2);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (6, 7);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (6, 8);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (7, 6);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (7, 8);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (8, 7);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (9, 6);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (9, 7);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (13, 10);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_id) VALUES (14, 5);

