CREATE TABLE gestalt_story (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    url_name TEXT UNIQUE NOT NULL CHECK (url_name <> ''),
    UNIQUE (name, url_name)
);

INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Different country groups result in varied contagion levels', '323a3738dd81639f491d1c32f9954da7');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Cross border spillover infects financial system', 'd7079e1dadda417b35edc363753a3272');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Greatest risks for financial disaster', '2cb371055a85250b67d8592578a0578f');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Capital investment flows between pseudo country groups', 'a498f8b4013c6fd3bc9110fd6eddf4d6');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What tool to use for which data visualization task', '05601d2dbb636e06301ffa846b871332');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What visual form best communicates your dataset', 'cae8ad1832005c88c2919e50ddd2fb56');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Use data science to choose visuals', '234424fb624fb8eb6870f6232f117882');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Scenario based visualizations in visual gestalt_storytelling', 'df84f3f13935907918af2017360f6d31');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What we learned about gathering metrics for data visualization', '31afd6c73b3e3aa65aaa4f9197324566');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('How a social media gestalt_story moves through social networks', '54ce007009b6d704cbaa7a5c1d0f86bd');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('How a social media gestalt_story evolves into viral status', 'a115437f762819de185527a3cecf79a8');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('Tracking events through social networks in location based tweets', 'cc3a353ca54dc9b1073f74d2bbc8aec8');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What is the life-cycle of a trending social gestalt_story across geographies', '6c91c28b0d7b29d7c5f4762d2195550e');
INSERT INTO gestalt_story (name, url_name) VALUES 
    ('What events can be predicted from social data trends', '109a0b34fbb89ed7c294ebdc99ad6b9f');
 
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