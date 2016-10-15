drop table if exists gestalt_vis_type; CREATE TABLE gestalt_vis_type (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    url_name text,
    UNIQUE (name)
);
INSERT INTO gestalt_vis_type (name,url_name) VALUES ('comparison', 'comparison');
INSERT INTO gestalt_vis_type (name,url_name) VALUES ('time series', 'time-series');
INSERT INTO gestalt_vis_type (name,url_name) VALUES ('hierarchy', 'hierarchy');
INSERT INTO gestalt_vis_type (name,url_name) VALUES ('parts of a whole', 'parts-of-a-whole');
INSERT INTO gestalt_vis_type (name,url_name) VALUES ('relatedness','relatedness');
INSERT INTO gestalt_vis_type (name,url_name) VALUES ('geospatial','geospatial');
select * from gestalt_vis_type;
drop table if exists gestalt_vis_directive;
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
INSERT INTO gestalt_vis_directive (name) VALUES ('dendrogram');
INSERT INTO gestalt_vis_directive (name) VALUES ('packed-circles');
INSERT INTO gestalt_vis_directive (name) VALUES ('tree-list');
INSERT INTO gestalt_vis_directive (name) VALUES ('heatmap-grid');
INSERT INTO gestalt_vis_directive (name) VALUES ('pie-chart');
INSERT INTO gestalt_vis_directive (name) VALUES ('node-link');
INSERT INTO gestalt_vis_directive (name) VALUES ('adjacent-matrix');
INSERT INTO gestalt_vis_directive (name) VALUES ('tile-grid-map');
select * from gestalt_vis_directive;
drop table if exists gestalt_vis;
CREATE TABLE gestalt_vis (
    id SERIAL PRIMARY KEY,
    vis_type_id INTEGER,
    vis_directive_id INTEGER,
    name TEXT NOT NULL CHECK (name <> ''),
    max_limit INTEGER NOT NULL,
    UNIQUE (name)
);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (1, 1, 'bar chart (horizontal)', 100);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (5, 2, 'group nodes', 500);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (null, 4, 'tbd', 500);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (2, 5, 'spark line', 10);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (1, 1, 'bar chart (vertical)', 100);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (3, 6, 'dendrogram (radial)', 100);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (3, 6, 'dendrogram (linear)', 100);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (3, 7, 'packed circles', 100);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (3, 8, 'tree list', 500);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (2, 5, 'line chart', 10);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (2, 9, 'heatmap grid', 50);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (4, 10, 'pie chart', 10);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (4, 10, 'donut chart', 10);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (5, 11, 'node link diagram', 200);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (5, 12, 'adjacency matrix', 200);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (6, 13, 'tile grid map', 300);
select * from gestalt_vis;
drop table if exists gestalt_vis_do_attr;
CREATE TABLE gestalt_vis_do_attr (
    id  serial PRIMARY KEY,
    vis_id integer,
    do_value TEXT NOT NULL CHECK (do_value <> '')
);
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (1, 'Use when you want to compare series of values against one another.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (1, 'Use when you have small differences between each series value.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (1, 'Use when you have greater than 10 series to compare.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use when you want to compare series of values against one another.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use when you have small differences between each series value.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use when you have greater than 10 series to compare.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (6, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (6, 'Use when space is restricted and generally square shaped.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (7, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (7, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');
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
    (4, 'Use for data that changes over time.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (4, 'Use when space is restricted and generally wider than it is tall.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (4, 'Use for a high-level understanding of a trend or drastic change.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (10, 'Use for data that changes over time.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (10, 'Use when space is restricted and generally wider than it is tall.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (10, 'Use for a high-level understanding of a trend or drastic change.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (11, 'Use for data that changes over time.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (11, 'Use for a high-level understanding of a trend or drastic change.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (11, 'Use when data has more than 10 categories.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (12, 'Use when you want to show a difference between series whose values add up to 100%.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (12, 'Use when available space is generally squared shaped.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (12, 'Use when space available is limited.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (13, 'Use when you want to show a difference between series whose values add up to 100%.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (13, 'Use when available space is generally squared shaped.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (13, 'Use when space available is limited.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (14, 'Use when you want to show entities are related to one another.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (15, 'Use when you want to show entities are related to one another.');
select * from gestalt_vis_do_attr;
drop table if exists gestalt_vis_dont_attr;
CREATE TABLE gestalt_vis_dont_attr (
    id  serial PRIMARY KEY,
    vis_id integer,
    dont_value TEXT NOT NULL CHECK (dont_value <> '')
);
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (1, 'Draw the height of the chart to exceed 500 pixels.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (5, 'Draw the height of the chart to exceed 500 pixels.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (6, 'Use if data is more than 6 layers deep.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (6, 'Use if node labels are longer than 2 words.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (6, 'Use if the difference between the number of nodes between layers is drastic.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (7, 'Use if entire visual does not fit in available space without scrolling.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (8, 'Use if interactivity is not available or when all labels must be visible at once.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (9, 'Use if interactivity is not available or when all labels must be visible at once.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (4, 'Use if data has more than 5 series.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (4, 'Use if difference between each series is less than 10% of the canvas height.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (4, 'Use if exact values of every value in the series is critical to comprehension.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (10, 'Use if data has more than 5 series.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (10, 'Use if difference between each series is less than 10% of the canvas height.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (10, 'Use if exact values of every value in the series is critical to comprehension.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (11, 'Use if exact values of every value in the series is critical to comprehension.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (12, 'Use if the total of all series'' values does not equal 100%.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (12, 'Use if the number of series is greater than 10.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (13, 'Use if the total of all series'' values does not equal 100%.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (13, 'Use if the number of series is greater than 10.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (14, 'Use interactivity is not available.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (15, 'Use if data has redudancy in it not important to the story.');
select * from gestalt_vis_dont_attr;
drop table if exists gestalt_vis_attr; create table gestalt_vis_attr (id serial primary key, name text, value text);
insert into gestalt_vis_attr (name,value) values ('orientation', 'horizontal | vertical');
insert into gestalt_vis_attr (name,value) values ('canvas-height', 'integer');
insert into gestalt_vis_attr (name,value) values ('canvas-width', 'integer');
insert into gestalt_vis_attr (name,value) values ('format', 'radial | linear');
insert into gestalt_vis_attr (name,value) values ('viz-data', 'dataset');
insert into gestalt_vis_attr (name) values ('start-group');
insert into gestalt_vis_attr (name) values ('grouping');
insert into gestalt_vis_attr (name,value) values ('stroke-size', 'integer');
insert into gestalt_vis_attr (name,value) values ('use-labels', 'bool');
insert into gestalt_vis_attr (name,value) values ('spark', 'bool');
insert into gestalt_vis_attr (name,value) values ('format', 'donut | pie');
select * from gestalt_vis_attr;
drop table if exists gestalt_vis_code_attr; create table gestalt_vis_code_attr (id serial primary key, vis_id integer, attr_id integer, is_required boolean, attr_value text);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (1,1,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (1,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (1,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (1,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required, attr_value) values (5,1,false, 'vertical');
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (5,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (5,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (5,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (6,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (6,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (6,4,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (6,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (7,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (7,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required,attr_value) values (7,4,false, 'radial');
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (7,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (8,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (8,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (8,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (9,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (4,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (4,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (4,8,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (4,9,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required, attr_value) values (4,10,false, true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (4,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (10,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (10,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (10,8,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (10,9,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (10,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (11,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (11,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (11,8,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (11,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (12,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (12,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (12,11,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (12,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (13,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (13,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required, attr_value) values (13,11,false, 'donut');
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (13,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (14,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (14,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (14,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (15,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (15,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (15,5,true);
select * from gestalt_vis_code_attr;
drop table if exists gestalt_vis_alt_attr;
CREATE TABLE gestalt_vis_alt_attr (
    vis_id INTEGER,
    alt_vis_directive_id INTEGER NOT NULL
);  
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (6, 7);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (6, 8);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (7, 7);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (7, 8);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (8, 6);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (8, 8);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (9, 6);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (9, 7);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (4, 9);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (10, 9);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (11, 5);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (14, 12);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (15, 11);
select * from gestalt_vis_alt_attr;
drop table if exists gestalt_vis_dummy_data_label; create table gestalt_vis_dummy_data_label (id serial primary key, name text);
insert into gestalt_vis_dummy_data_label (name) values ('south');
insert into gestalt_vis_dummy_data_label (name) values ('west');
insert into gestalt_vis_dummy_data_label (name) values ('northeast');
insert into gestalt_vis_dummy_data_label (name) values ('midwest');
insert into gestalt_vis_dummy_data_label (name) values ('alabama');
insert into gestalt_vis_dummy_data_label (name) values ('arkansas');
insert into gestalt_vis_dummy_data_label (name) values ('florida');
insert into gestalt_vis_dummy_data_label (name) values ('alaska');
insert into gestalt_vis_dummy_data_label (name) values ('arizona');
insert into gestalt_vis_dummy_data_label (name) values ('california');
insert into gestalt_vis_dummy_data_label (name) values ('connecticut');
insert into gestalt_vis_dummy_data_label (name) values ('delaware');
insert into gestalt_vis_dummy_data_label (name) values ('illinois');
insert into gestalt_vis_dummy_data_label (name) values ('iowa');
insert into gestalt_vis_dummy_data_label (name) values ('kansas');
select * from gestalt_vis_dummy_data_label;
drop table if exists gestalt_vis_dummy_data; create table gestalt_vis_dummy_data (id serial primary key, name_id integer, value float, date text, vis_id integer);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (1, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 1);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (2, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 1);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (4, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 1);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (3, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 1);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (1, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 5);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (2, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 5);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (4, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 5);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (3, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 5);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (1, 4);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (2, 4);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (3, 4);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (4, 4);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (1, 10);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (2, 10);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (3, 10);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (4, 10);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (1, 11);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (2, 11);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (3, 11);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (4, 11);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (5, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (6, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (7, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (8, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (9, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (10, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (11, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (12, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (13, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (14, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (15, 14);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (1, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 12);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (2, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 12);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (4, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 12);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (3, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 12);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (1, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 13);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (2, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 13);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (4, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 13);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (3, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 13);
select * from gestalt_vis_dummy_data;
drop table if exists gestalt_vis_dummy_data_values; create table gestalt_vis_dummy_data_values (id serial primary key, data_id integer, value float, date text);
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (9, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (9, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (9, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (9, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (10, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (10, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (10, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (10, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (11, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (11, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (11, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (11, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (12, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (12, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (12, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (12, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (13, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (13, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (13, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (13, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (14, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (14, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (14, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (14, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (15, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (15, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (15, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (15, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (16, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (16, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (16, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (16, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (17, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (17, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (17, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (17, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (18, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (18, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (18, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (18, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (19, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (19, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (19, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (19, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (20, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (20, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (20, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (20, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value) values (21, trunc(random() * 15 + 5));
insert into gestalt_vis_dummy_data_values (data_id, value) values (22, trunc(random() * 15 + 5));
insert into gestalt_vis_dummy_data_values (data_id, value) values (23, trunc(random() * 15 + 5));
insert into gestalt_vis_dummy_data_values (data_id, value) values (24, trunc(random() * 15 + 5));
insert into gestalt_vis_dummy_data_values (data_id, value) values (25, trunc(random() * 15 + 5));
insert into gestalt_vis_dummy_data_values (data_id, value) values (26, trunc(random() * 15 + 5));
insert into gestalt_vis_dummy_data_values (data_id, value) values (27, trunc(random() * 15 + 5));
select * from gestalt_vis_dummy_data_values;