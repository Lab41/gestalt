CREATE TABLE gestalt_tag (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)
);

INSERT INTO gestalt_tag (name) 
    SELECT x FROM unnest(ARRAY[
        'congestalt_tagion',
        'vulnerability',
        'visualization',
        'data science',
        'economics',
        'visualization tools',
        'visualization form',
        'social media',
        'olympics'
    ]) x;
