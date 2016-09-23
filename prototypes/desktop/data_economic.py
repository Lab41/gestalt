import json
import os
import psycopg2
import psycopg2.extras
import web
from decimal import Decimal

import helper

urls = (
    
    # 0.0.0.0:8000/api/data/economic/getAllSources
    "getAllSources", "getAllSources",
    # 0.0.0.0:8000/api/data/economic/getAllSeriesByTableName
    #   where # == table name
    "getAllSeriesByTableName/(\w+)", "getAllSeriesByTableName",
    # 0.0.0.0:8000/api/data/economic/insertSeriesToMV/table_name/#/series/#
    #   where first # == table name, second # == series id
    "insertSeriesToMV/table_name/(\w+)/series/(\d+)", "insertSeriesToMV",
    # 0.0.0.0:8000/api/data/economic/extractSeriesValuesByCountry/series/#/country/#
    #   where first # == series id, second # == country id
    "extractSeriesValuesByCountry/series/(\d+)/country/(\d+)", "extractSeriesValuesByCountry",
    # 0.0.0.0:8000/api/data/economic/extractSeriesValuesByCountryAndDate/series/#/country/#/date/#
    #   where first # == series id, second # == country id, third # == date
    "extractSeriesValuesByCountryAndDate/series/(\d+)/country/(\d+)/date/(\w+)", "extractSeriesValuesByCountryAndDate",
    # 0.0.0.0:8000/api/data/economic/extractSeriesValuesByRegionAndDate/series/#/group/#/subgroup/#/date/#
    #   where first # == series id, second # == group id, third # == subgroup id, fourth # == date
    "extractSeriesValuesByRegionAndDate/series/(\d+)/group/(\d+)/subgroup/(\d+)/date/(\w+)", "extractSeriesValuesByRegionAndDate",
    # 0.0.0.0:8000/api/data/economic/extractSeriesValuesByRegion/series/#/group/#/subgroup/#
    #   where first # == series id, second # == country id, third # == date
    "extractSeriesValuesByRegion/series/(\d+)/group/(\d+)/subgroup/(\d+)", "extractSeriesValuesByRegion",
    # 0.0.0.0:8000/api/data/economic/getAllSubgroupsByGroup/#
    #   where # == group id
    "getAllSubgroupsByGroup/(\d+)", "getAllSubgroupsByGroup",
    # 0.0.0.0:8000/api/data/economic/getAllCountriesBySubgroup/group/#/subgroup/#
    #   where first # == group id, second # == subgroup id
    "getAllCountriesBySubgroup/group/(\d+)/subgroup/(\d+)", "getAllCountriesBySubgroup",
    # 0.0.0.0:8000/api/data/economic/cleanupMV
    "cleanupMV", "cleanupMV",

)

class getAllSources: 
    """ Each source is stored in its own individual table. 
        getAllSources extracts the name of those tables. 
    output:
        * table name
    """
    def GET(self, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_name LIKE 'gestalt_source%'
            ORDER BY table_name;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data) 

class getAllSeriesByTableName: 
    """ Each series provides a subset of information (i.e. population) about a country.
        getAllSeriesByTableName extracts all the series from a given source table.
    input:
        * table name
    output:
        * series.id
        * series.name
    """
    def GET(self, table_name, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (src.series_id) src.series_id, series.code, series.description
            FROM """ + table_name + """ AS src
                INNER JOIN gestalt_series AS series
                ON src.series_id = series.id
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)    

