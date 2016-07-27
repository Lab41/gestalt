def get_connection_string(database_url):
    if not database_url:
        return ""

    list_db_cfg = database_url.split(",")
    DATABASE_NAME = list_db_cfg[0]
    DATABASE_USER = list_db_cfg[1]
    DATABASE_HOST = list_db_cfg[2]
    DATABASE_PORT = list_db_cfg[4]
    connection_string = "postgresql://" + DATABASE_USER + "@" + DATABASE_HOST + ":" + DATABASE_PORT + "/" + DATABASE_NAME
    return connection_string
