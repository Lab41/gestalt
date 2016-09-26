CREATE TABLE gestalt_country_with_name AS 
    SELECT country.id, country_name.name, country.iso2code, country.iso3code
    FROM gestalt_country AS country, gestalt_geography_name AS country_name
    WHERE country.name_id = country_name.id;

CREATE TABLE gestalt_series (
    id SERIAL PRIMARY KEY,
    code TEXT,
    description TEXT,
    UNIQUE(code, description)
);

INSERT INTO gestalt_series (code, description) VALUES
    ('nominal', 'nominal gdp');
INSERT INTO gestalt_series (code, description) VALUES
    ('real' , 'real gdp');
INSERT INTO gestalt_series (code, description) VALUES
    ('area', 'country area');

CREATE TABLE gestalt_source_eiu (
    id SERIAL PRIMARY KEY,
    date_inserted DATE DEFAULT CURRENT_DATE,
    series_id INTEGER REFERENCES gestalt_series(id),
    country_id INTEGER REFERENCES gestalt_country(id),
    date DATE NOT NULL,
    date_precision VARCHAR(5) NOT NULL,
    value DECIMAL
);

INSERT INTO gestalt_source_eiu (series_id, country_id, date, date_precision, value) VALUES
    (1, 160, to_date('2014', 'YYYY'), 'YYYY', 20.10);
INSERT INTO gestalt_source_eiu (series_id, country_id, date, date_precision, value) VALUES
    (2, 160, to_date('2014', 'YYYY'), 'YYYY', 12.90);
INSERT INTO gestalt_source_eiu (series_id, country_id, date, date_precision, value) VALUES
    (2, 160, to_date('2015', 'YYYY'), 'YYYY', 13.10);

CREATE TABLE gestalt_source_wdi (
    id SERIAL PRIMARY KEY,
    date_inserted DATE DEFAULT CURRENT_DATE,
    series_id INTEGER REFERENCES gestalt_series(id),
    country_id INTEGER REFERENCES gestalt_country(id),
    date DATE,
    date_precision VARCHAR(5),
    value DECIMAL
);

CREATE TABLE gestalt_source_imf (
    id SERIAL PRIMARY KEY, 
    date_inserted DATE DEFAULT CURRENT_DATE,
    series_id INTEGER REFERENCES gestalt_series(id),
    country_id INTEGER REFERENCES gestalt_country(id),
    date DATE,
    date_precision VARCHAR(5),
    value DECIMAL
);

CREATE TABLE gestalt_source_fvi (
    id SERIAL PRIMARY KEY,
    date_inserted DATE DEFAULT CURRENT_DATE,
    series_id INTEGER REFERENCES gestalt_series(id),
    country_id INTEGER REFERENCES gestalt_country(id),
    date DATE,
    date_precision VARCHAR(5),
    value DECIMAL
);

CREATE TABLE gestalt_source_country_attribute (
    id SERIAL PRIMARY KEY,
    date_inserted DATE DEFAULT CURRENT_DATE,
    series_id INTEGER REFERENCES gestalt_series(id),
    country_id INTEGER REFERENCES gestalt_country(id),
    date DATE,
    date_precision VARCHAR(5),
    value DECIMAL
);

INSERT INTO gestalt_source_country_attribute (series_id, country_id, value) VALUES
    (3, 160, 100);

CREATE TABLE gestalt_frontend_country_data (
    id SERIAL PRIMARY KEY,
    date_inserted DATE DEFAULT CURRENT_DATE,
    source_name TEXT NOT NULL,
    source_id INTEGER NOT NULL,
    series_id INTEGER REFERENCES gestalt_series(id),
    country_id INTEGER REFERENCES gestalt_country(id),
    date DATE,
    date_precision VARCHAR(5),
    value DECIMAL,
    UNIQUE (source_id, series_id)
);

# deleting content of tables  
TRUNCATE gestalt_series, gestalt_source_eiu, gestalt_source_wdi,
         gestalt_source_imf, gestalt_source_fathom, gestalt_source_country_attribute;
