import decimal

table_prefix = "gestalt_"

def get_connection_string(database_url):
    if not database_url:
        return ""

    list_db_cfg = database_url.split(",")
    DATABASE_NAME = list_db_cfg[0]
    DATABASE_USER = list_db_cfg[1]
    DATABASE_HOST = list_db_cfg[2]
    DATABASE_PORT = list_db_cfg[4]
    connection_string = "host=" + DATABASE_HOST + " user=" + DATABASE_USER + " password=" + list_db_cfg[3] + " dbname=" + DATABASE_NAME
    return connection_string

def decimal_encoder(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError