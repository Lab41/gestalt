/* 
 * For the "gestalt" workspace, we will list different types of 
 * visualizations that can be used for each type of datasets.  
 * The reason we do this is so that users can better grasp  
 * which visualization works best for which dataset.
 *
 * To do this, we will use the following format: 
 * panel == refers to the dataset type (i.e. time series)
 * story == name of visualization
 *
 * When you go through each panel for the different dataset type,
 * you can see a list of visualizations that are suited for that
 * particular dataset type.
 * 
 */

/* dataset_type ------------------------------------------------------------ */

CREATE TABLE dataset_type (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)
);

-- Insert new dataset type into panel as well.
-- TODO: Is there a better way to do this?

WITH inserted_dataset_type AS (
    INSERT INTO dataset_type (name) VALUES 
    ('Comparison') 
    RETURNING name AS dataset_type_name
)
INSERT INTO panel (name, url_name) 
SELECT dataset_type_name, md5(random()::text)
FROM inserted_dataset_type;

WITH inserted_dataset_type AS (
    INSERT INTO dataset_type (name) VALUES
    ('Time series')
    RETURNING name AS dataset_type_name
)
INSERT INTO panel (name, url_name)
SELECT dataset_type_name, md5(random()::text)
FROM inserted_dataset_type;

WITH inserted_dataset_type AS (
    INSERT INTO dataset_type (name) VALUES
    ('Hierarchy')
    RETURNING name AS dataset_type_name
)
INSERT INTO panel (name, url_name)
SELECT dataset_type_name, md5(random()::text)
FROM inserted_dataset_type;

WITH inserted_dataset_type AS (
    INSERT INTO dataset_type (name) VALUES
    ('Parts of a whole')
    RETURNING name AS dataset_type_name
)
INSERT INTO panel (name, url_name)
SELECT dataset_type_name, md5(random()::text)
FROM inserted_dataset_type;

WITH inserted_dataset_type AS (
    INSERT INTO dataset_type (name) VALUES
    ('Relatedness')
    RETURNING name AS dataset_type_name
)
INSERT INTO panel (name, url_name)
SELECT dataset_type_name, md5(random()::text)
FROM inserted_dataset_type;

/* vis --------------------------------------------------------------------- */

CREATE TABLE vis (
    id SERIAL PRIMARY KEY,
    dataset_type_id INTEGER NOT NULL,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)
);

-- Inserting new visualization name into story as well
-- TODO: Is there a better way to do this?

WITH inserted_vis AS (
    INSERT INTO vis (dataset_type_id, name) VALUES 
    (1, 'Bar chart') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (dataset_type_id, name) VALUES 
    (2, 'Spark line') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (dataset_type_id, name) VALUES 
    (2, 'Line chart') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (dataset_type_id, name) VALUES 
    (2, 'Heatmap grid') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (dataset_type_id, name) VALUES 
    (3, 'Dendogram (radial)') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (dataset_type_id, name) VALUES 
    (3, 'Dendogram (linear)') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (dataset_type_id, name) VALUES 
    (3, 'Packed circles') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (dataset_type_id, name) VALUES 
    (3, 'Tree list') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (dataset_type_id, name) VALUES 
    (4, 'Pie chart') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (dataset_type_id, name) VALUES 
    (4, 'Donut chart') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (dataset_type_id, name) VALUES 
    (5, 'Node link') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

WITH inserted_vis AS (
    INSERT INTO vis (dataset_type_id, name) VALUES 
    (5, 'Adjacency matrix') 
    RETURNING name AS vis_name
)
INSERT INTO story (name, url_name) 
SELECT vis_name, md5(random()::text)
FROM inserted_vis;

/* */

/* TODO */
CREATE TABLE story_vis ( 
    id SERIAL PRIMARY KEY,
    story_id INTEGER NOT NULL,
    vis_id INTEGER NOT NULL,
    order_num INTEGER NOT NULL,
    UNIQUE (story_id, vis_id)
);

INSERT INTO story_vis (story_id, vis_id, order_num) VALUES ('1' , '1') ON DUPLICATE story_id UPDATE order_num = order_num + 1;