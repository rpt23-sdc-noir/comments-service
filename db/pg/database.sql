DROP DATABASE IF EXISTS sdc_comments;

CREATE DATABASE sdc_comments;

\c sdc_comments;

CREATE TABLE comments(
  comment_id SERIAL PRIMARY KEY,
  user_id INTEGER,
  song_id INTEGER,
  content VARCHAR(255),
  time_stamp INTEGER
);
