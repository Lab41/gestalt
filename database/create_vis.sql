 -- vis
 drop table if exists gestalt_economic.gestalt_vis;
CREATE TABLE gestalt_economic.gestalt_vis (
    id SERIAL PRIMARY KEY,
    vis_type_id INTEGER,
    vis_directive_id INTEGER,
    name TEXT NOT NULL CHECK (name <> ''),
    max_limit INTEGER NOT NULL,
    UNIQUE (name)
);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (1, 1, 'bar chart (horizontal)', 100);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (5, 2, 'group nodes', 500);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (null, 4, 'tbd', 500);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (2, 5, 'spark line', 10);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (1, 1, 'bar chart (vertical)', 100);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (3, 6, 'dendrogram (radial)', 100);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (3, 6, 'dendrogram (linear)', 100);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (3, 7, 'packed circles', 100);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (3, 8, 'tree list', 500);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (2, 5, 'line chart', 10);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (2, 9, 'heatmap grid', 50);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (4, 10, 'pie chart', 10);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (4, 10, 'donut chart', 10);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (5, 11, 'node link diagram', 200);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (5, 12, 'adjacency matrix', 200);
INSERT INTO gestalt_economic.gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (6, 13, 'tile grid map', 300);
    drop table if exists gestalt_economic.gestalt_vis_directive;
CREATE TABLE gestalt_economic.gestalt_vis_directive (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)

);
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('bar-chart');
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('group-nodes');
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('visualization-standard');
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('tbd');
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('line-chart');
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('dendrogram');
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('packed-circles');
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('tree-list');
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('heatmap-grid');
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('pie-chart');
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('node-link');
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('adjacent-matrix');
INSERT INTO gestalt_economic.gestalt_vis_directive (name) VALUES ('tile-grid-map');
-- vis type
drop table if exists gestalt_economic.gestalt_vis_type; CREATE TABLE gestalt_economic.gestalt_vis_type (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    url_name text,
    UNIQUE (name)
);
INSERT INTO gestalt_economic.gestalt_vis_type (name,url_name) VALUES ('comparison', 'comparison');
INSERT INTO gestalt_economic.gestalt_vis_type (name,url_name) VALUES ('time series', 'time-series');
INSERT INTO gestalt_economic.gestalt_vis_type (name,url_name) VALUES ('hierarchy', 'hierarchy');
INSERT INTO gestalt_economic.gestalt_vis_type (name,url_name) VALUES ('parts of a whole', 'parts-of-a-whole');
INSERT INTO gestalt_economic.gestalt_vis_type (name,url_name) VALUES ('relatedness','relatedness');
INSERT INTO gestalt_economic.gestalt_vis_type (name,url_name) VALUES ('geospatial','geospatial');