class insertSeriesToMV: 
    """ Insert a particular series from a given table into gestalt_frontend_country_data 
        so that we know what data is needed from the front-end.
    input:
        * table name
        * series.id
    """
    def GET(self, table_name, series_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        cursor = connection.cursor()
        # execute query
        cursor.execute("""
            INSERT INTO gestalt_frontend_country_data (source_name, source_id, series_id, country_id, date, date_precision, value) 
                SELECT '""" + table_name + """' AS source_name, src.id, src.series_id, src.country_id, src.date, src.date_precision, src.value 
                FROM """ + table_name + """ AS src
                WHERE src.series_id = """ + series_id + """;
        """)     
        # make changes to the database persistent
        connection.commit()   
        # close 
        cursor.close()
        connection.close()
        return 

class extractSeriesValuesByCountry: 
    """ Extract all the series information (i.e. the nominal GDP) of a given country.
        extractSeriesValuesByCountry == getAllNominalGdpByCountry
                                     == getAllRealGdpByCountry
                                     == getCountryAreaByCountry
    input:
        * series.id
        * country.id
    output:
        * mv.id
        * country.id
        * country.name
        * series.value
        * series.date
    """
    def GET(self, series_id, country_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT mv.id,
                   country.id AS country_id, country.name AS country_name, 
                   mv.value, to_char(mv.date, mv.date_precision) AS date
            FROM gestalt_frontend_country_data AS mv
                INNER JOIN gestalt_country_with_name AS country
                ON mv.country_id = country.id
                INNER JOIN gestalt_series AS series
                ON mv.series_id = series.id
            WHERE mv.series_id = """ + series_id + """
            AND mv.country_id = """ + country_id + """
            ORDER BY country.name;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)

class extractSeriesValuesByCountryAndDate:
    """ Extract the series information (i.e. the nominal GDP) of a given country at a particular date.
        extractSeriesValuesByCountryAndDate == getSingleNominalGdpByCountryAndDate
                                            == getSingleRealGdpByCountryAndDate
    input:
        * series.id
        * country.id
        * series.date
    output:
        * mv.id
        * country.id
        * country.name
        * series.value
        * series.date
    """
    def GET(self, series_id, country_id, date, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT mv.id,
                   country.id AS country_id, country.name AS country_name, 
                   mv.value, to_char(mv.date, mv.date_precision) AS date
            FROM gestalt_frontend_country_data AS mv
                INNER JOIN gestalt_country_with_name AS country
                ON mv.country_id = country.id
                INNER JOIN gestalt_series AS series
                ON mv.series_id = series.id
            WHERE mv.series_id = """ + series_id + """
            AND mv.country_id = """ + country_id + """
            AND to_char(mv.date, mv.date_precision) = '""" + date + """'
            ORDER BY country.name;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)

class extractSeriesValuesByRegionAndDate:
    """ Extract the series information (i.e. the real GDP) of a given region at a particular date.
        extractSeriesValuesByRegionAndDate == getAllRealGdpByRegionAndDate
    input:
        * series.id
        * group.id (i.e. region.group)
        * subgroup.name.id (i.e. region.name)
        * series.date
    output:
        * mv.id
        * country.id 
        * country.name
        * series.value
        * series.date
    """
    def GET(self, series_id, group_id, subgroup_name_id, date, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT mv.id,
                   country.id AS country_id, country.name AS country_name,
                   mv.value, to_char(mv.date, mv.date_precision) AS date
            FROM gestalt_frontend_country_data AS mv
                INNER JOIN gestalt_country_with_name AS country
                ON mv.country_id = country.id
                INNER JOIN gestalt_series AS series
                ON mv.series_id = series.id
                INNER JOIN gestalt_subgroup AS subgroup
                ON mv.country_id = subgroup.country_id
            WHERE mv.series_id = """ + series_id + """
            AND subgroup.group_id = """ + group_id + """
            AND subgroup.name_id = """ + subgroup_name_id + """
            AND to_char(mv.date, mv.date_precision) = '""" + date + """'
            ORDER BY country.name;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)

class extractSeriesValuesByRegion:
    """ Extract the series information (i.e. the real GDP) of a given region at a particular date.
        extractSeriesValuesByRegionAndDate == getAllRealGdpByRegionAndDate
    input:
        * series.id
        * group.id (i.e. region.group)
        * subgroup.name.id (i.e. region.name)
    output:
        * mv.id
        * country.id 
        * country.name
        * series.value
        * series.date
    """
    def GET(self, series_id, group_id, subgroup_name_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT mv.id,
                   country.id AS country_id, country.name AS country_name,
                   mv.value, to_char(mv.date, mv.date_precision) AS date
            FROM gestalt_frontend_country_data AS mv
                INNER JOIN gestalt_country_with_name AS country
                ON mv.country_id = country.id
                INNER JOIN gestalt_series AS series
                ON mv.series_id = series.id
                INNER JOIN gestalt_subgroup AS subgroup
                ON mv.country_id = subgroup.country_id
            WHERE mv.series_id = """ + series_id + """
            AND subgroup.group_id = """ + group_id + """
            AND subgroup.name_id = """ + subgroup_name_id + """
            ORDER BY country.name;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data, default=helper.decimal_encoder)

class getAllSubgroupsByGroup:
    """ Extract all subgroups (i.e. regions) in a given group. 
        getAllSubgroupsByGroup == getAllRegionNamesByRegionGroup
    input:
        * group.id (i.e. region.group)
    output:
        * subgroup.id (i.e. region)
        * subgroup.name.id 
        * subgroup.name
    """
    def GET(self, group_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT DISTINCT ON (subgroup.name_id) subgroup.id, subgroup.name_id, subgroup_name.name
            FROM gestalt_subgroup AS subgroup
                INNER JOIN gestalt_subgroup_name AS subgroup_name
                ON subgroup.name_id = subgroup_name.id
            WHERE subgroup.group_id = """ + group_id + """
            ORDER BY subgroup.name_id;
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)

class getAllCountriesBySubgroup:
    """ Extract all countries in a particular region given the region group's id.
    input:
        * group.id (aka region.group)
        * subgroup.name.id (aka region.name)
    output:
        * country.id
        * country.name
    """
    def GET(self, group_id, subgroup_name_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):
        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # execute query
        self.cursor.execute("""
            SELECT country.id, country.name
            FROM gestalt_subgroup AS subgroup
                INNER JOIN gestalt_country_with_name AS country
                ON subgroup.country_id = country.id
            WHERE subgroup.group_id = """ + group_id + """
            AND subgroup.name_id = """ + subgroup_name_id + """
        """)        
        # obtain the data
        data = self.cursor.fetchall()
        # convert data to a string
        return json.dumps(data)


class cleanupMV:
    """ Delete the content of gestalt_frontend_country_data.
        gestalt_frontend_country_data stores the necessary data needed for front-end.
    """
    def GET(self, region_id, connection_string=helper.get_connection_string(os.environ['DATABASE_URL'])):

        # connect to postgresql based on configuration in connection_string
        connection = psycopg2.connect(connection_string)
        # get a cursor to perform queries
        cursor = connection.cursor()
        # execute query
        cursor.execute("""
            TRUNCATE gestalt_frontend_country_data;
        """)     
        # make changes to the database persistent
        connection.commit()   
        # close 
        cursor.close()
        connection.close()
        return 

# instantiate the application
app = web.application(urls, locals())
