CREATE TABLE gestalt_story (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    url_name TEXT UNIQUE NOT NULL CHECK (url_name <> ''),
    UNIQUE (name, url_name)
);

INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Different country groups result in varied contagion levels', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Cross border spillover infects financial system', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Greatest risks for financial disaster', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Capital investment flows between pseudo country groups', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What tool to use for which data visualization task', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What visual form best communicates your dataset', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Use data science to choose visuals', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Scenario based visualizations in visual gestalt_storytelling', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What we learned about gathering metrics for data visualization', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('How a social media gestalt_story moves through social networks', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('How a social media gestalt_story evolves into viral status', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Tracking events through social networks in location based tweets', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What is the life-cycle of a trending social gestalt_story across geographies', md5(random()::text));
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What events can be predicted from social data trends', md5(random()::text));
 

CREATE TABLE gestalt_story_tag (
    story_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (story_id, tag_id)
);
 
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (1, 1);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (1, 5);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (2, 1);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (2, 5);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (3, 2);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (3, 5);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (4, 1);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (4, 5);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (5, 3);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (5, 4);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (5, 6);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (6, 3);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (6, 7);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (7, 3);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (7, 4);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (8, 3);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (9, 3);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (9, 4);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (9, 6);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (9, 7);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (10, 4);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (10, 8);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (11, 4);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (11, 8);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (12, 8);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (12, 9);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (13, 4);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (13, 8);
INSERT INTO gestalt_story_tag (story_id, tag_id) VALUES (14, 9);