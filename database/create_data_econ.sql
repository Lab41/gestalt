CREATE TABLE gestalt_country_with_name AS 
    SELECT country.id, country_name.name, country.iso2code, country.iso3code
    FROM gestalt_country AS country, gestalt_geography_name AS country_name
    WHERE country.name_id = country_name.id;

CREATE TABLE gestalt_nominal_gdp (
    id SERIAL PRIMARY KEY,
    date_inserted DATE DEFAULT CURRENT_DATE,
    country_id INTEGER REFERENCES gestalt_country(id),
    date DATE NOT NULL,
    date_precision VARCHAR(5) NOT NULL,
    value NUMERIC(15,2)
);

INSERT INTO gestalt_nominal_gdp (country_id, date, date_precision, value) VALUES
   (160, '2014-01-01', 'year', 20.10);


CREATE TABLE gestalt_real_gdp (
    id SERIAL PRIMARY KEY, 
    date_inserted DATE DEFAULT CURRENT_DATE,
    country_id INTEGER REFERENCES gestalt_country(id),
    date DATE NOT NULL,
    date_precision VARCHAR(5) NOT NULL,
    value NUMERIC(15,2)
);

INSERT INTO gestalt_real_gdp (country_id, date, date_precision, value) VALUES
    (160, '2014-01-01', 'year', 12.90);
INSERT INTO gestalt_real_gdp (country_id, date, date_precision, value) VALUES
    (160, '2015-01-01', 'year', 13.10);

CREATE TABLE gestalt_country_area (
    id SERIAL PRIMARY KEY,
    date_inserted DATE DEFAULT CURRENT_DATE,
    country_id INTEGER REFERENCES gestalt_country(id),
    date DATE,
    date_precision VARCHAR(5),
    value INTEGER NOT NULL
);

INSERT INTO gestalt_country_area (country_id, value) VALUES 
    (160, 100);

CREATE TABLE gestalt_region (
    id SERIAL PRIMARY KEY,
    date_inserted DATE default CURRENT_DATE,
    region_type TEXT NOT NULL,
    region_name TEXT NOT NULL,
    country_id INTEGER REFERENCES gestalt_country(id),
    UNIQUE (region_type, region_name, country_id)
);

INSERT INTO gestalt_region (region_type, region_name, country_id) VALUES
    ('Continent', 'Asia', 160);

# deleting content of tables  
TRUNCATE gestalt_nominal_gdp, gestalt_real_gdp, gestalt_country_area, gestalt_region;
