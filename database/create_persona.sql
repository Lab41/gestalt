CREATE TABLE persona (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    description TEXT NOT NULL CHECK (description <> ''),
    UNIQUE (name)
);

INSERT INTO persona (name, description) VALUES (
    'general', 
    'Use for a high-level overview with information meant to be understood by anyone.'
);
INSERT INTO persona (name, description) VALUES (
    'corporate', 
    'Use for a high-level overview with information curated for helping you make high-level decisions.'
);
INSERT INTO persona (name, description) VALUES (
    'subject matter expert', 
    'Use for aggregate and detailed information meant to help you gain deeper understanding of the subject already familiar to you.'
);
INSERT INTO persona (name, description) VALUES (
    'peer', 
    'Use for aggregate and detailed information meant to help you understand the data science.'
);