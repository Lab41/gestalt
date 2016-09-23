import json
import os
import psycopg2
import psycopg2.extras
import web
from decimal import Decimal

import helper

urls = (
    
    # 0.0.0.0:8000/api/data/economic/getAllNominalGdpByCountry/#
    #   where # == country_id
    "getAllNominalGdpByCountry/(\d+)", "getAllNominalGdpByCountry",
    # 0.0.0.0:8000/api/data/economic/getSingleNominalGdpByCountryAndDate/#/#
    #   where first # == country_id, second # == date (in year)
    "getSingleNominalGdpByCountryAndDate/country/(\d+)/date/(\w+)", "getSingleNominalGdpByCountryAndDate",
    # 0.0.0.0:8000/api/data/economic/getAllRealGdpByCountry/#
    #   where # == country_id
    "getAllRealGdpByCountry/(\d+)", "getAllRealGdpByCountry",
    # 0.0.0.0:8000/api/data/economic/getSingleRealGdpByCountryAndDate/#/#
    #   where first # == country_id, second # == date (in year)
    "getSingleRealGdpByCountryAndDate/country/(\d+)/date/(\w+)", "getSingleRealGdpByCountryAndDate",
    # 0.0.0.0:8000/api/data/economic/getAllRealGdpByRegionAndDate/#/#
    #   where first # == country_id, second # == date (in year)
    "getAllRealGdpByRegionAndDate/region_type/(\w+)/region_name/(\w+)/date/(\w+)", "getAllRealGdpByRegionAndDate",
    # 0.0.0.0:8000/api/data/economic/getCountryAreaByCountry/#
    #   where # == country_id
    "getCountryAreaByCountry/(\d+)", "getCountryAreaByCountry",
    # 0.0.0.0:8000/api/data/economic/getAllCountriesByRegion/#
    #   where # == region_id
    "getAllCountriesByRegion/(\d+)", "getAllCountriesByRegion",

)

"""
    Note for future user:
    If you are trying to differentiate the different date, you can do so as follows:
    WHEN 'year' THEN to_char(date, 'YYYY')
    WHEN 'month' THEN to_char(date, 'YYYY-MM')
    ELSE to_char(date, 'YYYY-MM-DD')
"""

class getAllNominalGdpByCountry:
    """ Extract all the nominal GDP of a given country.
    input:
        * country.id
    output:
        * country.id
        * country.name
        * nominal_gdp.value
        * nominal_gdp.date
    """
    def GET(self, country_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT country.id, country.name, ng.value,
                   CASE ng.date_precision
                       WHEN 'year' THEN to_char(ng.date, 'YYYY')
                       ELSE '' 
                   end as date
            FROM gestalt_nominal_gdp AS ng
            LEFT JOIN gestalt_country_with_name AS country
            ON ng.country_id = country.id
            WHERE country.id = """ + country_id + """
            AND country.id IS NOT NULL
            ORDER BY country.name;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)

class getSingleNominalGdpByCountryAndDate:
    """ Extract the nominal GDP of a given country at a particular year
    input:
        * country.id
        * nominal_gdp.year
    output:
        * country.id
        * country.name
        * nominal_gdp.value
        * nominal_gdp.date
    """
    def GET(self, country_id, nominal_gdp_year, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT country.id, country.name, ng.value, 
                   CASE ng.date_precision  
                       WHEN 'year' THEN to_char(ng.date, 'YYYY')
                       ELSE ''
                   end as date
            FROM gestalt_nominal_gdp AS ng
            LEFT JOIN gestalt_country_with_name AS country
            ON ng.country_id = country.id
            WHERE country.id = """ + country_id + """
            AND ng.date = to_date('""" + nominal_gdp_year + """', 'YYYY')
            ORDER BY country.name;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)

class getAllRealGdpByCountry:
    """ Extract all the real GDP of a given country.
    input:
        * country.id
    output:
        * country.id
        * country.name
        * real_gdp.value
        * real_gdp.date
    """
    def GET(self, country_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT country.id, country.name, rg.value,
                   CASE rg.date_precision
                       WHEN 'year' THEN to_char(rg.date, 'YYYY')
                       ELSE '' 
                   end as date
            FROM gestalt_real_gdp AS rg
            LEFT JOIN gestalt_country_with_name AS country
            ON rg.country_id = country.id
            WHERE country.id = """ + country_id + """
            AND country.id IS NOT NULL
            ORDER BY country.name;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)

class getSingleRealGdpByCountryAndDate:
    """ Extract the real GDP of a given country at a particular year
    input:
        * country.id
        * real_gdp.year
    output:
        * country.id
        * country.name
        * real_gdp.value
        * real_gdp.date
    """
    def GET(self, country_id, real_gdp_year, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT country.id, country.name, rg.value, 
                   CASE rg.date_precision  
                       WHEN 'year' THEN to_char(rg.date, 'YYYY')
                       ELSE ''
                   end as date
            FROM gestalt_real_gdp AS rg
            LEFT JOIN gestalt_country_with_name AS country
            ON rg.country_id = country.id
            WHERE country.id = """ + country_id + """
            AND rg.date = to_date('""" + real_gdp_year + """', 'YYYY')
            ORDER BY country.name;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)

class getAllRealGdpByRegionAndDate:
    """ Extract the real GDP of all countries in a region at a particular year
    input:
        * region.type
        * region.name
        * real_gdp.year
    output:
        * region.id
        * region.type
        * region.name
        * country.id
        * country.name
        * real_gdp.value
        * real_gdp.date
    """
    def GET(self, region_type, region_name, real_gdp_year, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT region.id AS region_id, region.region_type AS region_type, region.region_name, 
                   region.country_id, country.name AS country_name, rg.value, 
                   CASE rg.date_precision  
                       WHEN 'year' THEN to_char(rg.date, 'YYYY')
                       ELSE ''
                   end as date
            FROM gestalt_region AS region
                INNER JOIN gestalt_country_with_name AS country
                ON region.country_id = country.id
            LEFT JOIN gestalt_real_gdp AS rg
            ON region.country_id = rg.country_id
            WHERE region.region_type = '""" + region_type + """'
            AND region.region_name = '""" + region_name + """'
            AND date = to_date('""" + real_gdp_year + """', 'YYYY')
            ORDER BY country.name;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)

class getCountryAreaByCountry:
    """ Extract all the real GDP of a given country.
    input:
        * country.id
    output:
        * country.id
        * country.name
        * country_area.value
    """
    def GET(self, country_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT country.id, country.name, country_area.value
            FROM gestalt_country_area AS country_area
            LEFT JOIN gestalt_country_with_name AS country
            ON country_area.country_id = country.id
            WHERE country.id = """ + country_id + """
            AND country.id IS NOT NULL
            ORDER BY country.name;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class getAllCountriesByRegion:
    """ Extract all countries in a given region.
    input:
        * region.id
    output:
        * region.id
        * region.type
        * region.name
        * country.id
        * country.name
    """
    def GET(self, region_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT region.id, region.region_type, region.region_name, country.id AS country_id, country.name AS country_name
            FROM gestalt_region AS region
            LEFT JOIN gestalt_country_with_name AS country
            ON region.country_id = country.id
            WHERE region.id = """ + region_id + """ 
            AND region.id IS NOT NULL
            ORDER BY region.region_name

        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)


# instantiate the application
app = web.application(urls, locals())
