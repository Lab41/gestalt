drop table if exists gestalt_persona; create table gestalt_persona (id serial primary key, name text, description text);
 insert into gestalt_persona (name,description) values ('general','Use for a high-level overview with information meant to be understood by anyone.');
 insert into gestalt_persona (name,description) values ('corporate','Use for a high-level overview with information curated for helping you make high-level decisions.');
 insert into gestalt_persona (name,description) values ('subject matter expert','Use for aggregate and detailed information meant to help you gain deeper understanding of the subject already familiar to you.');
 insert into gestalt_persona (name,description) values ('peer','Use for aggregate and detailed information meant to help you understand the data science.');
select * from gestalt_persona;
drop table if exists gestalt_workspace; create table gestalt_workspace (id serial primary key, workspace_name_id integer,persona_id integer,url_name text,is_default boolean);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (1,1,substring(md5(random()::text),0,6),false);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (1,2,substring(md5(random()::text),0,6),false);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (1,3,substring(md5(random()::text),0,6),false);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (1,4,substring(md5(random()::text),0,6),false);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (2,1,substring(md5(random()::text),0,6),true);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (2,2,substring(md5(random()::text),0,6),true);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (2,3,substring(md5(random()::text),0,6),true);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (2,4,substring(md5(random()::text),0,6),true);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (3,1,substring(md5(random()::text),0,6),false);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (3,2,substring(md5(random()::text),0,6),false);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (3,3,substring(md5(random()::text),0,6),false);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (3,4,substring(md5(random()::text),0,6),false);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (4,1,substring(md5(random()::text),0,6),false);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (4,2,substring(md5(random()::text),0,6),false);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (4,3,substring(md5(random()::text),0,6),false);
 insert into gestalt_workspace (workspace_name_id,persona_id,url_name,is_default) values (4,4,substring(md5(random()::text),0,6),false);
select * from gestalt_workspace;
drop table if exists gestalt_workspace_name; create table gestalt_workspace_name (id serial primary key,name text);
 insert into gestalt_workspace_name (name) values ('Gestalt');
 insert into gestalt_workspace_name (name) values ('Economics');
 insert into gestalt_workspace_name (name) values ('IP autonomous systems');
 insert into gestalt_workspace_name (name) values ('SDN anomolies');
