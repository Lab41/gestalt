/* 
   ------------------------------------------------------------------------- 
   gestalt_panel
   This table lists the panels and contains only information about the
   panels.
   * id: panel id
   * name: panel name
   * url_name: the url used to refer to this panel
   -------------------------------------------------------------------------
 */

DROP TABLE IF EXISTS gestalt_panel;

CREATE TABLE gestalt_panel (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    url_name TEXT NOT NULL CHECK (url_name <> ''),
    UNIQUE (name)
);
 
INSERT INTO gestalt_panel (name, url_name) VALUES
    ('forms','visual-form');
INSERT INTO gestalt_panel (name, url_name) VALUES
    ('tools','visual-tool');
INSERT INTO gestalt_panel (name, url_name) VALUES
    ('contagion','contagion');
INSERT INTO gestalt_panel (name, url_name) VALUES
    ('routers','routers');
INSERT INTO gestalt_panel (name, url_name) VALUES
    ('classification','classification');

