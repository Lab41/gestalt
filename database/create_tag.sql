CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)
);

INSERT INTO tag (name) 
    SELECT x FROM unnest(ARRAY[
        'contagion',
        'vulnerability' 
        'visualization',
        'data science',
        'economics',
        'visualization tools',
        'visualization form',
        'social media',
        'olympics'
    ]) x;