select * from gestalt_workspace_name;
drop table if exists gestalt_workspace_panel; create table gestalt_workspace_panel (id serial primary key,workspace_id integer,panel_id integer,is_default boolean);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (1,1,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (2,1,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (3,1,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (4,1,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (1,2,false);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (2,2,false);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (3,2,false);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (4,2,false);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (5,3,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (6,3,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (7,3,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (8,3,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (9,4,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (10,4,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (11,4,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (12,4,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (13,5,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (14,5,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (15,5,true);
 insert into gestalt_workspace_panel (workspace_id,panel_id,is_default) values (16,5,true);
select * from gestalt_workspace_panel;
drop table if exists gestalt_panel; create table gestalt_panel (id serial primary key,name text,url_name text);
 insert into gestalt_panel (name,url_name) values ('forms','visual-form');
 insert into gestalt_panel (name,url_name) values ('tools','visual-tool');
 insert into gestalt_panel (name,url_name) values ('contagion','contagion');
 insert into gestalt_panel (name,url_name) values ('routers','routers');
 insert into gestalt_panel (name,url_name) values ('classification','classification');
select * from gestalt_panel;
drop table if exists gestalt_persona_panel_story; create table gestalt_persona_panel_story (id serial primary key,persona_id integer,panel_id integer,story_id integer);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (1,1,2);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (2,1,2);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (3,1,2);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (4,1,2);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (1,2,1);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (2,2,1);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (3,2,1);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (4,2,1);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (1,3,3);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (2,3,3);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (3,3,3);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (4,3,3);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (1,4,4);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (2,4,4);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (3,4,4);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (4,4,4);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (1,5,4);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (2,5,4);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (3,5,4);
 insert into gestalt_persona_panel_story (persona_id,panel_id,story_id) values (4,5,4);
select * from gestalt_persona_panel_story;
drop table if exists gestalt_story; create table gestalt_story (id serial primary key,name text,url_name text,vis_id integer, action_id integer);
 insert into gestalt_story (name,url_name, vis_id) values ('What tool to use for which data visualization task',substring(md5(random()::text),0,6),3);
 insert into gestalt_story (name,url_name, vis_id) values ('What visual form best communicates your dataset',substring(md5(random()::text),0,6),3);
 insert into gestalt_story (name,url_name, vis_id, action_id) values ('GDP',substring(md5(random()::text),0,6),16,5);
 insert into gestalt_story (name,url_name, vis_id) values ('tbd',substring(md5(random()::text),0,6),3);
select * from gestalt_story;
drop table if exists gestalt_story_idea; create table gestalt_story_idea (id serial primary key,vis_type_id integer,name text,label text,description text, story_id integer, action_id integer, svg_icon text);
 insert into gestalt_story_idea (name,label,description,story_id,action_id) values ('Neque lorem cursus curabitur vulputate quis iaculis', 'filter', 'Augue proin non augue gravida sed eleifend lacinia imperdiet dictum aptent venenatis ad malesuada.Nulla etiam magna suscipit nam donec consequat parturient enim.Fames neque scelerisque pede consequat tortor fusce at aptent pede ve.',3,1);
 insert into gestalt_story_idea (name,label,description,story_id,action_id) values ('Etiam felis nostra', 'color', 'Velit risus.Magna justo.Curae etiam scelerisque per.Metus ipsum.Dolor morbi neque vel velit fermentum.',3,2);
 insert into gestalt_story_idea (name,label,description,story_id,action_id) values ('Purus nulla lectus', 'cluster', 'Justo porta senectus purus lectus.Vitae lacus dapibus et mi ut.Lacus metus tortor accumsan parturient laoreet orci eni velit.Augue proin sit urna vestibulum ultricies enim hymenaeos congue volutpat ipsum.Etiam felis nostra.',3,3);
 insert into gestalt_story_idea (vis_type_id, name,label,description,story_id,action_id,svg_icon) values (1,'Comparison', 'comparison', 'Datasets should compare at least 2 values against each other.',2,4, '<svg viewBox="0 0 100 100"><path d="M79.8,39.1c-7.6,0-13.8,6.2-13.8,13.8s6.2,13.8,13.8,13.8c7.6,0,13.8-6.2,13.8-13.8S87.4,39.1,79.8,39.1z M75.7,41.9  l-6.9,6.9C70,45.6,72.5,43.1,75.7,41.9z M68,52.9c0-0.5,0-0.9,0.1-1.4l10.4-10.4c0.4-0.1,0.9-0.1,1.4-0.1c0.3,0,0.7,0,1,0.1  L68.1,53.9C68,53.6,68,53.3,68,52.9z M68.4,55.8l14.3-14.3c0.6,0.1,1.2,0.3,1.7,0.6L68.9,57.5C68.7,56.9,68.5,56.4,68.4,55.8z   M69.6,58.9l16.1-16.1c0.5,0.3,1,0.7,1.5,1L70.7,60.4C70.3,59.9,70,59.4,69.6,58.9z M71.7,61.5l16.7-16.7c0.4,0.4,0.7,0.8,1.1,1.3  L73,62.6C72.5,62.2,72.1,61.9,71.7,61.5z M74.3,63.4l15.9-15.9c0.3,0.6,0.6,1.2,0.8,1.8L76.1,64.1C75.5,63.9,74.9,63.7,74.3,63.4z   M82.9,64.3l8.2-8.2C90.1,60.1,86.9,63.2,82.9,64.3z M80.4,64.7c-0.2,0-0.4,0-0.6,0c-0.7,0-1.3-0.1-2-0.2l13.6-13.6  c0.1,0.7,0.2,1.3,0.2,2c0,0.2,0,0.4,0,0.6L80.4,64.7z M20.3,39.1c-7.6,0-13.8,6.2-13.8,13.8s6.2,13.8,13.8,13.8  c7.6,0,13.8-6.2,13.8-13.8S28,39.1,20.3,39.1z M20.3,64.7c-6.5,0-11.8-5.3-11.8-11.8s5.3-11.8,11.8-11.8s11.8,5.3,11.8,11.8  S26.9,64.7,20.3,64.7z M48.2,52.1c0.1,0.1,0.2,0.2,0.2,0.4c0,0.2-0.1,0.3-0.2,0.4l-4,2.7c-0.1,0.1-0.2,0.1-0.3,0.1  c-0.1,0-0.2,0-0.2-0.1c-0.2-0.1-0.3-0.3-0.3-0.4V54h-7.5c-0.2,0-0.4-0.2-0.4-0.4v-2.3c0-0.2,0.2-0.4,0.4-0.4h7.5v-1.2  c0-0.2,0.1-0.4,0.3-0.4c0.2-0.1,0.4-0.1,0.5,0L48.2,52.1z M64.2,51.3v2.3c0,0.2-0.2,0.4-0.4,0.4h-7.5v1.2c0,0.2-0.1,0.4-0.3,0.4  c-0.1,0-0.2,0.1-0.2,0.1c-0.1,0-0.2,0-0.3-0.1l-4-2.7c-0.1-0.1-0.2-0.2-0.2-0.4c0-0.2,0.1-0.3,0.2-0.4l4-2.7c0.2-0.1,0.4-0.1,0.5,0  c0.2,0.1,0.3,0.3,0.3,0.4V51h7.5C64.1,51,64.2,51.1,64.2,51.3z"></path></svg>');
 insert into gestalt_story_idea (vis_type_id, name,label,description,story_id,action_id,svg_icon) values (3,'Hierarchy', 'hierarchy', 'Datasets should compare levels of association between values.',2,4, '<svg viewBox="0 0 100 100"><g><path d="M49.6,48.3c7.6,0,13.8-6.2,13.8-13.8c0-7.6-6.2-13.8-13.8-13.8s-13.8,6.2-13.8,13.8C35.8,42.1,42,48.3,49.6,48.3z    M52.7,45.9l8.2-8.2C59.9,41.7,56.7,44.8,52.7,45.9z M61.4,34.5c0,0.2,0,0.4,0,0.6L50.2,46.3c-0.2,0-0.4,0-0.6,0   c-0.7,0-1.3-0.1-2-0.2l13.6-13.6C61.4,33.2,61.4,33.8,61.4,34.5z M60.1,29c0.3,0.6,0.6,1.2,0.8,1.8L45.9,45.7   c-0.6-0.2-1.2-0.5-1.8-0.8L60.1,29z M59.2,27.7L42.8,44.2c-0.5-0.3-0.9-0.7-1.3-1.1l16.7-16.7C58.6,26.8,58.9,27.3,59.2,27.7z    M45.5,23.5l-6.9,6.9C39.8,27.2,42.3,24.7,45.5,23.5z M37.8,34.5c0-0.5,0-0.9,0.1-1.4l10.4-10.4c0.4-0.1,0.9-0.1,1.4-0.1   c0.3,0,0.7,0,1,0.1L37.9,35.5C37.8,35.2,37.8,34.9,37.8,34.5z M38.2,37.4l14.3-14.3c0.6,0.1,1.2,0.3,1.7,0.6L38.7,39.1   C38.5,38.5,38.3,38,38.2,37.4z M55.6,24.4c0.5,0.3,1,0.7,1.5,1L40.5,42c-0.4-0.5-0.7-1-1-1.5L55.6,24.4z"></path><path d="M31.5,68.2c-2.7,0-4.9,2.2-4.9,4.9c0,2.7,2.2,4.9,4.9,4.9s4.9-2.2,4.9-4.9C36.4,70.4,34.2,68.2,31.5,68.2z"></path><path d="M70.3,38.2c2.7,0,4.9-2.2,4.9-4.9s-2.2-4.9-4.9-4.9c-2.7,0-4.9,2.2-4.9,4.9S67.6,38.2,70.3,38.2z M70.3,30.5   c1.6,0,2.9,1.3,2.9,2.9s-1.3,2.9-2.9,2.9c-1.6,0-2.9-1.3-2.9-2.9S68.7,30.5,70.3,30.5z"></path><path d="M33.5,38.1c0-3.2-2.6-5.8-5.8-5.8s-5.8,2.6-5.8,5.8c0,3.2,2.6,5.8,5.8,5.8S33.5,41.3,33.5,38.1z"></path><path d="M46.9,57.1c0,3.4,2.7,6.1,6.1,6.1s6.1-2.7,6.1-6.1S56.4,51,53,51S46.9,53.7,46.9,57.1z M57.1,57.1c0,2.3-1.8,4.1-4.1,4.1   s-4.1-1.8-4.1-4.1c0-2.2,1.8-4.1,4.1-4.1S57.1,54.8,57.1,57.1z"></path><path d="M67.4,58c-4.8,0-8.7,3.9-8.7,8.7s3.9,8.7,8.7,8.7s8.7-3.9,8.7-8.7S72.3,58,67.4,58z"></path><path d="M34,66.4c5.7,0,10.3-4.6,10.3-10.3S39.7,45.8,34,45.8c-5.7,0-10.3,4.6-10.3,10.3S28.3,66.4,34,66.4z M34,47.8   c4.6,0,8.3,3.7,8.3,8.3c0,4.6-3.7,8.3-8.3,8.3s-8.3-3.7-8.3-8.3C25.7,51.5,29.4,47.8,34,47.8z"></path><path d="M48.2,64.9c-5.3,0-9.6,4.3-9.6,9.6s4.3,9.6,9.6,9.6s9.6-4.3,9.6-9.6S53.5,64.9,48.2,64.9z M47,81.9   c-0.8-0.1-1.5-0.4-2.2-0.7L55,71.1c0.3,0.7,0.6,1.4,0.7,2.2L47,81.9z M49.5,67c0.7,0.1,1.4,0.4,2,0.7L41.4,77.8   c-0.3-0.6-0.5-1.3-0.7-2L49.5,67z M47.4,66.9l-6.8,6.8C41,70.2,43.9,67.3,47.4,66.9z M42.2,79.1l10.6-10.6c0.5,0.4,0.9,0.8,1.3,1.3   L43.5,80.4C43,80.1,42.6,79.6,42.2,79.1z M49.1,82l6.6-6.6C55.3,78.8,52.5,81.6,49.1,82z"></path><path d="M69.8,56.1c4.4,0,8-3.6,8-8s-3.6-8-8-8s-8,3.6-8,8S65.4,56.1,69.8,56.1z M72.7,53.4l2.5-2.5C74.6,52,73.7,52.8,72.7,53.4z    M75.5,46.1c0.2,0.6,0.3,1.3,0.3,2c0,0,0,0,0,0l-6,6c0,0,0,0,0,0c-0.7,0-1.4-0.1-2-0.3L75.5,46.1z M74.8,44.7l-8.4,8.4   c-0.6-0.4-1.1-0.9-1.5-1.5l8.4-8.4C73.9,43.6,74.4,44.1,74.8,44.7z M67.2,42.7l-2.8,2.8C65,44.3,66,43.3,67.2,42.7z M69.9,42.1   c0.7,0,1.3,0.1,2,0.4l-7.7,7.7c-0.2-0.6-0.4-1.3-0.4-2L69.9,42.1z"></path></g></svg>');
 insert into gestalt_story_idea (vis_type_id,name,label,description,story_id,action_id,svg_icon) values (5,'Relatedness', 'relatedness', 'Datasets should compare at least one dimension of relatedness between values.',2,4, '<svg viewBox="0 0 100 100"><path d="M16.1,52.7c-5.7,0-10.3,4.6-10.3,10.3s4.6,10.3,10.3,10.3c5.7,0,10.3-4.6,10.3-10.3S21.8,52.7,16.1,52.7z M14.8,71.2  c-0.9-0.1-1.7-0.4-2.5-0.8l11.2-11.2c0.4,0.8,0.7,1.6,0.8,2.5L14.8,71.2z M17.5,54.8c0.8,0.1,1.6,0.4,2.4,0.8L8.7,66.7  C8.3,66,8,65.2,7.9,64.4L17.5,54.8z M15.5,54.7l-7.7,7.7C8.1,58.3,11.4,55,15.5,54.7z M9.5,68l11.6-11.6c0.6,0.4,1.1,0.9,1.5,1.5  L11,69.5C10.4,69.1,9.9,68.6,9.5,68z M16.9,71.2l7.5-7.5C24,67.7,20.8,70.9,16.9,71.2z M50.4,52.7c-5.7,0-10.3,4.6-10.3,10.3  s4.6,10.3,10.3,10.3S60.7,68.7,60.7,63S56.1,52.7,50.4,52.7z M50.4,71.3c-4.6,0-8.3-3.7-8.3-8.3c0-4.6,3.7-8.3,8.3-8.3  s8.3,3.7,8.3,8.3C58.7,67.6,54.9,71.3,50.4,71.3z M94.7,63c0,5.7-4.6,10.3-10.3,10.3c-5.7,0-10.3-4.6-10.3-10.3s4.6-10.3,10.3-10.3  C90.1,52.7,94.7,57.3,94.7,63z M16.1,27.2c-5.7,0-10.3,4.6-10.3,10.3c0,5.7,4.6,10.3,10.3,10.3c5.7,0,10.3-4.6,10.3-10.3  C26.4,31.8,21.8,27.2,16.1,27.2z M14.8,45.7c-0.9-0.1-1.7-0.4-2.5-0.8l11.2-11.2c0.4,0.8,0.7,1.6,0.8,2.5L14.8,45.7z M17.5,29.3  c0.8,0.1,1.6,0.4,2.4,0.8L8.7,41.3c-0.4-0.7-0.6-1.5-0.8-2.4L17.5,29.3z M15.5,29.2l-7.7,7.7C8.1,32.8,11.4,29.5,15.5,29.2z   M9.5,42.6l11.6-11.6c0.6,0.4,1.1,0.9,1.5,1.5L11,44.1C10.4,43.6,9.9,43.1,9.5,42.6z M16.9,45.8l7.5-7.5  C24,42.2,20.8,45.4,16.9,45.8z M50.4,27.2c-5.7,0-10.3,4.6-10.3,10.3c0,5.7,4.6,10.3,10.3,10.3s10.3-4.6,10.3-10.3  C60.7,31.8,56.1,27.2,50.4,27.2z M50.4,45.8c-4.6,0-8.3-3.7-8.3-8.3c0-4.6,3.7-8.3,8.3-8.3s8.3,3.7,8.3,8.3  C58.7,42.1,54.9,45.8,50.4,45.8z M74.1,37.5c0-5.7,4.6-10.3,10.3-10.3c5.7,0,10.3,4.6,10.3,10.3c0,5.7-4.6,10.3-10.3,10.3  C78.7,47.8,74.1,43.2,74.1,37.5z"></path></svg>');
 insert into gestalt_story_idea (vis_type_id,name,label,description,story_id,action_id,svg_icon) values (4,'Part(s) of a Whole', 'parts of a whole', 'Datasets should compare values as a subset of a whole.',2,4,'<svg viewBox="0 0 100 100"><path d="M49.5,11c-21.5,0-39,17.5-39,39s17.5,39,39,39s39-17.5,39-39S71,11,49.5,11z M24.7,62c0-1.5,0.1-3,0.4-4.5l19.7-19.9  c1.5-0.3,3.1-0.4,4.7-0.4c0.2,0,0.5,0,0.7,0L24.8,62.7C24.7,62.5,24.7,62.2,24.7,62z M25.8,54.7c2.4-7.8,8.5-13.9,16.2-16.4  L25.8,54.7z M52.2,37.4c1.5,0.2,3,0.5,4.4,0.9L25.8,69.1c-0.4-1.4-0.7-2.9-0.9-4.4L52.2,37.4z M58.2,38.8c1.2,0.5,2.4,1,3.5,1.7  L47.3,54.9c-7.6,1-13.6,7.1-14.7,14.7L28,74.2c-0.6-1.1-1.2-2.3-1.7-3.5L58.2,38.8z M36.8,83.3c-0.2-0.1-0.3-0.2-0.5-0.3l0.1-0.1  C36.6,83,36.7,83.2,36.8,83.3z M66,76.6l7.3-7.3c-1.8,5.9-5.8,10.9-11,14C64,81.4,65.3,79.1,66,76.6z M74.3,62  c0,1.5-0.1,3.1-0.4,4.5l-7.4,7.4c0.1-0.7,0.1-1.4,0.1-2.1c0-1.1-0.1-2.1-0.3-3.2l7.9-7.9C74.3,61.2,74.3,61.6,74.3,62z M65.9,67  c-0.4-1.4-1-2.7-1.7-3.9l8.9-8.9c0.5,1.5,0.8,3,1,4.6L65.9,67z M63.4,61.8c-0.8-1.1-1.7-2.1-2.8-3l10-10c0.8,1.2,1.4,2.5,2,3.8  L63.4,61.8z M59.4,57.9c-1-0.7-2.2-1.4-3.4-1.9l11.3-11.3c0.9,0.9,1.7,1.8,2.4,2.9L59.4,57.9z M54.4,55.5c-1.6-0.5-3.2-0.7-4.9-0.7  L63,41.2c1.1,0.7,2.2,1.5,3.2,2.4L54.4,55.5z M32.4,71.9c0,1.7,0.3,3.3,0.7,4.9l-1.9,1.9c-0.9-1-1.7-2.1-2.4-3.2L32.4,71.9z   M33.7,78.3c0.5,1.2,1.1,2.3,1.9,3.4l-0.4,0.4c-1-0.7-2-1.5-2.9-2.4L33.7,78.3z M66.1,83c6.2-4.9,10.2-12.5,10.2-21  c0-14.8-12-26.8-26.8-26.8S22.7,47.2,22.7,62c0,8.5,4,16.1,10.2,21c-12.1-6.1-20.4-18.6-20.4-33c0-20.4,16.6-37,37-37s37,16.6,37,37  C86.5,64.4,78.2,76.9,66.1,83z"></path></svg>');
 insert into gestalt_story_idea (vis_type_id,name,label,description,story_id,action_id,svg_icon) values (2,'Time Series', 'time series','Datasets should compare changes in values across time.',2,4,'<svg viewBox="0 0 100 100"><path d="M14.7,45.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S20.3,45.1,14.7,45.1z M14.7,63.1c-4.4,0-8-3.6-8-8s3.6-8,8-8 s8,3.6,8,8S19.2,63.1,14.7,63.1z M95,55.1c0,5.4-4.4,9.8-9.8,9.8s-9.8-4.4-9.8-9.8s4.4-9.8,9.8-9.8S95,49.7,95,55.1z M38.8,54.7 c0.1,0.1,0.2,0.2,0.2,0.4s-0.1,0.3-0.2,0.4l-4,2.7c-0.1,0.1-0.2,0.1-0.3,0.1s-0.2,0-0.2-0.1c-0.2-0.1-0.3-0.3-0.3-0.4v-1.2h-7.5 c-0.2,0-0.4-0.2-0.4-0.4v-2.3c0-0.2,0.2-0.4,0.4-0.4H34v-1.2c0-0.2,0.1-0.4,0.3-0.4c0.2-0.1,0.4-0.1,0.5,0L38.8,54.7z M60.9,54 c0-0.2,0.2-0.4,0.4-0.4h7.5v-1.2c0-0.2,0.1-0.4,0.3-0.4c0.1,0,0.2-0.1,0.2-0.1c0.1,0,0.2,0,0.3,0.1l4,2.7c0.1,0.1,0.2,0.2,0.2,0.4 c0,0.2-0.1,0.3-0.2,0.4l-4,2.7c-0.2,0.1-0.4,0.1-0.5,0c-0.2-0.1-0.3-0.3-0.3-0.4v-1.2h-7.5c-0.2,0-0.4-0.2-0.4-0.4V54z M49.9,45.3 c-5.4,0-9.7,4.4-9.7,9.7s4.4,9.7,9.7,9.7s9.7-4.4,9.7-9.7S55.3,45.3,49.9,45.3z M48.7,62.7c-0.8-0.1-1.6-0.4-2.3-0.7l10.3-10.3 c0.4,0.7,0.6,1.5,0.7,2.3L48.7,62.7z M51.2,47.4c0.7,0.1,1.5,0.4,2.1,0.7L43,58.5c-0.3-0.7-0.6-1.4-0.7-2.1L51.2,47.4z M49.2,47.4 l-7,7C42.5,50.6,45.5,47.7,49.2,47.4z M43.8,59.8L54.6,49c0.5,0.4,1,0.8,1.4,1.3L45.1,61.1C44.6,60.7,44.2,60.3,43.8,59.8z M50.8,62.7l6.8-6.8C57.2,59.5,54.3,62.3,50.8,62.7z"/></svg>');
select * from gestalt_story_idea;
drop table if exists gestalt_story_action; create table gestalt_story_action (id serial primary key,name text);
 insert into gestalt_story_action (name) values ('cluster');
 insert into gestalt_story_action (name) values ('size');
 insert into gestalt_story_action (name) values ('link');
 insert into gestalt_story_action (name) values ('load');
 insert into gestalt_story_action (name) values ('color');
 insert into gestalt_story_action (name) values ('filter');
select * from gestalt_story_action;
drop table if exists gestalt_vertex; create table gestalt_vertex (id serial primary key,name text);
 insert into gestalt_vertex (name) values ('equal');
 insert into gestalt_vertex (name) values ('high degree');
 insert into gestalt_vertex (name) values ('high centrality');
select * from gestalt_vertex;
drop table if exists gestalt_flow; create table gestalt_flow (id serial primary key,name text);
 insert into gestalt_flow (name) values ('none');
 insert into gestalt_flow (name) values ('unique targets');
select * from gestalt_flow;
drop table if exists gestalt_heuristic; create table gestalt_heuristic (id serial primary key,name text);
 insert into gestalt_heuristic (name) values ('more');
select * from gestalt_heuristic;
drop table if exists gestalt_color; create table gestalt_color (id serial primary key,name text);
 insert into gestalt_color (name) values ('option 1');
select * from gestalt_color;
drop table if exists gestalt_emphasis; create table gestalt_emphasis (id serial primary key,name text);
 insert into gestalt_emphasis (name) values ('option 1');
 insert into gestalt_emphasis (name) values ('option 2');
select * from gestalt_emphasis;
drop table if exists gestalt_story_action_control; create table gestalt_story_action_control (id serial primary key,name_id integer,story_action_id integer);
 insert into gestalt_story_action_control (name_id,story_action_id) values (1,1);
 insert into gestalt_story_action_control (name_id,story_action_id) values (2,1);
 insert into gestalt_story_action_control (name_id,story_action_id) values (3,1);
 insert into gestalt_story_action_control (name_id,story_action_id) values (4,1);
 insert into gestalt_story_action_control (name_id,story_action_id) values (5,1);
 insert into gestalt_story_action_control (name_id,story_action_id) values (6,1);
 insert into gestalt_story_action_control (name_id,story_action_id) values (1,2);
 insert into gestalt_story_action_control (name_id,story_action_id) values (2,2);
 insert into gestalt_story_action_control (name_id,story_action_id) values (3,2);
 insert into gestalt_story_action_control (name_id,story_action_id) values (1,3);
 insert into gestalt_story_action_control (name_id,story_action_id) values (2,3);
 insert into gestalt_story_action_control (name_id,story_action_id) values (1,4);
 insert into gestalt_story_action_control (name_id,story_action_id) values (1,5);
 insert into gestalt_story_action_control (name_id,story_action_id) values (2,5);
 insert into gestalt_story_action_control (name_id,story_action_id) values (3,5);
 insert into gestalt_story_action_control (name_id,story_action_id) values (4,5);
 insert into gestalt_story_action_control (name_id,story_action_id) values (6,5);
select * from gestalt_story_action_control;
drop table if exists gestalt_vis_type; CREATE TABLE gestalt_vis_type (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    url_name text,
    UNIQUE (name)
);
INSERT INTO gestalt_vis_type (name,url_name) VALUES ('comparison', 'comparison');
INSERT INTO gestalt_vis_type (name,url_name) VALUES ('time series', 'time-series');
INSERT INTO gestalt_vis_type (name,url_name) VALUES ('hierarchy', 'hierarchy');
INSERT INTO gestalt_vis_type (name,url_name) VALUES ('parts of a whole', 'parts-of-a-whole');
INSERT INTO gestalt_vis_type (name,url_name) VALUES ('relatedness','relatedness');
INSERT INTO gestalt_vis_type (name,url_name) VALUES ('geospatial','geospatial');
select * from gestalt_vis_type;
drop table if exists gestalt_vis_directive;
CREATE TABLE gestalt_vis_directive (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    UNIQUE (name)

);
INSERT INTO gestalt_vis_directive (name) VALUES ('bar-chart');
INSERT INTO gestalt_vis_directive (name) VALUES ('group-nodes');
INSERT INTO gestalt_vis_directive (name) VALUES ('visualization-standard');
INSERT INTO gestalt_vis_directive (name) VALUES ('tbd');
INSERT INTO gestalt_vis_directive (name) VALUES ('line-chart');
INSERT INTO gestalt_vis_directive (name) VALUES ('dendrogram');
INSERT INTO gestalt_vis_directive (name) VALUES ('packed-circles');
INSERT INTO gestalt_vis_directive (name) VALUES ('tree-list');
INSERT INTO gestalt_vis_directive (name) VALUES ('heatmap-grid');
INSERT INTO gestalt_vis_directive (name) VALUES ('pie-chart');
INSERT INTO gestalt_vis_directive (name) VALUES ('node-link');
INSERT INTO gestalt_vis_directive (name) VALUES ('adjacent-matrix');
INSERT INTO gestalt_vis_directive (name) VALUES ('tile-grid-map');
select * from gestalt_vis_directive;
drop table if exists gestalt_vis;
CREATE TABLE gestalt_vis (
    id SERIAL PRIMARY KEY,
    vis_type_id INTEGER,
    vis_directive_id INTEGER,
    name TEXT NOT NULL CHECK (name <> ''),
    max_limit INTEGER NOT NULL,
    UNIQUE (name)
);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (1, 1, 'bar chart (horizontal)', 100);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (5, 2, 'group nodes', 500);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (null, 4, 'tbd', 500);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (2, 5, 'spark line', 10);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (1, 1, 'bar chart (vertical)', 100);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (3, 6, 'dendrogram (radial)', 100);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (3, 6, 'dendrogram (linear)', 100);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (3, 7, 'packed circles', 100);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (3, 8, 'tree list', 500);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (2, 5, 'line chart', 10);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (2, 9, 'heatmap grid', 50);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (4, 10, 'pie chart', 10);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (4, 10, 'donut chart', 10);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (5, 11, 'node link diagram', 200);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (5, 12, 'adjacency matrix', 200);
INSERT INTO gestalt_vis (vis_type_id, vis_directive_id, name, max_limit) VALUES 
    (6, 13, 'tile grid map', 300);
select * from gestalt_vis;
drop table if exists gestalt_vis_do_attr;
CREATE TABLE gestalt_vis_do_attr (
    id  serial PRIMARY KEY,
    vis_id integer,
    do_value TEXT NOT NULL CHECK (do_value <> '')
);
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (1, 'Use when you want to compare series of values against one another.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (1, 'Use when you have small differences between each series value.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (1, 'Use when you have greater than 10 series to compare.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use when you want to compare series of values against one another.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use when you have small differences between each series value.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (5, 'Use when you have greater than 10 series to compare.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (6, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (6, 'Use when space is restricted and generally square shaped.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (7, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (7, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (8, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (8, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (9, 'Use for data that is hierarchial.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (9, 'Use when data is more than 6 layers deep or data has more than 100 nodes.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (9, 'Use when space is extremely limited and/or extremely tall/skinny.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (4, 'Use for data that changes over time.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (4, 'Use when space is restricted and generally wider than it is tall.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (4, 'Use for a high-level understanding of a trend or drastic change.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (10, 'Use for data that changes over time.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (10, 'Use when space is restricted and generally wider than it is tall.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (10, 'Use for a high-level understanding of a trend or drastic change.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (11, 'Use for data that changes over time.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (11, 'Use for a high-level understanding of a trend or drastic change.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (11, 'Use when data has more than 10 categories.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (12, 'Use when you want to show a difference between series whose values add up to 100%.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (12, 'Use when available space is generally squared shaped.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (12, 'Use when space available is limited.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (13, 'Use when you want to show a difference between series whose values add up to 100%.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (13, 'Use when available space is generally squared shaped.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (13, 'Use when space available is limited.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (14, 'Use when you want to show entities are related to one another.');
INSERT INTO gestalt_vis_do_attr (vis_id, do_value) VALUES
    (15, 'Use when you want to show entities are related to one another.');
select * from gestalt_vis_do_attr;
drop table if exists gestalt_vis_dont_attr;
CREATE TABLE gestalt_vis_dont_attr (
    id  serial PRIMARY KEY,
    vis_id integer,
    dont_value TEXT NOT NULL CHECK (dont_value <> '')
);
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (1, 'Draw the height of the chart to exceed 500 pixels.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (5, 'Draw the height of the chart to exceed 500 pixels.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (6, 'Use if data is more than 6 layers deep.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (6, 'Use if node labels are longer than 2 words.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (6, 'Use if the difference between the number of nodes between layers is drastic.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (7, 'Use if entire visual does not fit in available space without scrolling.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (8, 'Use if interactivity is not available or when all labels must be visible at once.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (9, 'Use if interactivity is not available or when all labels must be visible at once.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (4, 'Use if data has more than 5 series.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (4, 'Use if difference between each series is less than 10% of the canvas height.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (4, 'Use if exact values of every value in the series is critical to comprehension.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (10, 'Use if data has more than 5 series.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (10, 'Use if difference between each series is less than 10% of the canvas height.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (10, 'Use if exact values of every value in the series is critical to comprehension.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (11, 'Use if exact values of every value in the series is critical to comprehension.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (12, 'Use if the total of all series'' values does not equal 100%.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (12, 'Use if the number of series is greater than 10.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (13, 'Use if the total of all series'' values does not equal 100%.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (13, 'Use if the number of series is greater than 10.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (14, 'Use interactivity is not available.');
INSERT INTO gestalt_vis_dont_attr (vis_id, dont_value) VALUES
    (15, 'Use if data has redudancy in it not important to the story.');
select * from gestalt_vis_dont_attr;
drop table if exists gestalt_vis_attr; create table gestalt_vis_attr (id serial primary key, name text, value text);
insert into gestalt_vis_attr (name,value) values ('orientation', 'horizontal | vertical');
insert into gestalt_vis_attr (name,value) values ('canvas-height', 'integer');
insert into gestalt_vis_attr (name,value) values ('canvas-width', 'integer');
insert into gestalt_vis_attr (name,value) values ('format', 'radial | linear');
insert into gestalt_vis_attr (name,value) values ('viz-data', 'dataset');
insert into gestalt_vis_attr (name) values ('start-group');
insert into gestalt_vis_attr (name) values ('grouping');
insert into gestalt_vis_attr (name,value) values ('stroke-size', 'integer');
insert into gestalt_vis_attr (name,value) values ('use-labels', 'bool');
insert into gestalt_vis_attr (name,value) values ('spark', 'bool');
insert into gestalt_vis_attr (name,value) values ('format', 'donut | pie');
select * from gestalt_vis_attr;
drop table if exists gestalt_vis_code_attr; create table gestalt_vis_code_attr (id serial primary key, vis_id integer, attr_id integer, is_required boolean, attr_value text);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (1,1,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (1,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (1,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (1,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required, attr_value) values (5,1,false, 'vertical');
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (5,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (5,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (5,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (6,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (6,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (6,4,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (6,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (7,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (7,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (7,4,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (7,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (8,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (8,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (8,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (9,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (4,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (4,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (4,8,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (4,9,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required, attr_value) values (4,10,false, true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (4,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (10,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (10,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (10,8,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (10,9,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (10,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (11,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (11,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (11,8,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (11,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (12,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (12,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (12,11,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (12,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (13,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (13,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required, attr_value) values (13,11,false, 'donut');
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (13,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (14,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (14,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (14,5,true);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (15,2,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (15,3,false);
insert into gestalt_vis_code_attr (vis_id, attr_id, is_required) values (15,5,true);
select * from gestalt_vis_code_attr;
drop table if exists gestalt_vis_alt_attr;
CREATE TABLE gestalt_vis_alt_attr (
    vis_id INTEGER,
    alt_vis_directive_id INTEGER NOT NULL
);  
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (6, 7);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (6, 8);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (7, 7);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (7, 8);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (8, 6);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (8, 8);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (9, 6);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (9, 7);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (4, 9);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (10, 9);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (11, 5);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (14, 12);
INSERT INTO gestalt_vis_alt_attr (vis_id, alt_vis_directive_id) VALUES (15, 11);
select * from gestalt_vis_alt_attr;
drop table if exists gestalt_vis_dummy_data_label; create table gestalt_vis_dummy_data_label (id serial primary key, name text);
insert into gestalt_vis_dummy_data_label (name) values ('south');
insert into gestalt_vis_dummy_data_label (name) values ('west');
insert into gestalt_vis_dummy_data_label (name) values ('northeast');
insert into gestalt_vis_dummy_data_label (name) values ('midwest');
insert into gestalt_vis_dummy_data_label (name) values ('alabama');
insert into gestalt_vis_dummy_data_label (name) values ('arkansas');
insert into gestalt_vis_dummy_data_label (name) values ('florida');
insert into gestalt_vis_dummy_data_label (name) values ('alaska');
insert into gestalt_vis_dummy_data_label (name) values ('arizona');
insert into gestalt_vis_dummy_data_label (name) values ('california');
insert into gestalt_vis_dummy_data_label (name) values ('connecticut');
insert into gestalt_vis_dummy_data_label (name) values ('delaware');
insert into gestalt_vis_dummy_data_label (name) values ('illinois');
insert into gestalt_vis_dummy_data_label (name) values ('iowa');
insert into gestalt_vis_dummy_data_label (name) values ('kansas');
select * from gestalt_vis_dummy_data_label;
drop table if exists gestalt_vis_dummy_data; create table gestalt_vis_dummy_data (id serial primary key, name_id integer, value float, date text, vis_id integer);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (1, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 1);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (2, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 1);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (4, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 1);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (3, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 1);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (1, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 5);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (2, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 5);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (4, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 5);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (3, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 5);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (1, 4);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (2, 4);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (3, 4);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (4, 4);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (1, 10);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (2, 10);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (3, 10);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (4, 10);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (1, 11);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (2, 11);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (3, 11);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (4, 11);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (5, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (6, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (7, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (8, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (9, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (10, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (11, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (12, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (13, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (14, 14);
insert into gestalt_vis_dummy_data (name_id, vis_id) values (15, 14);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (1, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 12);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (2, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 12);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (4, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 12);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (3, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 12);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (1, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 13);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (2, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 13);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (4, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 13);
insert into gestalt_vis_dummy_data (name_id, value, date, vis_id) values (3, trunc(random() * 49 + 1), '2014-01-04T00:00:00Z+00:00', 13);
select * from gestalt_vis_dummy_data;
drop table if exists gestalt_vis_dummy_data_values; create table gestalt_vis_dummy_data_values (id serial primary key, data_id integer, value float, date text);
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (9, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (9, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (9, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (9, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (10, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (10, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (10, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (10, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (11, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (11, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (11, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (11, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (12, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (12, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (12, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (12, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (13, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (13, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (13, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (13, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (14, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (14, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (14, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (14, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (15, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (15, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (15, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (15, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (16, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (16, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (16, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (16, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (17, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (17, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (17, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (17, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (18, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (18, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (18, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (18, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (19, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (19, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (19, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (19, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (20, trunc(random() * 49 + 1), '2014-01-01T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (20, trunc(random() * 49 + 1), '2014-01-02T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (20, trunc(random() * 49 + 1), '2014-01-03T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value, date) values (20, trunc(random() * 49 + 1), '2014-01-04T08:00:00.000Z+00:00');
insert into gestalt_vis_dummy_data_values (data_id, value) values (21, trunc(random() * 15 + 5));
insert into gestalt_vis_dummy_data_values (data_id, value) values (22, trunc(random() * 15 + 5));
insert into gestalt_vis_dummy_data_values (data_id, value) values (23, trunc(random() * 15 + 5));
insert into gestalt_vis_dummy_data_values (data_id, value) values (24, trunc(random() * 15 + 5));
insert into gestalt_vis_dummy_data_values (data_id, value) values (25, trunc(random() * 15 + 5));
insert into gestalt_vis_dummy_data_values (data_id, value) values (26, trunc(random() * 15 + 5));
insert into gestalt_vis_dummy_data_values (data_id, value) values (27, trunc(random() * 15 + 5));
select * from gestalt_vis_dummy_data_values;